output "instance_name" {
  description = "Cloud SQL instance name."
  value       = google_sql_database_instance.this.name
}

output "connection_name" {
  description = "Connection name (project:region:instance) used by the Cloud SQL connector and DATABASE_URL."
  value       = google_sql_database_instance.this.connection_name
}

output "database_name" {
  description = "Application database name."
  value       = google_sql_database.app.name
}

output "db_user_name" {
  description = "Application database user name."
  value       = var.db_user_name
}

output "public_ip_address" {
  description = "Public IPv4 of the instance (empty if public IP disabled)."
  value       = google_sql_database_instance.this.public_ip_address
}
