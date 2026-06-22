// Artifact Registry — Docker repository for Melearn container images.
// Both the frontend and backend Cloud Run services pull from this repo.

resource "google_artifact_registry_repository" "docker" {
  project       = var.project_id
  location      = var.region
  repository_id = var.repository_id
  description   = "Docker images for the Melearn ${var.environment} environment"
  format        = "DOCKER"

  // Keep only the most recent tagged images plus a short window of untagged
  // layers. Free-credit friendly: avoids unbounded storage growth.
  cleanup_policies {
    id     = "keep-recent-tagged"
    action = "KEEP"
    most_recent_versions {
      keep_count = var.keep_tagged_count
    }
  }

  cleanup_policies {
    id     = "delete-old-untagged"
    action = "DELETE"
    condition {
      tag_state  = "UNTAGGED"
      older_than = "604800s" // 7 days
    }
  }

  labels = var.labels
}
