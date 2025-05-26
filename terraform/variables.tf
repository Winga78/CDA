# variable services {
#   type        = list(string)
#   default     = ["frontend", "project", "project-user-post" , "auth" , "chat"]
#   description = "description"
# }

variable services {
  type                 = map(list(string))
  default              = {
   "frontend"          = ["/"],
   "project"           = ["/projects/*"],
   "project-user-post" = ["/project-user/*", "/post-user/*"],
   "auth"              = ["/auth/*"],
   "chat"              = ["/posts/*"]
  }
  description = "description"
}

# variable MONGODB_URI {}
# variable NODE_ENV {}
# variable VITE_AUTH_SERVICE_URL {}
# variable VITE_CHAT_SERVICE_URL {}
# variable VITE_PROJECT_SERVICE_URL {}
# variable VITE_PROJECT_USER_POST_SERVICE_URL {}
# variable MYSQL_PASSWORD {}
# variable MYSQL_USER {}
# variable DB_DATABASE_CHAT {}
# variable DB_DATABASE_PROJECT {}
# variable DB_DATABASE_RELATION {}
# variable DB_PORT {}
# variable DB_TYPE {}
# variable JWT_SECRET {}
# variable PORT {}
# variable MYSQL_ADMIN_PASSWORD {}
# variable MYSQL_ADMIN_USER {}
# variable DB_HOST {}


variable "MONGODB_URI" {
  description = "URI de connexion à MongoDB"
  type        = string
  default     = "mongodb+srv://user:password@cluster0.mongodb.net/dbname?retryWrites=true&w=majority"
}

variable "NODE_ENV" {
  description = "Environnement Node.js"
  type        = string
  default     = "development"
}

variable "VITE_AUTH_SERVICE_URL" {
  description = "URL du service d'authentification"
  type        = string
  default     = "http://auth-service:3000"
}

variable "VITE_CHAT_SERVICE_URL" {
  description = "URL du service de chat"
  type        = string
  default     = "http://chat-service:3000"
}

variable "VITE_PROJECT_SERVICE_URL" {
  description = "URL du service de gestion de projet"
  type        = string
  default     = "http://project-service:3000"
}

variable "VITE_PROJECT_USER_POST_SERVICE_URL" {
  description = "URL du service projet-user-post"
  type        = string
  default     = "http://project-user-post-service:3000"
}

variable "MYSQL_PASSWORD" {
  description = "Mot de passe utilisateur MySQL"
  type        = string
  default     = "userpassword"
  sensitive   = true
}

variable "MYSQL_USER" {
  description = "Nom d'utilisateur MySQL"
  type        = string
  default     = "user"
}

variable "MYSQL_ADMIN_PASSWORD" {
  description = "Mot de passe administrateur MySQL"
  type        = string
  default     = "adminpassword"
  sensitive   = true
}

variable "MYSQL_ADMIN_USER" {
  description = "Nom d'utilisateur administrateur MySQL"
  type        = string
  default     = "admin"
}

variable "DB_DATABASE_CHAT" {
  description = "Nom de la base de données pour le service chat"
  type        = string
  default     = "chat_db"
}

variable "DB_DATABASE_PROJECT" {
  description = "Nom de la base de données pour le service projet"
  type        = string
  default     = "project_db"
}

variable "DB_DATABASE_RELATION" {
  description = "Nom de la base de données pour le service relation (project-user-post)"
  type        = string
  default     = "relation_db"
}

variable "DB_PORT" {
  description = "Port utilisé pour la base de données"
  type        = string
  default     = "3306"
}

variable "DB_TYPE" {
  description = "Type de base de données"
  type        = string
  default     = "mysql"
}

variable "JWT_SECRET" {
  description = "Secret pour signer les tokens JWT"
  type        = string
  default     = "supersecretjwt"
  sensitive   = true
}

variable "PORT" {
  description = "Port sur lequel tourne le conteneur Node.js"
  type        = string
  default     = "3000"
}

variable "DB_HOST" {
  description = "Nom d'hôte ou IP de la base de données"
  type        = string
  default     = "mysql"
}
