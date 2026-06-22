output "frontend_url" {
  description = "Public URL of the Melearn frontend (Next.js) Cloud Run service."
  value       = module.frontend.url
}

output "backend_url" {
  description = "Public URL of the Melearn backend (Payload CMS) Cloud Run service."
  value       = module.backend.url
}

output "artifact_registry_url" {
  description = "Base Docker repo URL for tagging/pushing images."
  value       = module.artifact_registry.docker_repo_url
}

output "frontend_service_account" {
  description = "Email of the frontend runtime service account."
  value       = module.frontend_sa.email
}

output "backend_service_account" {
  description = "Email of the backend runtime service account."
  value       = module.backend_sa.email
}

output "secret_ids" {
  description = "Secret Manager secret IDs created for this environment (values populated out-of-band)."
  value       = [for s in module.secrets : s.secret_id]
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name (project:region:instance) for DATABASE_URL / connector."
  value       = module.cloud_sql.connection_name
}

output "migration_job_name" {
  description = "Name of the one-shot migration Cloud Run Job (run before deploying the backend service)."
  value       = module.backend_migrate.job_name
}

output "wif_provider" {
  description = "WIF provider resource name — set as GitHub Actions var WIF_PROVIDER."
  value       = module.wif.provider_name
}

output "deployer_service_account" {
  description = "Deployer SA email — set as GitHub Actions var DEPLOYER_SERVICE_ACCOUNT."
  value       = module.wif.deployer_service_account_email
}
