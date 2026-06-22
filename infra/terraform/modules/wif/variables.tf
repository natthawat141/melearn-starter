variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "environment" {
  type        = string
  description = "Environment name (dev/prod)."
}

variable "pool_id" {
  type        = string
  description = "Workload Identity Pool ID (<=32 chars)."
}

variable "pool_display_name" {
  type        = string
  description = "Human-readable pool name."
  default     = "GitHub Actions"
}

variable "provider_id" {
  type        = string
  description = "Workload Identity Pool Provider ID."
  default     = "github-provider"
}

variable "github_repository" {
  type        = string
  description = "GitHub repo in 'owner/repo' form allowed to assume the deployer SA. (PLACEHOLDER — set in tfvars.)"
}

variable "deployer_account_id" {
  type        = string
  description = "Account ID (local part) for the deployer service account."
}

variable "deployer_roles" {
  type        = list(string)
  description = "Project-level roles granted to the deployer service account."
  default = [
    "roles/run.developer",                  // deploy Cloud Run services + run Jobs
    "roles/artifactregistry.writer",        // push images
    "roles/iam.serviceAccountUser",         // act-as runtime SAs on deploy
    "roles/cloudsql.client",                // (optional) connect for ad-hoc checks
    "roles/serviceusage.serviceUsageViewer" // read enabled APIs
  ]
}
