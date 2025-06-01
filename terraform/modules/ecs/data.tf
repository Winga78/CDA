data "template_file" "frontend_env" {
  template = <<EOF
MODE=production
VITE_AUTH_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/auth
VITE_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/users
VITE_UPLOADS_URL=http://${aws_lb.application_load_balancer.dns_name}/uploads
VITE_CHAT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/posts
VITE_SOCKET_CHAT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/chat/socket.io
VITE_PROJECT_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/projects
VITE_PROJECT_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/project-user
VITE_POST_USER_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/post-user
VITE_SOCKET_VOTE_SERVICE_URL=http://${aws_lb.application_load_balancer.dns_name}/vote/socket.io
EOF
}