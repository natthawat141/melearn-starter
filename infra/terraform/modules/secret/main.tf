// Secret — a single Secret Manager secret plus a least-privilege accessor
// binding for the consuming Cloud Run runtime service account.
//
// IMPORTANT: This module deliberately does NOT create secret *versions*
// (the actual secret values). Values are populated out-of-band so that
// plaintext never lands in Terraform state or the repo. See infra/README.md
// ("Populating secret values").

resource "google_secret_manager_secret" "this" {
  project   = var.project_id
  secret_id = var.secret_id

  replication {
    auto {}
  }

  labels = var.labels
}

// Grant the consuming service account read access to THIS secret only.
resource "google_secret_manager_secret_iam_member" "accessor" {
  for_each = toset(var.accessor_members)

  project   = var.project_id
  secret_id = google_secret_manager_secret.this.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = each.value
}
