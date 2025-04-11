module "vpc" {
  source                  = "./modules/vpc"
  vpc_cidr_block          = "10.0.0.0/16"
  public_subnet_cidrs     = ["10.0.1.0/24", "10.0.2.0/24"]
  azs                     = ["eu-west-3a", "eu-west-3b"]
}

module "ecr" {
  source            = "./modules/ecr"
  repository_name   = "mon-super-repo"
}

module "ec2" {
  source = "./modules/ec2"
  vpc_id                  = module.vpc.vpc_id
  subnet_ids              = module.vpc.subnet_ids
  security_group_id       = module.vpc.security_group_id
  aws_iam_role_name       = module.ecs.aws_iam_role_name
}

module "ecs" {
  source = "./modules/ecs"
  subnet_ids              = module.vpc.subnet_ids
  security_group_id       = module.vpc.security_group_id
  autoscaling_group_arn   = module.ec2.autoscaling_group_arn
  aws_lb_target_group_arn = module.ec2.aws_lb_target_group_arn
}
