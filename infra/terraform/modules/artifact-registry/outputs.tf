output "repository_id" {
  description = "The Artifact Registry repository ID."
  value       = google_artifact_registry_repository.docker.repository_id
}

output "repository_name" {
  description = "Fully-qualified repository resource name."
  value       = google_artifact_registry_repository.docker.name
}

output "docker_repo_url" {
  description = "Base URL used to tag/push images, e.g. REGION-docker.pkg.dev/PROJECT/REPO."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker.repository_id}"
}
