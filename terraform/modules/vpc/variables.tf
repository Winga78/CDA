variable "vpc_cidr_block" {}
variable "public_subnet_cidrs" {
  type = list(string)
}
variable "privates_subnet_cidrs" {
  type = list(string)
}
variable "azs" {
  type = list(string)
}