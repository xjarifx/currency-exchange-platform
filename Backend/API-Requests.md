# Currency Exchange API - Example Requests

Base URL: `http://localhost:5059`

---

## 1. Login (Admin)

**POST** `/api/auth/login`

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "email": "admin@currencyexchange.com",
    "expiration": "2026-06-23T12:00:00Z"
  },
  "message": "Login successful."
}
```

---

## 2. Login (User)

**POST** `/api/auth/login`

```json
{
  "username": "user",
  "password": "user123"
}
```

---

## 3. Get Current User

**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <your_token_here>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "admin",
    "email": "admin@currencyexchange.com",
    "role": "Admin"
  }
}
```

---

## 4. Validate Token

**GET** `/api/auth/validate`

Headers:
```
Authorization: Bearer <your_token_here>
```

**Response (valid):**
```json
{ "valid": true }
```

**Response (invalid):**
```json
{ "valid": false }
```

---

## 5. Get Supported Currencies

**GET** `/api/currency/currencies`

Headers:
```
Authorization: Bearer <your_token_here>
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "code": "USD", "name": "United States Dollar" },
    { "code": "EUR", "name": "Euro" },
    { "code": "GBP", "name": "British Pound" },
    ...
  ]
}
```

---

## 6. Convert Currency (USD to EUR)

**POST** `/api/currency/convert`

Headers:
```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

```json
{
  "sourceCurrency": "USD",
  "targetCurrency": "EUR",
  "amount": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sourceCurrency": "USD",
    "targetCurrency": "EUR",
    "amount": 100,
    "convertedAmount": 92.50,
    "rate": 0.925,
    "timestamp": "2026-06-23T10:30:00Z"
  }
}
```

---

## Quick Test Sequence

1. **Login** → POST `/api/auth/login` with `admin` / `admin123`
2. Copy the `token` from response
3. **Get user** → GET `/api/auth/me` with `Authorization: Bearer <token>`
4. **List currencies** → GET `/api/currency/currencies` with Bearer token
5. **Convert** → POST `/api/currency/convert` with Bearer token + body
