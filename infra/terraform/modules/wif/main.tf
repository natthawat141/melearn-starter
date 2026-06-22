// Workload Identity Federation — keyless GitHub Actions -> GCP auth.
//
// Creates a Workload Identity Pool + an OIDC provider trusting GitHub's token
// issuer, plus a dedicated deployer service account that CI assumes. No JSON
// service-account keys are ever created or stored.
//
// The deployer SA is granted only the roles needed to build/push images, run
// the migration Job, and deploy Cloud Run services (see env wiring).

resource "google_iam_workload_identity_pool" "github" {
  project                   = var.project_id
  workload_identity_pool_id = var.pool_id
  display_name              = var.pool_display_name
  description               = "GitHub Actions OIDC federation for ${var.environment}"
}

resource "google_iam_workload_identity_pool_provider" "github" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = var.provider_id
  display_name                       = "GitHub Actions"

  attribute_mapping = {
    "google.subject"             = "assertion.sub"
    "attribute.repository"       = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
    "attribute.ref"              = "assertion.ref"
  }

  // Hard scope: only tokens from the configured repo are accepted. Without an
  // attribute_condition the provider would trust ANY GitHub repo.
  attribute_condition = "attribute.repository == \"${var.github_repository}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

// Dedicated deployer service account assumed by CI.
resource "google_service_account" "deployer" {
  project      = var.project_id
  account_id   = var.deployer_account_id
  display_name = "Melearn ${var.environment} CI/CD deployer"
  description  = "Assumed by GitHub Actions via WIF to build, push, migrate, and deploy."
}

// Allow the GitHub repo's federated identity to impersonate the deployer SA.
resource "google_service_account_iam_member" "wif_user" {
  service_account_id = google_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repository}"
}

// Project-level roles for the deployer SA (least privilege for a deploy
// pipeline). Scoped to exactly what CD does: push images, run the Job, deploy
// services, and act-as the runtime SAs.
resource "google_project_iam_member" "deployer_roles" {
  for_each = toset(var.deployer_roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}
