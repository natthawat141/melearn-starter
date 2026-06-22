output "secret_id" {
  description = "The Secret Manager secret ID."
  value       = google_secret_manager_secret.this.secret_id
}

output "name" {
  description = "Fully-qualified secret resource name (projects/.../secrets/...)."
  value       = google_secret_manager_secret.this.name
}
