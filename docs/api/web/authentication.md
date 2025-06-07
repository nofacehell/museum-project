# Authentication API

This API handles user authentication and authorization.

## Endpoints

### Login

Authenticate a user and receive an access token.

**URL**: `/auth/login`  
**Method**: `POST`  
**Auth required**: No

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "role": "visitor"
    }
  }
}
```

### Register

Create a new user account.

**URL**: `/auth/register`  
**Method**: `POST`  
**Auth required**: No

#### Request Body
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "newuser@example.com",
    "name": "John Doe",
    "role": "visitor"
  }
}
```

### Refresh Token

Get a new access token using a refresh token.

**URL**: `/auth/refresh`  
**Method**: `POST`  
**Auth required**: Yes (Refresh token)

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Email already registered |
| AUTH_003 | Invalid refresh token |
| AUTH_004 | Token expired | 