resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Allow DB access from ECS"
  vpc_id      = var.vpc_id
}

resource "aws_security_group_rule" "ecs_rds_ingress" {
    type                        = "ingress"
    from_port                   = 3306
    to_port                     = 3306
    protocol                    = "tcp"
    description                 = "Allow inbound traffic from ECS"
    security_group_id           = aws_security_group.rds_sg.id
    source_security_group_id    = var.security_groups_ecs
}

resource "aws_security_group_rule" "ec2_rds_ingress" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  description              = "Allow MySQL access from EC2"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = var.security_groups_ec2
}

resource "aws_security_group_rule" "rds_all_egress" {
    type                        = "egress"
    from_port                   = 0
    to_port                     = 0
    protocol                    = "-1"
    description                 = "Allow outbound traffic from RDS"
    security_group_id           = aws_security_group.rds_sg.id
    cidr_blocks                 = ["0.0.0.0/0"] 
}