output "notification_channel_id" {
  description = "ID of the email notification channel."
  value       = google_monitoring_notification_channel.email.id
}

output "uptime_check_id" {
  description = "ID of the frontend uptime check."
  value       = google_monitoring_uptime_check_config.frontend.uptime_check_id
}

output "budget_name" {
  description = "Resource name of the budget (empty if billing_account not set)."
  value       = var.billing_account == null ? "" : google_billing_budget.this[0].name
}
