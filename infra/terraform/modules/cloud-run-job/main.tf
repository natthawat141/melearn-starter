// Cloud Run v2 Job — one-shot tasks (used for DB migrations).
//
// CRITICAL ARCHITECTURE NOTE
// --------------------------
// Migrations run HERE, as a dedicated one-shot Job, NOT in the app container
// and NOT on app boot. With N horizontally-scaled Cloud Run *service* instances
// running migrations on boot, instances would race and double-apply migrations.
// The CD pipeline runs this Job to completion FIRST, then rolls out the service.
//
// The Job connects to Cloud SQL via the Cloud SQL connector (mounted at
// /cloudsql/<connection_name>). The migration command is supplied by the caller
// (for Payload: `npm run payload -- migrate`).

resource "google_cloud_run_v2_job" "this" {
  project             = var.project_id
  name                = var.job_name
  location            = var.region
  deletion_protection = var.deletion_protection

  template {
    // task_count=1, parallelism=1: migrations are a single, serial task.
    task_count  = 1
    parallelism = 1

    template {
      service_account = var.service_account_email
      max_retries     = var.max_retries
      timeout         = var.timeout

      // Attach the Cloud SQL instance so the migration can reach Postgres
      // through the connector at /cloudsql/<connection_name>.
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
        image   = var.image
        command = var.command
        args    = var.args

        resources {
          limits = {
            cpu    = var.cpu
            memory = var.memory
          }
        }

        dynamic "env" {
          for_each = var.env_vars
          content {
            name  = env.key
            value = env.value
          }
        }

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
      }
    }
  }

  // The image tag changes every deploy; let CD manage executions. Ignore image
  // drift so a plan doesn't fight the running tag between Terraform applies.
  lifecycle {
    ignore_changes = [
      template[0].template[0].containers[0].image,
    ]
  }
}
