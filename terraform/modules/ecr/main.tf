locals {
  repos = concat(
    [for i in range(length(var.repository_name)) : {
      name      = var.repository_name[i]
    }],
  )
}

resource "aws_ecr_repository" "my_ecr_repo" {
  count = length(local.repos)
  name                 = local.repos[count.index].name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}