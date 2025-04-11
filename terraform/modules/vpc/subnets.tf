locals {
  subnets = concat(
    [for i in range(length(var.public_subnet_cidrs)) : {
      name      = "public_subnet"
      cidr      = var.public_subnet_cidrs[i]
      az        = var.azs[i]
      is_public = true
    }],
  )
}

resource "aws_subnet" "subnet" {
  count = length(local.subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = local.subnets[count.index].cidr
  availability_zone       = local.subnets[count.index].az
  map_public_ip_on_launch = local.subnets[count.index].is_public

  tags = {
    Name = "${local.subnets[count.index].name}_${count.index + 1}"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
 vpc_id = aws_vpc.main.id
 tags = {
   Name = "internet_gateway"
 }
}

resource "aws_route_table" "route_table" {
 vpc_id = aws_vpc.main.id
 route {
   cidr_block = "0.0.0.0/0"
   gateway_id = aws_internet_gateway.internet_gateway.id
 }
}

resource "aws_route_table_association" "subnets_route" { 
  count = length(local.subnets)

  subnet_id      = aws_subnet.subnet[count.index].id
  route_table_id = aws_route_table.route_table.id
}