output "provider_name" {
  description = "Full WIF provider resource name. Set as the GitHub Actions var WIF_PROVIDER."
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "pool_name" {
  description = "Full Workload Identity Pool resource name."
  value       = google_iam_workload_identity_pool.github.name
}

output "deployer_service_account_email" {
  description = "Deployer SA email. Set as the GitHub Actions var DEPLOYER_SERVICE_ACCOUNT."
  value       = google_service_account.deployer.email
}
