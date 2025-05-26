data "template_file" "frontend_env" {
  template = <<EOF
VITE_AUTH_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/api/auth
VITE_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/api/users
VITE_CHAT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/api/posts
VITE_PROJECT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/api/projects
VITE_PROJECT_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/api/project-user
VITE_POST_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/api/post-user
MYSQL_PASSWORD=${var.MYSQL_PASSWORD}
MYSQL_USER=${var.MYSQL_USER}
DB_DATABASE_CHAT=${var.DB_DATABASE_CHAT}
DB_DATABASE_PROJECT=${var.DB_DATABASE_PROJECT}
DB_DATABASE_RELATION=${var.DB_DATABASE_RELATION}
DB_PORT=${var.DB_PORT}
DB_TYPE=${var.DB_TYPE}
JWT_SECRET=${var.JWT_SECRET}
PORT=${var.PORT}
DB_HOST=${var.DB_HOST}

EOF
}