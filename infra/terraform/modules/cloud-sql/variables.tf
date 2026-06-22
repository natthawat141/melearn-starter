variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Region for the Cloud SQL instance."
}

variable "instance_name" {
  type        = string
  description = "Cloud SQL instance name."
}

variable "database_version" {
  type        = string
  description = "Postgres version, e.g. POSTGRES_16."
  default     = "POSTGRES_16"
}

variable "tier" {
  type        = string
  description = "Machine tier. Smallest shared-core for sandbox/dev is db-f1-micro; prod should use a dedicated tier like db-custom-2-7680."
  default     = "db-f1-micro"
}

variable "edition" {
  type        = string
  description = "Cloud SQL edition. ENTERPRISE supports shared-core tiers (db-f1-micro); ENTERPRISE_PLUS does not."
  default     = "ENTERPRISE"
}

variable "availability_type" {
  type        = string
  description = "ZONAL (cheap, single zone) or REGIONAL (HA, prod)."
  default     = "ZONAL"
}

variable "disk_size" {
  type        = number
  description = "Disk size in GB (min 10 for PD_SSD)."
  default     = 10
}

variable "deletion_protection" {
  type        = bool
  description = "Protect the instance from deletion. Keep false in dev for easy teardown; true in prod."
  default     = false
}

variable "backups_enabled" {
  type        = bool
  description = "Enable automated daily backups."
  default     = true
}

variable "point_in_time_recovery_enabled" {
  type        = bool
  description = "Enable PITR (WAL archiving). Recommended for prod; small cost."
  default     = false
}

variable "public_ip_enabled" {
  type        = bool
  description = "Assign a public IPv4. Default false: connect only via the Cloud SQL connector (unix socket)."
  default     = false
}

variable "max_connections" {
  type        = string
  description = "Postgres max_connections flag (string, as required by the API)."
  default     = "50"
}

variable "query_insights_enabled" {
  type        = bool
  description = "Enable Cloud SQL Query Insights for observability."
  default     = true
}

variable "database_name" {
  type        = string
  description = "Application database name."
  default     = "melearn"
}

variable "db_user_name" {
  type        = string
  description = "Application database user name."
  default     = "melearn_app"
}

variable "db_user_password" {
  type        = string
  description = "Password for the application DB user. Supply from a secret; if null, no user is created here. NEVER commit a real value."
  default     = null
  sensitive   = true
}

variable "labels" {
  type        = map(string)
  description = "Labels applied to the instance."
  default     = {}
}
