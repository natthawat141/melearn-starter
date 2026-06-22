// Cloud Run (v2) — a reusable service module.
//
// Used for both the Melearn frontend (Next.js) and backend (Payload CMS).
// Env vars come in two flavours:
//   * env_vars         — plain, non-sensitive values (rendered inline)
//   * secret_env_vars  — names mapped to Secret Manager secrets (resolved at
//                        runtime by Cloud Run; values never appear in state)

resource "google_cloud_run_v2_service" "this" {
  project             = var.project_id
  name                = var.service_name
  location            = var.region
  deletion_protection = var.deletion_protection
  ingress             = var.ingress

  template {
    service_account = var.service_account_email

    // min=0 keeps the service scaled to zero when idle (free-credit friendly).
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    // Attach Cloud SQL via the connector when a connection name is supplied.
    dynamic "volumes" {
      for_each = var.cloudsql_connection_name == null ? [] : [var.cloudsql_connection_name]
      content {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [volumes.value]
        }
      }
    }

    containers {
      image = var.image

      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
        cpu_idle          = var.min_instances == 0
        startup_cpu_boost = true
      }

      // Plain (non-sensitive) environment variables.
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }

      // Secret-backed environment variables. Each maps an env var name to a
      // Secret Manager secret; "latest" tracks the most recent version.
      dynamic "env" {
        for_each = var.secret_env_vars
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }

      dynamic "volume_mounts" {
        for_each = var.cloudsql_connection_name == null ? [] : [1]
        content {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }

      startup_probe {
        initial_delay_seconds = 5
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 6
        tcp_socket {
          port = var.container_port
        }
      }
    }

    max_instance_request_concurrency = var.concurrency
  }

  labels = var.labels
}

// Public (unauthenticated) invoker access. Controlled by var.allow_public_access.
// For the backend you may want this false and front it with auth/IAP instead.
resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  count = var.allow_public_access ? 1 : 0

  project  = var.project_id
  location = google_cloud_run_v2_service.this.location
  name     = google_cloud_run_v2_service.this.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
