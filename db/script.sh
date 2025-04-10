#!/bin/bash
set -e
set -u

function create_user_and_database() {
  local database=$1
  echo "  Creating user and database '$database'"

  mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`$database\`;
    CREATE USER IF NOT EXISTS '$database'@'%' IDENTIFIED BY '$database';
    GRANT ALL PRIVILEGES ON \`$database\`.* TO '$database'@'%';
    FLUSH PRIVILEGES;
EOSQL
}

# Création des bases multiples
if [ -n "${MYSQL_MULTIPLE_DATABASES:-}" ]; then
  echo "Multiple database creation requested: $MYSQL_MULTIPLE_DATABASES"
  for db in $(echo "$MYSQL_MULTIPLE_DATABASES" | tr ',' ' '); do
    create_user_and_database "$db"
  done
  echo "Multiple databases created"
fi

# Privilèges globaux pour l'utilisateur principal si défini
if [ -n "${MYSQL_USER:-}" ]; then
  echo "Granting global privileges to user '$MYSQL_USER'"
  mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL
  echo "Global privileges granted to $MYSQL_USER"
fi
