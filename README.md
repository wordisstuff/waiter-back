# AURUM AI Waiter Backend

Backend API for **AURUM AI Waiter** — an AI-powered restaurant assistant that helps guests reserve tables, browse the menu, get dish recommendations, create orders, track order status, and close a restaurant visit.

Built with **NestJS**, **Prisma**, **PostgreSQL**, and **OpenAI API**.

---

## Main Features

- Restaurant table reservation
- Chat session per table
- AI waiter powered by OpenAI
- Menu-aware recommendations
- Allergy-aware dish suggestions
- Order creation and order status tracking
- Active order memory for AI context
- Session closing and table cleaning workflow
- CORS-ready for frontend deployment

---

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- OpenAI API
- class-validator / class-transformer
- Render deployment ready

---

## Project Structure

```txt
src/
  ai/              OpenAI waiter logic
  chat/            Chat sessions and AI messages
  menu/            Static restaurant menu
  orders/          Orders and order status
  prisma/          Prisma service
  restaurants/     Restaurant data and tables
  tables/          Table reservation/status logic
```

---

## Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
OPENAI_API_KEY="your_openai_api_key"
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

For production on Render:

```env
FRONTEND_URL="https://www.aiwaiter.us"
```

---

## Installation

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed database:

```bash
npx prisma db seed
```

Start development server:

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:4000
```

---

## API Endpoints

### Restaurants

```http
GET /restaurants/:slug/tables
```

### Tables

```http
POST /tables/:id/reserve
```

```json
{
  "partySize": 2
}
```

---

### Chat

```http
POST /chat/message
```

```json
{
  "sessionId": "session-id",
  "message": "Що порадиш без молочного?"
}
```

---

### Menu

```http
GET /menu
```

---

### Orders

```http
POST /orders
```

```json
{
  "sessionId": "session-id",
  "items": [
    {
      "menuItemId": "borsch-pampushky",
      "name": "Борщ з пампушками та часником",
      "price": 16,
      "quantity": 1
    }
  ]
}
```

---

## AI Waiter Logic

The AI waiter receives:

- customer message
- table number
- party size
- menu
- recent chat history
- current active orders

The AI recommends dishes using `recommendedItemIds`, while the frontend renders beautiful interactive dish cards.

Orders are created only through frontend UI actions and the `/orders` endpoint.

---

## Deployment on Render

Build command:

```bash
npm install && npx prisma generate && npm run build
```

Start command:

```bash
npm run start
```

Production frontend URL:

```env
FRONTEND_URL=https://www.aiwaiter.us
```

---

## Author

Created by wordisstuff for the AURUM AI Waiter hackathon project.
