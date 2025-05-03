terraform {
  backend "s3" {
    bucket = "mon-terraform-state-cda-1746282858"
    key    = "production/terraform.tfstate"
    region = "eu-west-3"
    encrypt = true
  }
}

module "vpc" {
  source                  = "./modules/vpc"
  vpc_cidr_block          = "10.0.0.0/16"
  public_subnet_cidrs     = ["10.0.1.0/24", "10.0.2.0/24"]
  privates_subnet_cidrs   = ["10.0.3.0/24", "10.0.4.0/24"]
  azs                     = ["eu-west-3a", "eu-west-3b"]
}

module "ecr" {
  source            = "./modules/ecr"
  repository_name   = var.services
}

module "db"{
  source                = "./modules/db"
  security_groups_ecs   = module.ecs.security_groups_ecs
  vpc_id                = module.vpc.vpc_id
  DB_DATABASE_CHAT      = var.DB_DATABASE_CHAT
  DB_DATABASE_PROJECT   = var.DB_DATABASE_PROJECT
  DB_DATABASE_RELATION  = var.DB_DATABASE_RELATION
  MYSQL_ADMIN_USER      = var.MYSQL_ADMIN_USER
  MYSQL_ADMIN_PASSWORD  = var.MYSQL_ADMIN_PASSWORD
  privates_subnets      = module.vpc.subnets_privates_id
  public_subnets        = module.vpc.subnets_public_id
}


module "ecs" {
  source                                 = "./modules/ecs"
  privates_subnets                       = module.vpc.subnets_privates_id
  public_subnets                         = module.vpc.subnets_public_id
  repository_url                         = module.ecr.repository_url
  vpc_id                                 = module.vpc.vpc_id
  mysql_host                             = module.db.mysql_host
  service_name                           = var.services
  DB_DATABASE_CHAT                       = var.DB_DATABASE_CHAT
  DB_DATABASE_PROJECT                    = var.DB_DATABASE_PROJECT
  DB_DATABASE_RELATION                   = var.DB_DATABASE_RELATION
  DB_PORT                                = var.DB_PORT
  DB_TYPE                                = var.DB_TYPE
  JWT_SECRET                             = var.JWT_SECRET
  PORT                                   = var.PORT
  MONGODB_URI                            = var.MONGODB_URI
  MYSQL_PASSWORD                         = var.MYSQL_PASSWORD
  MYSQL_USER                             = var.MYSQL_USER
  VITE_AUTH_SERVICE_URL                  = var.VITE_AUTH_SERVICE_URL
  VITE_CHAT_SERVICE_URL                  = var.VITE_CHAT_SERVICE_URL
  VITE_PROJECT_SERVICE_URL               = var.VITE_PROJECT_SERVICE_URL
  VITE_PROJECT_USER_POST_SERVICE_URL     = var.VITE_PROJECT_USER_POST_SERVICE_URL
  NODE_ENV                               = var.NODE_ENV
} 
