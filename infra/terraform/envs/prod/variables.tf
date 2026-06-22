variable "project_id" {
  type        = string
  description = "GCP project ID for the prod environment. (PLACEHOLDER — set in terraform.tfvars.)"
}

variable "region" {
  type        = string
  description = "Primary GCP region for all regional resources."
  default     = "asia-southeast1" // Singapore — closest to Thailand-based team
}

variable "environment" {
  type        = string
  description = "Environment name."
  default     = "prod"
}

variable "artifact_repository_id" {
  type        = string
  description = "Artifact Registry repository ID for container images."
  default     = "melearn"
}

variable "image_tag" {
  type        = string
  description = "Image tag deployed to both services. CI overrides this with the git SHA."
  default     = "latest"
}

// ---- Frontend ----
variable "frontend_min_instances" {
  type        = number
  description = "Min instances for the frontend service. 0 keeps prod free-credit friendly; bump to 1 to avoid cold starts."
  default     = 0
}

variable "frontend_max_instances" {
  type        = number
  description = "Max instances for the frontend service."
  default     = 4
}

variable "frontend_public_env" {
  type        = map(string)
  description = "Non-sensitive (NEXT_PUBLIC_*) env vars for the frontend."
  default     = {}
}

// ---- Backend ----
variable "backend_min_instances" {
  type        = number
  description = "Min instances for the backend (Payload) service."
  default     = 0
}

variable "backend_max_instances" {
  type        = number
  description = "Max instances for the backend (Payload) service."
  default     = 4
}

variable "backend_allow_public_access" {
  type        = bool
  description = "Whether the backend service is publicly invokable. Defaults to false in prod so the Payload admin panel is NOT world-open; expose it only behind IAP/auth (see infra/README.md)."
  default     = false
}

variable "deletion_protection" {
  type        = bool
  description = "Protect Cloud Run services from accidental deletion in prod."
  default     = true
}

variable "labels" {
  type        = map(string)
  description = "Common labels applied to all resources."
  default = {
    app        = "melearn"
    managed-by = "terraform"
  }
}

// ---- Cloud SQL (Postgres) — prod defaults ----
variable "db_version" {
  type        = string
  description = "Postgres version."
  default     = "POSTGRES_16"
}

variable "db_tier" {
  type        = string
  description = "Cloud SQL tier. Prod should use a dedicated tier (e.g. db-custom-2-7680), NOT db-f1-micro."
  default     = "db-custom-2-7680"
}

variable "db_availability_type" {
  type        = string
  description = "REGIONAL for prod HA."
  default     = "REGIONAL"
}

variable "db_disk_size" {
  type        = number
  description = "Cloud SQL disk size in GB."
  default     = 20
}

variable "db_deletion_protection" {
  type        = bool
  description = "Protect the Cloud SQL instance from deletion. true in prod."
  default     = true
}

variable "db_pitr_enabled" {
  type        = bool
  description = "Enable point-in-time recovery. Recommended for prod."
  default     = true
}

variable "db_name" {
  type        = string
  description = "Application database name."
  default     = "melearn"
}

variable "db_user_name" {
  type        = string
  description = "Application DB user name."
  default     = "melearn_app"
}

variable "db_user_password" {
  type        = string
  description = "DB user password. Provide via TF_VAR_db_user_password from a secret — NEVER commit."
  default     = null
  sensitive   = true
}

// ---- WIF ----
variable "github_repository" {
  type        = string
  description = "GitHub repo (owner/repo) allowed to deploy via WIF. (PLACEHOLDER.)"
}

// ---- Observability ----
variable "alert_email" {
  type        = string
  description = "Email for uptime + budget alerts."
}

variable "billing_account" {
  type        = string
  description = "Billing account ID for the budget alert. Null disables the budget. (PLACEHOLDER.)"
  default     = null
}

variable "budget_amount" {
  type        = number
  description = "Monthly budget in whole currency units."
  default     = 200
}

variable "budget_currency" {
  type        = string
  description = "Budget currency code."
  default     = "USD"
}
