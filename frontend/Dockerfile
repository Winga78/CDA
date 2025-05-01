FROM node:23-alpine3.20 AS builder

WORKDIR /app

# Copie des fichiers de dépendances et installation
COPY package*.json ./
RUN npm install

# Copie du reste des fichiers et build de l'app
COPY . .
RUN npm run build

# Étape 2 : Serveur web de production avec Nginx
FROM nginx:stable-alpine AS production

# Supprimer la config par défaut de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier ta propre config nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copier les fichiers statiques compilés depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80 (pour ALB par exemple)
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]

