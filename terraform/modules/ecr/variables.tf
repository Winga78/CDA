variable "repository_name" {
  description = "List of ECR repository names"
  type        = map(list(string))
}