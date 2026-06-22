// Remote state — GCS backend.
//
// The bucket itself must exist BEFORE `terraform init` (chicken-and-egg:
// Terraform cannot create the bucket that stores its own state). Create it
// once, manually, with versioning enabled — see infra/README.md
// ("Bootstrapping the state bucket").
//
// Backend blocks cannot use variables, so the bucket name is provided at init
// time via `-backend-config`:
//
//   terraform init \
//     -backend-config="bucket=YOUR_TF_STATE_BUCKET" \
//     -backend-config="prefix=melearn/dev"
//
// To validate/format without a backend or credentials:
//   terraform init -backend=false

terraform {
  backend "gcs" {
    // bucket — supplied via -backend-config at init time.
    prefix = "melearn/dev"
  }
}
