variable "public_subnets" {
  type = list(string)
}

variable "privates_subnets" {
  type = list(string)
}

variable hash {
  type        = string
  default     = "latest"
  description = "hash d'image"
}


variable repository_url {
  type        = map(string)
}

variable "cpu_units" {
  type        = number
  default     = 1024
  description = "CPU units for the ECS task"
}

variable "memory" {
  type        = number
  default     = 3072
  description = "Memory in MB for the ECS task"
}

variable "container_port" {
  type        = number
  default     = 80
  description = "Port on which the container listens"
}

variable "region" {
  type        = string
  default     = "eu-west-3"
  description = "AWS region"
}

variable "service_name" {
  type        = list(string)
  description = "List of ECS service names"
}

variable "ecs_task_desired_count" {
  type        = number
  default     = 1
  description = "Desired number of ECS task instances"
}

variable "ecs_task_deployment_minimum_healthy_percent" {
  type        = number
  default     = 50
  description = "Minimum healthy percent during ECS deployment"
}

variable "ecs_task_deployment_maximum_percent" {
  type        = number
  default     = 200
  description = "Maximum percent during ECS deployment"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Environment name (e.g., dev, staging, production)"
}

variable vpc_id {
  type        = string
}
<<<<<<< HEAD
=======

variable MONGODB_URI {}
variable NODE_ENV {}
variable VITE_AUTH_SERVICE_URL {}
variable VITE_CHAT_SERVICE_URL {}
variable VITE_PROJECT_SERVICE_URL {}
variable VITE_PROJECT_USER_POST_SERVICE_URL {}
variable MYSQL_PASSWORD {}
variable MYSQL_USER {}
variable DB_DATABASE_CHAT {}
variable DB_DATABASE_PROJECT {}
variable DB_DATABASE_RELATION {}
variable DB_PORT {}
variable DB_TYPE {}
variable JWT_SECRET {}
variable PORT {}
variable DB_HOST {}
>>>>>>> front
