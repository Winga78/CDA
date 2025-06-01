resource "aws_lb" "application_load_balancer" {
  name               = "alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  subnets            = var.public_subnets
  security_groups    = [aws_security_group.alb_sg.id]
}
resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.application_load_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "404 Not Found"
      status_code  = "404"
    }
  }
}
locals {
  flattened_routes = merge([
    for service_key, paths in var.service_name : {
      for idx, path in paths :
      "${service_key}-${idx}" => {
        name     = service_key
        path     = path
        position = idx
        priority = (
          service_key == "frontend"
          ? 999
          : idx + 1 + index(keys(var.service_name), service_key) * 10
        )
      }
    }
  ]...)
}
resource "aws_lb_target_group" "target_group" {
  for_each    = local.flattened_routes

  name        = "${var.environment}-${each.value.name}-${each.value.position + 1}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
}


resource "aws_lb_listener_rule" "lb_listener_rule" {
for_each       = local.flattened_routes
  listener_arn = aws_lb_listener.listener.arn
  priority     = each.value.priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group[each.key].arn
  }

  condition {
    path_pattern {
      values = [each.value.path]
    }
  }
}

locals {
  frontend_key = one([
    for k, v in local.flattened_routes :
    k if v.name == "frontend" && v.position == 0
  ])
}

