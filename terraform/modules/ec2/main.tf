resource "aws_instance" "cda_server" {
  ami           = "ami-04e914639d0cca79a"
  instance_type = "t2.micro"
  subnet_id     = var.public_subnets[0] 
  vpc_security_group_ids = [aws_security_group.ssh_access.id]
  associate_public_ip_address = true

  user_data = templatefile("init-script.sh", {
    public_key = file("~/.ssh/id_rsa.pub")
  })

  tags = {
    Name = "JacksBlogExample"
  }
}

resource "aws_eip" "cda_ip" {
  instance = aws_instance.cda_server.id
  vpc      = true
}
