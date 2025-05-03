output subnets_privates_id {
  value       = aws_subnet.private[*].id
}

output subnets_public_id{
  value       = aws_subnet.public[*].id
}


output vpc_id {
    value    = aws_vpc.main.id
}