resource "aws_security_group" "ec2_sg" {
  name        = "ec2-sg"
  description = "Allow DB access from EC2"
  vpc_id      = var.vpc_id
}


resource "aws_security_group_rule" "ec2_all_egress" {
    type                        = "egress"
    from_port                   = 0
    to_port                     = 0
    protocol                    = "-1"
    description                 = "Allow outbound traffic from EC2"
    security_group_id           = aws_security_group.ec2_sg.id
    cidr_blocks                 = ["0.0.0.0/0"] 
}

resource "aws_security_group_rule" "ec2_rds_ingress" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  description              = "SSH from anywhere or your IP"
  security_group_id        = aws_security_group.ec2_sg.id
  cidr_blocks              = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ec2_rds_mysql_ingress" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  description              = "Allow MySQL access from EC2"
  security_group_id        = aws_security_group.ec2_sg.id
  source_security_group_id = var.security_groups_rds_id

  tags = {
    Name = "allow_mysql"
  }
}

