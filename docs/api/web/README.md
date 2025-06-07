# Web API Documentation

This section contains documentation for all web-related APIs in the museum project.

## Table of Contents

1. [Authentication API](./authentication.md)
2. [Exhibits API](./exhibits.md)
3. [Tickets API](./tickets.md)
4. [Events API](./events.md)
5. [Users API](./users.md)

## General Information

All web APIs follow RESTful principles and use JSON for request and response bodies.

### Base URL
```
https://api.museum.example.com/v1
```

### Authentication
Most endpoints require authentication. See [Authentication API](./authentication.md) for details.

### Response Format
All API responses follow this general structure:
```json
{
  "status": "success",
  "data": {},
  "message": "Optional message"
}
```

### Error Handling
Errors are returned with appropriate HTTP status codes and follow this format:
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message"
}
``` 