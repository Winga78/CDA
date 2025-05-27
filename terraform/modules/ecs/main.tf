resource "aws_ecs_service" "service" {
  for_each                           = local.flattened_routes
  name                               = "${each.key}_ECS_Service_${var.environment}"
  cluster                            = aws_ecs_cluster.default.id
  task_definition                    = aws_ecs_task_definition.default[each.value.name].arn
  desired_count                      = var.ecs_task_desired_count
  deployment_minimum_healthy_percent = var.ecs_task_deployment_minimum_healthy_percent
  deployment_maximum_percent         = var.ecs_task_deployment_maximum_percent
  launch_type                        = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group[each.key].arn
    container_name   = "${each.value.name}-service"
    container_port   = var.container_port
  }
 
  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = each.value.name == "frontend" ? var.public_subnets : var.privates_subnets
    assign_public_ip = each.value.name == "frontend" ? true : false
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}

resource "aws_ecs_task_definition" "default" {
  for_each                 = var.service_name
  family                   = "${each.key}_ECS_TaskDefinition_${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn
  task_role_arn            = aws_iam_role.ecsTaskRole.arn
  cpu                      = var.cpu_units
  memory                   = var.memory

  container_definitions = jsonencode([
    {
      name         = "${each.key}-service"
      image        = "${var.repository_url[each.key]}:${var.hash}"
      cpu          = var.cpu_units
      memory       = var.memory
      essential    = true

    environment = [
     { name = "VITE_AUTH_SERVICE_URL",         value = "http://${aws_lb.application_load_balancer.dns_name}/auth" },
     { name = "VITE_USER_SERVICE_URL",         value = "http://${aws_lb.application_load_balancer.dns_name}/users" },
     { name = "VITE_UPLOADS_URL",              value = "http://${aws_lb.application_load_balancer.dns_name}/uploads" },
     { name = "VITE_CHAT_SERVICE_URL",         value = "http://${aws_lb.application_load_balancer.dns_name}/posts" },
     { name = "VITE_SOCKET_CHAT_SERVICE_URL",  value = "http://${aws_lb.application_load_balancer.dns_name}/sockets.io" },
     { name = "VITE_PROJECT_SERVICE_URL",      value = "http://${aws_lb.application_load_balancer.dns_name}/projects" },
     { name = "VITE_PROJECT_USER_SERVICE_URL", value = "http://${aws_lb.application_load_balancer.dns_name}/project-user" },
     { name = "VITE_POST_USER_SERVICE_URL",    value = "http://${aws_lb.application_load_balancer.dns_name}/post-user" },
     { name = "VITE_POST_USER_SERVICE_URL",    value = "http://${aws_lb.application_load_balancer.dns_name}/socket.io" },
     
     { name = "MYSQL_PASSWORD",               value = var.MYSQL_PASSWORD },
     { name = "MYSQL_USER",                   value = var.MYSQL_USER },
     { name = "DB_DATABASE_CHAT",             value = var.DB_DATABASE_CHAT },
     { name = "DB_DATABASE_PROJECT",          value = var.DB_DATABASE_PROJECT },
     { name = "DB_DATABASE_RELATION",         value = var.DB_DATABASE_RELATION },
     { name = "DB_PORT",                      value = var.DB_PORT },
     { name = "DB_TYPE",                      value = var.DB_TYPE },
     { name = "JWT_SECRET",                   value = var.JWT_SECRET },
     { name = "PORT",                         value = var.PORT },
     { name = "DB_HOST",                      value = var.DB_HOST },
     { name = "MONGODB_URI",                  value = var.MONGODB_URI },
   ]



      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options   = {
          "awslogs-group"         = aws_cloudwatch_log_group.log_group.name,
          "awslogs-region"        = var.region,
          "awslogs-stream-prefix" = "${each.key}-log-stream-${var.environment}"
        }
      }
    }
  ])
}

resource "local_file" "env_file" {
  content  = data.template_file.frontend_env.rendered
  filename = "${path.module}/../frontend/.env.production"
}