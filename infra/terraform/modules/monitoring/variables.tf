variable "project_id" {
  type        = string
  description = "GCP project ID."
}

variable "project_number" {
  type        = string
  description = "GCP project NUMBER (not ID) — required by the budget filter."
}

variable "environment" {
  type        = string
  description = "Environment name."
}

variable "alert_email" {
  type        = string
  description = "Email address that receives uptime + budget alerts."
}

variable "uptime_host" {
  type        = string
  description = "Hostname for the uptime check (frontend Cloud Run host, no scheme)."
}

variable "uptime_path" {
  type        = string
  description = "HTTP path probed by the uptime check."
  default     = "/"
}

variable "billing_account" {
  type        = string
  description = "Billing account ID for the budget (e.g. 0X0X0X-0X0X0X-0X0X0X). Null disables the budget. (PLACEHOLDER.)"
  default     = null
}

variable "budget_amount" {
  type        = number
  description = "Monthly budget amount in whole currency units."
  default     = 50
}

variable "budget_currency" {
  type        = string
  description = "Budget currency code."
  default     = "USD"
}

variable "budget_thresholds" {
  type        = list(number)
  description = "Current-spend alert thresholds (fractions of budget)."
  default     = [0.5, 0.9, 1.0]
}
