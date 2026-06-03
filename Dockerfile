FROM node:20-slim

RUN apt-get update && apt-get install -y curl zstd && \
    curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN printf '#!/bin/bash\nollama serve &\nsleep 8\nollama pull tinyllama\nnode server.js\n' > /start.sh && chmod +x /start.sh

EXPOSE 3000

CMD ["/start.sh"]
