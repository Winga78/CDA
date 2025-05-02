resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/ecs/${var.environment}/cda"
  retention_in_days = 14

  tags = {
    Environment = "production"
    Application = "CDA"
  }

  lifecycle {
    prevent_destroy = true
  }
}