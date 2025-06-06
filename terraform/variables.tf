variable services {
  type                 = map(list(string))
  default              = {
   "frontend"          = ["/*"],
   "project"           = ["/projects/*"],
   "project-user-post" = ["/project-user/*", "/post-user/*","/vote/socket.io/*"],
   "auth"              = ["/users/*","/auth/*","uploads/*"],
   "chat"              = ["/posts/*","/chat/socket.io/*"]
  }
  description = "description"
}

variable MONGODB_URI {}
variable NODE_ENV {}
variable MYSQL_PASSWORD {}
variable MYSQL_USER {}
variable DB_DATABASE_CHAT {}
variable DB_DATABASE_PROJECT {}
variable DB_DATABASE_RELATION {}
variable DB_PORT {}
variable DB_TYPE {}
variable JWT_SECRET {}
variable PORT {}
variable MYSQL_ADMIN_PASSWORD {}
variable MYSQL_ADMIN_USER {}
variable DB_HOST {}
variable hash {}

