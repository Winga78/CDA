variable MYSQL_ADMIN_PASSWORD {}
variable MYSQL_ADMIN_USER {}
variable DB_DATABASE_CHAT {}
variable DB_DATABASE_PROJECT {}
variable DB_DATABASE_RELATION {}

variable security_groups_ecs {
  type = string
}
variable "security_groups_ec2" {
  description = "Security group IDs for EC2 instances that need to access RDS"
  type        = list(string)
}

variable aws_region {
     type        = string
     default     = "eu-west-3"
}

variable vpc_id {
  type        = string
}

variable "public_subnets" {
  type = list(string)
}

variable "privates_subnets" {
  type = list(string)
}


