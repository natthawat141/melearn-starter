// ===========================================================================
// Melearn — prod environment
//
// Identical topology to dev (see envs/dev/main.tf), with prod-appropriate
// defaults: deletion protection on, regional Cloud SQL HA, higher max
// instances, PITR backups. Secret values are populated out-of-band, NOT by
// Terraform.
// ===========================================================================

data "google_project" "this" {
  project_id = var.project_id
}

locals {
  common_labels = merge(var.labels, { environment = var.environment })

  frontend_secret_ids = {
    CLERK_SECRET_KEY = "melearn-${var.environment}-clerk-secret-key"
  }

  backend_secret_ids = {
    PAYLOAD_SECRET = "melearn-${var.environment}-payload-secret"
    DATABASE_URL   = "melearn-${var.environment}-database-uri"
    MUX_TOKEN_ID   = "melearn-${var.environment}-mux-token-id"
    MUX_SECRET_KEY = "melearn-${var.environment}-mux-secret-key"
  }

  migrate_secret_ids = {
    PAYLOAD_SECRET = "melearn-${var.environment}-payload-secret"
    DATABASE_URL   = "melearn-${var.environment}-database-uri"
  }

  all_secrets = {
    "melearn-${var.environment}-clerk-secret-key" = ["frontend"]
    "melearn-${var.environment}-payload-secret"   = ["backend", "migrate"]
    "melearn-${var.environment}-database-uri"     = ["backend", "migrate"]
    "melearn-${var.environment}-mux-token-id"     = ["backend"]
    "melearn-${var.environment}-mux-secret-key"   = ["backend"]
  }
}

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "sqladmin.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "monitoring.googleapis.com",
    "cloudbilling.googleapis.com",
    "billingbudgets.googleapis.com",
    "serviceusage.googleapis.com",
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

module "artifact_registry" {
  source = "../../modules/artifact-registry"

  project_id    = var.project_id
  region        = var.region
  repository_id = var.artifact_repository_id
  environment   = var.environment
  labels        = local.common_labels

  depends_on = [google_project_service.apis]
}

module "cloud_sql" {
  source = "../../modules/cloud-sql"

  project_id                     = var.project_id
  region                         = var.region
  instance_name                  = "melearn-${var.environment}-pg"
  database_version               = var.db_version
  tier                           = var.db_tier
  availability_type              = var.db_availability_type
  disk_size                      = var.db_disk_size
  deletion_protection            = var.db_deletion_protection
  point_in_time_recovery_enabled = var.db_pitr_enabled
  database_name                  = var.db_name
  db_user_name                   = var.db_user_name
  db_user_password               = var.db_user_password
  labels                         = local.common_labels

  depends_on = [google_project_service.apis]
}

module "frontend_sa" {
  source = "../../modules/iam"

  project_id                      = var.project_id
  region                          = var.region
  account_id                      = "melearn-${var.environment}-frontend"
  display_name                    = "Melearn ${var.environment} frontend runtime"
  service_name                    = "frontend"
  environment                     = var.environment
  artifact_registry_repository_id = module.artifact_registry.repository_id

  depends_on = [google_project_service.apis]
}

module "backend_sa" {
  source = "../../modules/iam"

  project_id                      = var.project_id
  region                          = var.region
  account_id                      = "melearn-${var.environment}-backend"
  display_name                    = "Melearn ${var.environment} backend runtime"
  service_name                    = "backend"
  environment                     = var.environment
  artifact_registry_repository_id = module.artifact_registry.repository_id
  grant_cloudsql_client           = true

  depends_on = [google_project_service.apis]
}

module "migrate_sa" {
  source = "../../modules/iam"

  project_id                      = var.project_id
  region                          = var.region
  account_id                      = "melearn-${var.environment}-migrate"
  display_name                    = "Melearn ${var.environment} migration job"
  service_name                    = "migrate"
  environment                     = var.environment
  artifact_registry_repository_id = module.artifact_registry.repository_id
  grant_cloudsql_client           = true

  depends_on = [google_project_service.apis]
}

module "secrets" {
  source   = "../../modules/secret"
  for_each = local.all_secrets

  project_id = var.project_id
  secret_id  = each.key
  labels     = local.common_labels

  accessor_members = [
    for svc in each.value : (
      svc == "frontend" ? module.frontend_sa.member :
      svc == "backend" ? module.backend_sa.member :
      module.migrate_sa.member
    )
  ]

  depends_on = [google_project_service.apis]
}

module "backend_migrate" {
  source = "../../modules/cloud-run-job"

  project_id            = var.project_id
  region                = var.region
  job_name              = "melearn-${var.environment}-backend-migrate"
  image                 = "${module.artifact_registry.docker_repo_url}/backend:${var.image_tag}"
  service_account_email = module.migrate_sa.email
  memory                = "1Gi"
  max_retries           = 1
  timeout               = "600s"

  command = ["npm"]
  args    = ["run", "payload", "--", "migrate"]

  cloudsql_connection_name = module.cloud_sql.connection_name

  env_vars = {
    NODE_ENV = "production"
  }

  secret_env_vars = { for env_name, secret_id in local.migrate_secret_ids : env_name => module.secrets[secret_id].secret_id }

  depends_on = [google_project_service.apis]
}

module "frontend" {
  source = "../../modules/cloud-run"

  project_id            = var.project_id
  region                = var.region
  service_name          = "melearn-${var.environment}-frontend"
  image                 = "${module.artifact_registry.docker_repo_url}/frontend:${var.image_tag}"
  service_account_email = module.frontend_sa.email
  container_port        = 3000

  min_instances       = var.frontend_min_instances
  max_instances       = var.frontend_max_instances
  memory              = "512Mi"
  allow_public_access = true
  deletion_protection = var.deletion_protection

  env_vars = merge(
    {
      NODE_ENV                = "production"
      NEXT_PUBLIC_BACKEND_URL = module.backend.url
    },
    var.frontend_public_env,
  )

  secret_env_vars = { for env_name, secret_id in local.frontend_secret_ids : env_name => module.secrets[secret_id].secret_id }

  labels = local.common_labels

  depends_on = [google_project_service.apis]
}

module "backend" {
  source = "../../modules/cloud-run"

  project_id            = var.project_id
  region                = var.region
  service_name          = "melearn-${var.environment}-backend"
  image                 = "${module.artifact_registry.docker_repo_url}/backend:${var.image_tag}"
  service_account_email = module.backend_sa.email
  container_port        = 3000

  min_instances       = var.backend_min_instances
  max_instances       = var.backend_max_instances
  memory              = "1Gi"
  allow_public_access = var.backend_allow_public_access
  deletion_protection = var.deletion_protection

  cloudsql_connection_name = module.cloud_sql.connection_name

  env_vars = {
    NODE_ENV                  = "production"
    CLOUD_SQL_CONNECTION_NAME = module.cloud_sql.connection_name
  }

  secret_env_vars = { for env_name, secret_id in local.backend_secret_ids : env_name => module.secrets[secret_id].secret_id }

  labels = local.common_labels

  depends_on = [google_project_service.apis]
}

module "wif" {
  source = "../../modules/wif"

  project_id          = var.project_id
  environment         = var.environment
  pool_id             = "melearn-${var.environment}-gh"
  provider_id         = "github-provider"
  github_repository   = var.github_repository
  deployer_account_id = "melearn-${var.environment}-deployer"

  depends_on = [google_project_service.apis]
}

module "monitoring" {
  source = "../../modules/monitoring"

  project_id     = var.project_id
  project_number = data.google_project.this.number
  environment    = var.environment
  alert_email    = var.alert_email

  uptime_host = replace(module.frontend.url, "https://", "")
  uptime_path = "/"

  billing_account = var.billing_account
  budget_amount   = var.budget_amount
  budget_currency = var.budget_currency

  depends_on = [google_project_service.apis]
}
