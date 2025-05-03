resource "aws_security_group" "rds_sg" {
  name        = "rds-mysql-sg"
  description = "Allow MySQL traffic from ECS services"
  vpc_id      = var.vpc_id

  ingress {
    description = "MySQL from ECS"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    security_groups = [var.security_groups_ecs]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}