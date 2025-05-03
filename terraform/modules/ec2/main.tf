resource "aws_instance" "cda_server" {
  ami           = "ami-03b82db05dca8118d"
  instance_type = "t2.micro"
  subnet_id     = var.public_subnets[0] 
  vpc_security_group_ids = [aws_security_group.ssh_access.id]
  associate_public_ip_address = true

 user_data = <<EOF
#!/bin/bash
echo "Setting up SSH key"
mkdir -p /home/ubuntu/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDMWGyWzCiRMPyxVky/eFrimXwt5gWzpq4H3IlwOujOPFzAzLSm38rEUKUnWVhPmfHQArLqW/OM8lWZPZFM27L8ab6WTFU5YRkeTtoy4MJJ9U/4TI7rcz1TbQDB7XMhPK/HxAUyOom9w592twJXPMU/uAcPw0p9dUH1oPF4YJJD3YkMmldufhB4QvwD3pXVEanbB82NSY7uK5fGK6hG2eqF5A5NFpTgvdE78moSOBnGx86UE4yCm1XdngOVtvGZxDEYPQkbyBzWUsbB0oIH7r/2OSW44lPQIfhmcs6hBtzUp8CQVCkxg1lyWhMhjIoLqBwPwr9Gyy9iigAfUeqs6krjdHNw5Wl7B1LIcHJthk4v8IU28cyXF7LzLeNB1iuv4mJWBj61VApbwRULfe+hvNtUXYq5Gg6/B+39+3pk2K1ywVTSsMnELKK2jTzlykwFj/RNFV+8bysMGVGjVEkgbFW3T1hXtrw9EUe6RM2SuCCu1owu8T2ql/Fnlp18sLypHGM1ewKPCPnyE2iJk8goQLM4GzY1wdWBiz8WQ5ZR2/mAFrB+f+3g+YpkkZsZNQWz9gbzq7fBRw19htIQ6HlyYN67FsT81CYeB/gqeXppd9IalPiv2sgTPlCfDSV5o5SSY6beWbc6BYkq9dVIv02v6wyYvuukfkw1f8U8RUEiPwjzvw== wiwi@wiwi-virtual-machine" >> /home/ubuntu/.ssh/authorized_keys
chown -R ubuntu:ubuntu /home/ubuntu/.ssh
chmod 700 /home/ubuntu/.ssh
chmod 600 /home/ubuntu/.ssh/authorized_keys
EOF

  tags = {
    Name = "JacksBlogExample"
  }
}

resource "aws_eip" "cda_ip" {
  instance = aws_instance.cda_server.id
  vpc      = true
}
