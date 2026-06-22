// Observability — notification channel, uptime check + alert policy, and a
// budget alert (cost guardrail for free credits).

// Email notification channel used by both the uptime alert and the budget.
resource "google_monitoring_notification_channel" "email" {
  project      = var.project_id
  display_name = "Melearn ${var.environment} alerts (email)"
  type         = "email"
  labels = {
    email_address = var.alert_email
  }
}

// HTTPS uptime check against the frontend public URL.
resource "google_monitoring_uptime_check_config" "frontend" {
  project      = var.project_id
  display_name = "melearn-${var.environment}-frontend-uptime"
  timeout      = "10s"
  period       = "300s"

  http_check {
    path         = var.uptime_path
    port         = 443
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = var.uptime_host
    }
  }
}

// Alert when the uptime check fails.
resource "google_monitoring_alert_policy" "uptime" {
  project      = var.project_id
  display_name = "melearn-${var.environment}-frontend-down"
  combiner     = "OR"

  conditions {
    display_name = "Frontend uptime check failing"
    condition_threshold {
      filter = join(" AND ", [
        "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\"",
        "resource.type=\"uptime_url\"",
        "metric.label.check_id=\"${google_monitoring_uptime_check_config.frontend.uptime_check_id}\"",
      ])
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      duration        = "300s"
      trigger {
        count = 1
      }
      aggregations {
        alignment_period   = "300s"
        per_series_aligner = "ALIGN_FRACTION_TRUE"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.id]

  alert_strategy {
    auto_close = "1800s"
  }
}

// Budget alert — cost guardrail. Requires the billing account ID.
resource "google_billing_budget" "this" {
  count = var.billing_account == null ? 0 : 1

  billing_account = var.billing_account
  display_name    = "melearn-${var.environment}-budget"

  budget_filter {
    projects = ["projects/${var.project_number}"]
  }

  amount {
    specified_amount {
      currency_code = var.budget_currency
      units         = tostring(var.budget_amount)
    }
  }

  dynamic "threshold_rules" {
    for_each = var.budget_thresholds
    content {
      threshold_percent = threshold_rules.value
      spend_basis       = "CURRENT_SPEND"
    }
  }

  // Forecast trip at 100% too.
  threshold_rules {
    threshold_percent = 1.0
    spend_basis       = "FORECASTED_SPEND"
  }

  all_updates_rule {
    monitoring_notification_channels = [google_monitoring_notification_channel.email.id]
    disable_default_iam_recipients   = false
  }
}
