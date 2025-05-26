resource "aws_ecr_repository" "this" {
  for_each = var.repository_name

  name = "${each.key}-repo"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = each.key
  }
}
