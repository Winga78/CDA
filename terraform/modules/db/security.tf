resource "aws_security_group" "rds_sg" {
  name        = "rds-mysql-sg"
  description = "Allow MySQL traffic from ECS and EC2"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Autoriser ECS à se connecter à RDS
resource "aws_security_group_rule" "rds_ingress_from_ecs" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  description              = "Allow MySQL traffic from ECS services"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = var.security_groups_ecs
}

# Autoriser EC2 à se connecter à RDS
resource "aws_security_group_rule" "rds_ingress_from_ec2" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  description              = "Allow MySQL traffic from EC2 instances"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = var.security_groups_ec2[0]
}