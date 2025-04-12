variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "autoscaling_group_arn" {
  description = "ARN of the Auto Scaling Group"
  type        = string
}

variable "aws_lb_target_group_arn"{
  type        = string
}

variable "ecs_task_definition" {
  type = list(string)
}
