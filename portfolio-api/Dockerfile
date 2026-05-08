echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_rele^C
kh@kh-HP-EliteBook-840-G3:~/Devops/portfolio-liaison/portfolio-api$ cat Dockerfile 
# 1. On part d'une image Node.js légère
FROM node:20-alpine

# 2. On crée le dossier de travail dans la boîte
WORKDIR /app

# 3. On copie les fichiers de dépendances
COPY package*.json ./

# 4. On installe les dépendances
RUN npm install

# 5. On copie tout le code source
COPY . .

# 6. On expose le port 5000
EXPOSE 5000

# 7. On démarre l'API
CMD ["npm", "start"]
