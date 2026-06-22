// Cloud SQL for PostgreSQL — shared relational database for the Payload backend.
//
// SQLite is file-based and cannot be shared across horizontally-scaled Cloud
// Run instances. Cloud SQL provides a single shared Postgres that every backend
// instance (and the migration Job) connects to via the Cloud SQL connector.
//
// The DB password is NOT generated or stored here — it is created out-of-band
// and stored in Secret Manager as part of the DATABASE_URL secret. This module
// only provisions the instance, database, and (optionally) a user whose
// password is supplied via a variable that itself comes from a secret, never
// committed to git. See infra/README.md ("Populating secret values").

resource "google_sql_database_instance" "this" {
  project          = var.project_id
  name             = var.instance_name
  region           = var.region
  database_version = var.database_version

  // For dev sandboxes keep this false so `terraform destroy` works cleanly.
  // For prod this MUST be true (set via var) to prevent accidental data loss.
  deletion_protection = var.deletion_protection

  settings {
    tier              = var.tier
    edition           = var.edition
    availability_type = var.availability_type
    disk_size         = var.disk_size
    disk_type         = "PD_SSD"
    disk_autoresize   = true

    backup_configuration {
      enabled                        = var.backups_enabled
      point_in_time_recovery_enabled = var.point_in_time_recovery_enabled
      // Daily backup window (UTC). Cheap; required for prod recoverability.
      start_time = "17:00"
    }

    ip_configuration {
      // Connections go through the Cloud SQL connector (unix socket / IAM),
      // so we do NOT need a public IP or authorized networks. ipv4_enabled
      // is left to the variable: false (private path only) is the secure
      // default; sandbox may flip it on for ad-hoc psql access.
      ipv4_enabled = var.public_ip_enabled
    }

    database_flags {
      name  = "max_connections"
      value = var.max_connections
    }

    insights_config {
      query_insights_enabled = var.query_insights_enabled
    }

    user_labels = var.labels
  }
}

// Application database.
resource "google_sql_database" "app" {
  project  = var.project_id
  name     = var.database_name
  instance = google_sql_database_instance.this.name
}

// Application database user. Password is supplied by the caller from a secret
// (NOT defaulted, NOT committed). If null, no user is created and you are
// expected to manage users out-of-band.
resource "google_sql_user" "app" {
  count = var.db_user_password == null ? 0 : 1

  project  = var.project_id
  name     = var.db_user_name
  instance = google_sql_database_instance.this.name
  password = var.db_user_password
}
