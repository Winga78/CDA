## Creates an ECS Service running on Fargate

resource "aws_ecs_service" "service" {
  for_each                           = toset(var.service_name)
  name                               = "${each.value}_ECS_Service_${var.environment}"
  cluster                            = aws_ecs_cluster.default.id
  task_definition                    = aws_ecs_task_definition.default[each.key].arn
  desired_count                      = var.ecs_task_desired_count
  deployment_minimum_healthy_percent = var.ecs_task_deployment_minimum_healthy_percent
  deployment_maximum_percent         = var.ecs_task_deployment_maximum_percent
  launch_type                        = "FARGATE"

  load_balancer {
    target_group_arn = aws_alb_target_group.target_group.arn
    container_name   = "${each.value}-service"
    container_port   = var.container_port
  }
 
  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = each.value == "frontend" ? var.public_subnets : var.privates_subnets
    assign_public_ip = each.value == "frontend" ? true : false
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}


## Creates ECS Task Definition

resource "aws_ecs_task_definition" "default" {
  for_each                 = toset(var.service_name)
  family                   = "${each.value}_ECS_TaskDefinition_${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn = aws_iam_role.ecsTaskExecutionRole.arn
  task_role_arn      = aws_iam_role.ecsTaskRole.arn
  cpu                      = var.cpu_units
  memory                   = var.memory

  container_definitions = jsonencode([
    {
      name         = "${each.value}-service"
      image        = "${var.repository_url[each.value]}:${var.hash}"
      cpu          = var.cpu_units
      memory       = var.memory
      essential    = true
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
          "awslogs-stream-prefix" = "${each.value}-log-stream-${var.environment}"
        }
      }
    }
  ])
}