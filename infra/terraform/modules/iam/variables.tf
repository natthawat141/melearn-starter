variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Region of the Artifact Registry repository (for the repo-scoped IAM binding)."
}

variable "account_id" {
  type        = string
  description = "Service account ID (the part before @, 6-30 chars, lowercase/digits/hyphen)."

  validation {
    condition     = can(regex("^[a-z]([-a-z0-9]{4,28}[a-z0-9])$", var.account_id))
    error_message = "account_id must be 6-30 chars, start with a letter, and contain only lowercase letters, digits, and hyphens."
  }
}

variable "display_name" {
  type        = string
  description = "Human-readable display name for the service account."
}

variable "service_name" {
  type        = string
  description = "Logical name of the service this SA belongs to (frontend, backend)."
}

variable "environment" {
  type        = string
  description = "Environment name (dev, prod)."
}

variable "artifact_registry_repository_id" {
  type        = string
  description = "Artifact Registry repository ID to grant read (image pull) access on. Set null to skip."
  default     = null
}

variable "grant_cloudsql_client" {
  type        = bool
  description = "Grant roles/cloudsql.client (project-level) so this SA can connect via the Cloud SQL connector. Enable for the backend + migration SAs."
  default     = false
}
