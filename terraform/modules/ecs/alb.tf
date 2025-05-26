resource "aws_alb" "application_load_balancer" {
  name               = "alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  subnets            = var.public_subnets
  security_groups    = [aws_security_group.alb_sg.id]
}
resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_alb.application_load_balancer.arn
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
resource "aws_lb_target_group" "target_group" {
  for_each    = var.routes
  name        = "${var.environment}-${each.key}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
}


resource "aws_lb_listener_rule" "lb_listener_rule" {
  for_each     = var.routes
  listener_arn = aws_lb_listener.listener.arn
  priority     = lookup(var.priorities, each.key, 100)

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group[each.key].arn
  }

  condition {
    path_pattern {
      values = [each.value]
    }
  }
}