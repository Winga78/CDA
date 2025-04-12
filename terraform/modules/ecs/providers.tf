resource "aws_ecs_capacity_provider" "ecs_capacity_provider" {
 name = "test1"

 auto_scaling_group_provider {
   auto_scaling_group_arn = var.autoscaling_group_arn

   managed_scaling {
     maximum_scaling_step_size = 1000
     minimum_scaling_step_size = 1
     status                    = "ENABLED"
     target_capacity           = 3
   }
 }
}

resource "aws_ecs_cluster_capacity_providers" "example" {
 cluster_name = aws_ecs_cluster.ecs_cluster.name

 capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider.name]

 default_capacity_provider_strategy {
   base              = 1
   weight            = 100
   capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
 }
}


resource "aws_ecs_service" "ecs_service" {
 count           = length(local.tasks)
 name            = "${local.tasks[count.index].name}-service"
 cluster         = aws_ecs_cluster.ecs_cluster.id
 task_definition = aws_ecs_task_definition.ecs_task_definition[count.index].arn
 desired_count   = 1

 network_configuration {
   subnets         = var.subnet_ids
   security_groups = [var.security_group_id]
 }

 force_new_deployment = true
 placement_constraints {
   type = "distinctInstance"
 }

 triggers = {
   redeployment = timestamp()
 }

 capacity_provider_strategy {
   capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
   weight            = 100
 }

 load_balancer {
   target_group_arn = var.aws_lb_target_group_arn
   container_name   = "dockergs"
   container_port   = 80
 }

 depends_on = [var.autoscaling_group_arn]
}