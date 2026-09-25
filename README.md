# Product Admin Dashboard

A responsive Product Admin Dashboard built with Next.js, React, TypeScript, and Tailwind CSS using the DummyJSON API.

## Features

- User authentication and logout
- Protected product routes
- Product listing
- Responsive desktop table and mobile cards
- Pagination with page size selection
- Debounced product search
- Category filtering
- Sorting by title, price, and rating
- Product details page
- Product image gallery and reviews
- Add product
- Edit product
- Delete product with confirmation
- Form validation
- Loading, error, empty, and retry states
- URL-based search, filtering, sorting, and pagination
- Invalid URL parameter handling
- Race-condition protection for search requests
- Duplicate request prevention

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- DummyJSON API
- ESLint
- Git & GitHub

## API

This project uses the free DummyJSON REST API.

### Authentication

```text
POST /auth/login
```

Demo credentials:

```text
Username: pushkaradmin
Password: pushkar@321
```

### Product APIs

```text
GET    /products
GET    /products/:id
GET    /products/search?q=
GET    /products/category-list
GET    /products/category/:category
POST   /products/add
PUT    /products/:id
DELETE /products/:id
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pushkar-31/Newgenesis-Assignment.git
```

### 2. Navigate to the project

```bash
cd Newgenesis-Assignment
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Open:

```text
http://localhost:3000
```

## Demo Login

```text
Username: emilys
Password: emilyspass
```

## Project Structure

```text
product-admin-dashboard/
│
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── ProductsContent.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx
│   ├── layout/
│   │   └── Navbar.tsx
│   └── products/
│       ├── FilterBar.tsx
│       ├── Pagination.tsx
│       ├── ProductCard.tsx
│       ├── ProductForm.tsx
│       ├── ProductTable.tsx
│       └── SearchBar.tsx
│
├── lib/
│   └── axios.ts
│
├── services/
│   ├── authService.ts
│   └── productService.ts
│
├── types/
│   └── product.ts
│
├── next.config.ts
├── package.json
└── README.md
```

## Architecture

The project separates UI components from API logic.

### Axios

A shared Axios instance is used for all API requests.

```text
lib/axios.ts
```

It handles:

- Base API URL
- Request headers
- Authentication token
- Centralized API error handling

### Services

Authentication API logic:

```text
services/authService.ts
```

Product API logic:

```text
services/productService.ts
```

### Components

Reusable UI components are separated into smaller components such as:

- SearchBar
- FilterBar
- Pagination
- ProductTable
- ProductCard
- ProductForm
- AuthGuard
- Navbar

## Important Notes

### CRUD Persistence

DummyJSON simulates product creation, updating, and deletion. These changes are not permanently persisted on the server.

The application updates its local state after successful CRUD operations so that changes are immediately visible during the current session.

### Authentication

The access token is stored in `localStorage` for this assignment. Protected product routes require a valid stored token.

## Available Scripts

### Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

## Deployment

The application can be deployed using platforms such as Vercel or Netlify.

## License

This project was created as a frontend assignment.