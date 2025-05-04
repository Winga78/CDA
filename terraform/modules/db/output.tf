output mysql_host {
  value = aws_db_instance.mysql.endpoint
}

output security_groups_rds_id{
  value = aws_security_group.rds_sg.id
}