# ------------------------------------------------------------------------------
# Security Group for ECS app
# ------------------------------------------------------------------------------
resource "aws_security_group" "ecs_sg" {
    vpc_id                      = var.vpc_id
    name                        = "demo-sg-ecs"
    description                 = "Security group for ecs app"
    revoke_rules_on_delete      = true
}


# ------------------------------------------------------------------------------
# Security Group for alb
# ------------------------------------------------------------------------------
resource "aws_security_group" "alb_sg" {
    vpc_id                      = var.vpc_id
    name                        = "demo-sg-alb"
    description                 = "Security group for alb"
    revoke_rules_on_delete      = true
}


# ------------------------------------------------------------------------------
# ECS app Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_security_group_rule" "ecs_alb_ingress" {
    type                        = "ingress"
    from_port                   = 0
    to_port                     = 0
    protocol                    = "-1"
    description                 = "Allow inbound traffic from ALB"
    security_group_id           = aws_security_group.ecs_sg.id
    source_security_group_id    = aws_security_group.alb_sg.id
}

# ------------------------------------------------------------------------------
# ECS mysql Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_security_group_rule" "ecs_rds_mysql_ingress" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  description              = "Allow MySQL access from RDS to ECS"
  security_group_id        = aws_security_group.ecs_sg.id
  source_security_group_id = aws_security_group.rds_sg.id

  tags = {
    Name = "allow_mysql_from_rds"
  }
}

# ------------------------------------------------------------------------------
# ECS app Security Group Rules - OUTBOUND
# ------------------------------------------------------------------------------
resource "aws_security_group_rule" "ecs_all_egress" {
    type                        = "egress"
    from_port                   = 0
    to_port                     = 0
    protocol                    = "-1"
    description                 = "Allow outbound traffic from ECS"
    security_group_id           = aws_security_group.ecs_sg.id
    cidr_blocks                 = ["0.0.0.0/0"] 
}



# ------------------------------------------------------------------------------
# Alb Security Group Rules - INBOUND
# ------------------------------------------------------------------------------
resource "aws_security_group_rule" "alb_http_ingress" {
    type                        = "ingress"
    from_port                   = 80
    to_port                     = 80
    protocol                    = "TCP"
    description                 = "Allow http inbound traffic from internet"
    security_group_id           = aws_security_group.alb_sg.id
    cidr_blocks                 = ["0.0.0.0/0"] 
}

# ------------------------------------------------------------------------------
# Alb Security Group Rules - OUTBOUND
# ------------------------------------------------------------------------------
resource "aws_security_group_rule" "alb_egress" {
    type                        = "egress"
    from_port                   = 0
    to_port                     = 0
    protocol                    = "-1"
    description                 = "Allow outbound traffic from alb"
    security_group_id           = aws_security_group.alb_sg.id
    cidr_blocks                 = ["0.0.0.0/0"] 
}