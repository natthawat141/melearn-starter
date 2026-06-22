// IAM — one dedicated runtime service account per Cloud Run service.
//
// Least privilege: the runtime SA is created with NO project-level roles.
// Secret access is granted per-secret in the `secret` module (secretAccessor
// on the specific secret only), and image pull access is granted on the
// Artifact Registry repository below — not project-wide.

resource "google_service_account" "runtime" {
  project      = var.project_id
  account_id   = var.account_id
  display_name = var.display_name
  description  = "Runtime service account for the ${var.service_name} Cloud Run service (${var.environment})."
}

// Allow this service's runtime SA to pull images from the shared
// Artifact Registry repository. Scoped to the single repository resource.
resource "google_artifact_registry_repository_iam_member" "reader" {
  count = var.artifact_registry_repository_id == null ? 0 : 1

  project    = var.project_id
  location   = var.region
  repository = var.artifact_registry_repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.runtime.email}"
}

// Project-level Cloud SQL client role. Required for the Cloud SQL connector
// (used by the backend service and the migration Job). This is the one role
// the connector needs; it is NOT broad project access.
resource "google_project_iam_member" "cloudsql_client" {
  count = var.grant_cloudsql_client ? 1 : 0

  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}
