FROM node:18-alpine

COPY ./front /front

WORKDIR /front


RUN npm install


EXPOSE 3000

CMD ["npm", "run", "dev"]