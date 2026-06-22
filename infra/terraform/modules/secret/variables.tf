variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "secret_id" {
  type        = string
  description = "Secret Manager secret ID."
}

variable "accessor_members" {
  type        = list(string)
  description = "IAM members (e.g. serviceAccount:...) granted secretAccessor on this secret."
  default     = []
}

variable "labels" {
  type        = map(string)
  description = "Labels applied to the secret."
  default     = {}
}
