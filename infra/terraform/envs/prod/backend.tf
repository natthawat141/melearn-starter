// Remote state — GCS backend (prod). See dev/backend.tf and infra/README.md.
//
//   terraform init \
//     -backend-config="bucket=YOUR_TF_STATE_BUCKET" \
//     -backend-config="prefix=melearn/prod"
//
// Validate/format without a backend:
//   terraform init -backend=false

terraform {
  backend "gcs" {
    prefix = "melearn/prod"
  }
}
