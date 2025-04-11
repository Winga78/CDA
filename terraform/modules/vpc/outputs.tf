output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_ids" {
  description = "Liste des IDs des sous-réseaux publics"
  value = aws_subnet.subnet[*].id
}

output "security_group_id"{
    description = "Les security groups"
    value       = aws_security_group.security_group.id
}