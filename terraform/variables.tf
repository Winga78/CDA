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

# variable MONGODB_URI {}
# variable NODE_ENV {}
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
# variable hash {}

variable "MONGODB_URI" {
  description = "URI de connexion MongoDB"
  type        = string
  default     = "mongodb+srv://user:password@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority"
}

variable "NODE_ENV" {
  description = "Environnement d'exécution"
  type        = string
  default     = "development"
}

variable "VITE_AUTH_SERVICE_URL" {
  description = "URL du service d'authentification"
  type        = string
  default     = "http://localhost:3001"
}

variable "VITE_CHAT_SERVICE_URL" {
  description = "URL du service de chat"
  type        = string
  default     = "http://localhost:3002"
}

variable "VITE_PROJECT_SERVICE_URL" {
  description = "URL du service projet"
  type        = string
  default     = "http://localhost:3003"
}

variable "VITE_PROJECT_USER_POST_SERVICE_URL" {
  description = "URL du service user post"
  type        = string
  default     = "http://localhost:3004"
}

variable "MYSQL_PASSWORD" {
  description = "Mot de passe utilisateur MySQL"
  type        = string
  default     = "app_password_123"
  sensitive   = true
}

variable "MYSQL_USER" {
  description = "Utilisateur MySQL"
  type        = string
  default     = "appuser"
}

variable "DB_DATABASE_CHAT" {
  description = "Base de données chat"
  type        = string
  default     = "chat_db"
}

variable "DB_DATABASE_PROJECT" {
  description = "Base de données projet"
  type        = string
  default     = "project_db"
}

variable "DB_DATABASE_RELATION" {
  description = "Base de données relation"
  type        = string
  default     = "relation_db"
}

variable "DB_PORT" {
  description = "Port de la base de données"
  type        = string
  default     = 3306
}

variable "DB_TYPE" {
  description = "Type de base de données"
  type        = string
  default     = "mysql"
}

variable "JWT_SECRET" {
  description = "Clé secrète JWT"
  type        = string
  default     = "s3cr3tK3yJWT_ReplaceMe!"
  sensitive   = true
}

variable "PORT" {
  description = "Port de l'application"
  type        = string
  default     = 4000
}

variable "MYSQL_ADMIN_PASSWORD" {
  description = "Mot de passe admin MySQL"
  type        = string
  default     = "admin_password_123"
  sensitive   = true
}

variable "MYSQL_ADMIN_USER" {
  description = "Utilisateur admin MySQL"
  type        = string
  default     = "root"
}

variable "DB_HOST" {
  description = "Adresse de la base de données"
  type        = string
  default     = "localhost"
}
variable "hash" {
  description = "Hash secret pour les opérations de sécurité"
  type        = string
  default     = "s3cr3tH4sh_ReplaceMe!"
  sensitive   = true
}