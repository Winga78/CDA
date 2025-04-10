#!/bin/bash

source ../.env

MYSQL_ADMIN_USER="$MYSQL_ADMIN_USER"
MYSQL_ADMIN_PASSWORD="$MYSQL_ADMIN_PASSWORD"
MYSQL_HOST="$DB_HOST"

if [ -z "$MYSQL_ADMIN_USER" ] || [ -z "$MYSQL_ADMIN_PASSWORD" ] || [ -z "$MYSQL_HOST" ] || \
   [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ] || \
   [ -z "$DB_DATABASE_CHAT" ] || [ -z "$DB_DATABASE_PROJECT" ] || [ -z "$DB_DATABASE_RELATION" ]; then
    echo "Erreur : Une ou plusieurs variables d'environnement sont manquantes."
    exit 1
fi

SQL_COMMANDS=""

SQL_COMMANDS+="
SELECT 1 FROM mysql.user WHERE user='root' AND host='localhost' AND authentication_string=''; 
"

SQL_COMMANDS+="
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ADMIN_PASSWORD';
FLUSH PRIVILEGES;
"

SQL_COMMANDS+="
CREATE DATABASE IF NOT EXISTS $DB_DATABASE_CHAT;
CREATE DATABASE IF NOT EXISTS $DB_DATABASE_PROJECT;
CREATE DATABASE IF NOT EXISTS $DB_DATABASE_RELATION;
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_DATABASE_CHAT.* TO '$MYSQL_USER'@'%';
GRANT ALL PRIVILEGES ON $DB_DATABASE_PROJECT.* TO '$MYSQL_USER'@'%';
GRANT ALL PRIVILEGES ON $DB_DATABASE_RELATION.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
"

mysql -u "$MYSQL_ADMIN_USER" -p"$MYSQL_ADMIN_PASSWORD" -h "$MYSQL_HOST" -e "$SQL_COMMANDS"

if [ $? -eq 0 ]; then
    echo "Les bases de données et l'utilisateur ont été créés avec succès."
else
    echo "Une erreur est survenue lors de l'exécution des commandes."
fi