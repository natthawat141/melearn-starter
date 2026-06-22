variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Region for the Cloud Run Job."
}

variable "job_name" {
  type        = string
  description = "Cloud Run Job name."
}

variable "image" {
  type        = string
  description = "Fully-qualified container image to run."
}

variable "service_account_email" {
  type        = string
  description = "Runtime service account for the Job."
}

variable "command" {
  type        = list(string)
  description = "Container entrypoint override. Empty list uses the image default."
  default     = []
}

variable "args" {
  type        = list(string)
  description = "Container args. For Payload migrations: [\"run\", \"payload\", \"--\", \"migrate\"] with command [\"npm\"]."
  default     = []
}

variable "cpu" {
  type        = string
  description = "CPU limit for the task."
  default     = "1"
}

variable "memory" {
  type        = string
  description = "Memory limit for the task."
  default     = "1Gi"
}

variable "max_retries" {
  type        = number
  description = "Retries per task before the execution fails."
  default     = 1
}

variable "timeout" {
  type        = string
  description = "Max duration per task attempt (e.g. \"600s\")."
  default     = "600s"
}

variable "cloudsql_connection_name" {
  type        = string
  description = "Cloud SQL connection_name to attach (project:region:instance). Null = no Cloud SQL volume."
  default     = null
}

variable "env_vars" {
  type        = map(string)
  description = "Plain (non-sensitive) environment variables."
  default     = {}
}

variable "secret_env_vars" {
  type        = map(string)
  description = "Map of env var name => Secret Manager secret ID (resolved at 'latest')."
  default     = {}
}

variable "deletion_protection" {
  type        = bool
  description = "Protect the Job from deletion."
  default     = false
}
