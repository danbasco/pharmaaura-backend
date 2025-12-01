# PharmaAura - Backend

Backend MVP for a simple pharmacy e-commerce built with Node.js, Express and MongoDB.

Run the app:

```bash
npm run dev
```

API (overview):

- POST /api/auth/register { name, email, password, phone, address }
- POST /api/auth/login { email, password }
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)
- POST /api/cart/add { productId, quantity }
- DELETE /api/cart/remove/:productId
- GET /api/cart
- POST /api/orders/create { address, deliveryMethod }
- GET /api/orders/:id
- GET /api/orders/user
- GET /api/orders/track/:id
- POST /api/payments/confirm { orderId }

See `.env.example` for environment variables.

**Requests Example (cURL)**

- Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"João Silva","email":"joao@example.com","password":"senha123","phone":"+5511999999999","address":"Rua A, 123"}'
```

- Login (get Token):

```bash
curl -X POST http://localhost:3000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"joao@example.com","password":"senha123"}'
```

- List Products:

```bash
curl http://localhost:3000/api/products
```

- Create Product (admin) — Assuming you already have a JWT Token `ADMIN_TOKEN`:

```bash
curl -X POST http://localhost:3000/api/products \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $ADMIN_TOKEN" \
	-d '{"name":"Paracetamol","description":"Analgesic","category":"Analgesic","price":9.9,"stock":100,"image":"https://example.com/img.png"}'
```

- Add item to cart (user authenticated `USER_TOKEN`):

```bash
curl -X POST http://localhost:3000/api/cart/add \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $USER_TOKEN" \
	-d '{"productId":"<PRODUCT_ID>","quantity":2}'
```

- Get cart:

```bash
curl -H "Authorization: Bearer $USER_TOKEN" http://localhost:3000/api/cart
```

- Create Order (checkout):

```bash
curl -X POST http://localhost:3000/api/orders/create \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $USER_TOKEN" \
	-d '{"address":"Rua A, 123","deliveryMethod":"delivery"}'
```

- Confirm Payment (mock):

```bash
curl -X POST http://localhost:3000/api/payments/confirm \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $USER_TOKEN" \
	-d '{"orderId":"<ORDER_ID>"}'
```

- Track order:

```bash
curl -H "Authorization: Bearer $USER_TOKEN" http://localhost:3000/api/orders/track/<ORDER_ID>
```

**Postman Examples**

- Simple Collection to use on Postman:
	- POST `http://localhost:3000/api/auth/register` — body JSON (raw)
	- POST `http://localhost:3000/api/auth/login` — body JSON (raw)
	- GET `http://localhost:3000/api/products`
	- POST `http://localhost:3000/api/products` — Header `Authorization: Bearer <ADMIN_TOKEN>` — body JSON
	- POST `http://localhost:3000/api/cart/add` — Header `Authorization: Bearer <USER_TOKEN>` — body JSON
	- POST `http://localhost:3000/api/orders/create` — Header `Authorization: Bearer <USER_TOKEN>` — body JSON
	- POST `http://localhost:3000/api/payments/confirm` — Header `Authorization: Bearer <USER_TOKEN>` — body JSON

You must create crie enviroment variables `USER_TOKEN`, `ADMIN_TOKEN`, `PRODUCT_ID`, `ORDER_ID` and replace on the requests.
