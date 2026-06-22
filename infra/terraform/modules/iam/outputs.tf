output "email" {
  description = "Email address of the runtime service account."
  value       = google_service_account.runtime.email
}

output "id" {
  description = "Fully-qualified resource ID of the runtime service account."
  value       = google_service_account.runtime.id
}

output "member" {
  description = "IAM member string (serviceAccount:<email>) for use in bindings."
  value       = "serviceAccount:${google_service_account.runtime.email}"
}
