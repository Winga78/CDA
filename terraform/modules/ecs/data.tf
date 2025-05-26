data "template_file" "frontend_env" {
  template = <<EOF
VITE_AUTH_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/auth
VITE_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/users
VITE_CHAT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/posts
VITE_PROJECT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/projects
VITE_PROJECT_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/project-user
VITE_POST_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/post-user
EOF
}