resource "aws_ecs_cluster" "ecs_cluster" {
 name = "my-cda-ecs-cluster"
}

locals {
  tasks = concat(
    [for i in range(length(var.ecs_task_definition)) : {
      name      = var.ecs_task_definition[i]
    }],
  )
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
 count = length(local.tasks)
 family             = local.tasks[count.index].name
 network_mode       = "awsvpc"
 execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
 cpu                = 256
 runtime_platform {
   operating_system_family = "LINUX"
   cpu_architecture        = "X86_64"
 }
 container_definitions = jsonencode([
   {
     name      = "dockergs"
     image     = "public.ecr.aws/f9n5f1l7/dgs:latest"
     cpu       = 256
     memory    = 512
     essential = true
     portMappings = [
       {
         containerPort = 80
         hostPort      = 80
         protocol      = "tcp"
       }
     ]
   }
 ])
}