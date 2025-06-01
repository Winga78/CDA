data "template_file" "frontend_env" {
  template = <<EOF
MODE=production
VITE_AUTH_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_UPLOADS_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_CHAT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_SOCKET_CHAT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_PROJECT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_PROJECT_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_POST_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
VITE_SOCKET_VOTE_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}
EOF
}