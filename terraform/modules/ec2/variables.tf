variable "public_subnets" {
  description = "subnet public"
  type        = list(string)
}

variable vpc_id {
  type        = string
}

variable security_groups_rds_id {
  type        = string
}
