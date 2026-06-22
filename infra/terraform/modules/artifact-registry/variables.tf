variable "project_id" {
  type        = string
  description = "GCP project ID that owns the Artifact Registry repository."
}

variable "region" {
  type        = string
  description = "Region for the Artifact Registry repository (should match Cloud Run region to avoid cross-region pull latency)."
}

variable "repository_id" {
  type        = string
  description = "Repository ID (the last path segment of the repo, e.g. \"melearn\")."
}

variable "environment" {
  type        = string
  description = "Environment name (dev, prod) — used for descriptions and labels."
}

variable "keep_tagged_count" {
  type        = number
  description = "Number of most-recent tagged image versions to retain in the cleanup policy."
  default     = 10
}

variable "labels" {
  type        = map(string)
  description = "Labels applied to the repository."
  default     = {}
}
