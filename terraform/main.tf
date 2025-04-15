module "vpc" {
  source                  = "./modules/vpc"
  vpc_cidr_block          = "10.0.0.0/16"
  public_subnet_cidrs     = ["10.0.1.0/24", "10.0.2.0/24"]
  privates_subnet_cidrs   = ["10.0.3.0/24", "10.0.4.0/24"]
  azs                     = ["eu-west-3a", "eu-west-3b"]
}

module "ecr" {
  source            = "./modules/ecr"
  repository_name   = ["frontend-repo", "project-repo", "project-user-post-repo" , "auth-repo" , "chat-repo"]
}