variable services {
  type                 = map(list(string))
  default              = {
   "frontend"          = ["/"],
   "project"           = ["/api/projects/*"],
   "project-user-post" = ["/api/project-user/*", "/api/post-user/*"],
   "auth"              = ["/api/users","/api/auth/*"],
   "chat"              = ["/api/posts/*"]
  }
  description = "description"
}

variable MONGODB_URI {}
variable NODE_ENV {}
variable VITE_AUTH_SERVICE_URL {}
variable VITE_CHAT_SERVICE_URL {}
variable VITE_PROJECT_SERVICE_URL {}
variable VITE_PROJECT_USER_POST_SERVICE_URL {}
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
