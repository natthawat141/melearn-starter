variable "project_id" {
  type        = string
  description = "GCP project ID for the dev environment. (PLACEHOLDER — set in terraform.tfvars.)"
}

variable "region" {
  type        = string
  description = "Primary GCP region for all regional resources."
  default     = "asia-southeast1" // Singapore — closest to Thailand-based team
}

variable "environment" {
  type        = string
  description = "Environment name."
  default     = "dev"
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
  description = "Min instances for the frontend service."
  default     = 0
}

variable "frontend_max_instances" {
  type        = number
  description = "Max instances for the frontend service."
  default     = 2
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
  default     = 2
}

variable "backend_allow_public_access" {
  type        = bool
  description = "Whether the backend service is publicly invokable."
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

// ---- Cloud SQL (Postgres) ----
variable "db_version" {
  type        = string
  description = "Postgres version."
  default     = "POSTGRES_16"
}

variable "db_tier" {
  type        = string
  description = "Cloud SQL tier. db-f1-micro is smallest/cheapest (sandbox/dev)."
  default     = "db-f1-micro"
}

variable "db_availability_type" {
  type        = string
  description = "ZONAL (dev) or REGIONAL (HA prod)."
  default     = "ZONAL"
}

variable "db_disk_size" {
  type        = number
  description = "Cloud SQL disk size in GB."
  default     = 10
}

variable "db_deletion_protection" {
  type        = bool
  description = "Protect the Cloud SQL instance from deletion. false in dev for teardown."
  default     = false
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
  description = "DB user password. Supply via TF_VAR_db_user_password from a secret — NEVER commit. Null = manage users out-of-band."
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
  default     = 50
}

variable "budget_currency" {
  type        = string
  description = "Budget currency code."
  default     = "USD"
}
