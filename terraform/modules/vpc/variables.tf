variable "vpc_cidr_block" {
  type = string
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "azs" {
  type = list(string)
}
