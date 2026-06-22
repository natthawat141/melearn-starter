output "job_name" {
  description = "Name of the Cloud Run Job."
  value       = google_cloud_run_v2_job.this.name
}

output "id" {
  description = "Fully-qualified resource ID of the Job."
  value       = google_cloud_run_v2_job.this.id
}
