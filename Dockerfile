FROM node:18-alpine
WORKDIR /app/expenseTracker
COPY package*.json /app/expenseTracker/
RUN npm install --omit=dev
COPY . /app/expenseTracker/
RUN npm run build
CMD ["npm","run", "start:prod"]