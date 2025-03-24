CREATE DATABASE IF NOT EXISTS dev_cda_chat;
CREATE DATABASE IF NOT EXISTS dev_cda_project;
CREATE DATABASE IF NOT EXISTS dev_cda_project_user_post;
CREATE USER IF NOT EXISTS 'wiwi'@'%' IDENTIFIED BY 'wiwi123';
GRANT ALL PRIVILEGES ON dev_cda_chat.* TO 'wiwi'@'%';
GRANT ALL PRIVILEGES ON dev_cda_project.* TO 'wiwi'@'%';
GRANT ALL PRIVILEGES ON dev_cda_project_user_post.* TO 'wiwi'@'%';
FLUSH PRIVILEGES;