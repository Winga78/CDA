resource "aws_db_instance" "mysql" {
  engine                 = "mysql"
  db_name                = var.DB_DATABASE_CHAT
  identifier             = "cda"
  instance_class         = "db.t4g.micro"
  allocated_storage      = 20
  publicly_accessible    = true
  username               = var.MYSQL_ADMIN_USER
  password               = var.MYSQL_ADMIN_PASSWORD
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.mysql_subnet_group.name
  skip_final_snapshot    = true

  tags = {
    Name = "example-db"
  }
}

resource "null_resource" "init_databases" {
  provisioner "local-exec" {
    command = <<EOT
       mysql -h ${aws_db_instance.mysql.address} -P 3306 -u ${var.MYSQL_ADMIN_USER} -p${var.MYSQL_ADMIN_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${var.DB_DATABASE_PROJECT}; CREATE DATABASE IF NOT EXISTS ${var.DB_DATABASE_RELATION};"
    EOT
  }
  depends_on = [aws_db_instance.mysql]
}

resource "aws_db_subnet_group" "mysql_subnet_group" {
  name       = "mysql-subnet-group"
  subnet_ids = var.privates_subnets

  tags = {
    Name = "mysql-subnet-group"
  }
}
