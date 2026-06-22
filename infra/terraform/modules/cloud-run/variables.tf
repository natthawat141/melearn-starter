variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "region" {
  type        = string
  description = "Region for the Cloud Run service."
}

variable "service_name" {
  type        = string
  description = "Cloud Run service name."
}

variable "image" {
  type        = string
  description = "Fully-qualified container image (e.g. REGION-docker.pkg.dev/PROJECT/REPO/app:tag)."
}

variable "service_account_email" {
  type        = string
  description = "Runtime service account email for the service."
}

variable "container_port" {
  type        = number
  description = "Port the container listens on."
  default     = 3000
}

variable "min_instances" {
  type        = number
  description = "Minimum number of instances. 0 = scale to zero (cheapest)."
  default     = 0
}

variable "max_instances" {
  type        = number
  description = "Maximum number of instances."
  default     = 2
}

variable "cpu" {
  type        = string
  description = "CPU limit per instance (e.g. \"1\", \"2\")."
  default     = "1"
}

variable "memory" {
  type        = string
  description = "Memory limit per instance (e.g. \"512Mi\", \"1Gi\")."
  default     = "512Mi"
}

variable "concurrency" {
  type        = number
  description = "Max concurrent requests per instance."
  default     = 80
}

variable "ingress" {
  type        = string
  description = "Ingress setting: INGRESS_TRAFFIC_ALL, INGRESS_TRAFFIC_INTERNAL_ONLY, or INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER."
  default     = "INGRESS_TRAFFIC_ALL"
}

variable "allow_public_access" {
  type        = bool
  description = "If true, grant allUsers the run.invoker role (public endpoint)."
  default     = true
}

variable "deletion_protection" {
  type        = bool
  description = "Protect the service from deletion. Keep false in dev to allow easy teardown."
  default     = false
}

variable "env_vars" {
  type        = map(string)
  description = "Plain (non-sensitive) environment variables."
  default     = {}
}

variable "secret_env_vars" {
  type        = map(string)
  description = "Map of env var name => Secret Manager secret ID. Resolved at runtime ('latest' version)."
  default     = {}
}

variable "cloudsql_connection_name" {
  type        = string
  description = "Cloud SQL connection_name (project:region:instance) to attach via the connector. Null = no Cloud SQL."
  default     = null
}

variable "labels" {
  type        = map(string)
  description = "Labels applied to the service."
  default     = {}
}
