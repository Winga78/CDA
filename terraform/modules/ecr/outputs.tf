output repository_url {
  value = { for k, repo in aws_ecr_repository.this : k => repo.repository_url }
}