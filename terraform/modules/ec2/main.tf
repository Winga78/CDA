resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "ecs-template"
  image_id      = data.aws_ami.ecs_ami.id
  instance_type = "t3.micro"

  key_name               = "deployer"
  vpc_security_group_ids = [var.security_group_id]

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 30
      volume_type = "gp2"
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecs-instance"
    }
  }

  user_data = filebase64("${path.module}/ecs.sh")
}


resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "ecs_instance_profile"
  role = var.aws_iam_role_name
}