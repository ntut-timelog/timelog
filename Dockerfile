FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/

FROM node:10.16.3
ADD . /app
WORKDIR /app

# Run node server
CMD ["node", "server.js"]
