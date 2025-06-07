# Tickets API

This API handles ticket management for museum visits and events.

## Endpoints

### Get Available Tickets

Retrieve a list of available tickets.

**URL**: `/tickets`  
**Method**: `GET`  
**Auth required**: No

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| date | string | Filter by date (YYYY-MM-DD) |
| type | string | Filter by ticket type (regular/special) |
| status | string | Filter by status (available/sold-out) |

#### Success Response
```json
{
  "status": "success",
  "data": {
    "tickets": [
      {
        "id": "123",
        "type": "regular",
        "price": 15.00,
        "date": "2024-03-15",
        "available": true,
        "maxPerPerson": 5
      }
    ],
    "total": 50
  }
}
```

### Purchase Ticket

Purchase a ticket for a museum visit.

**URL**: `/tickets/purchase`  
**Method**: `POST`  
**Auth required**: Yes

#### Request Body
```json
{
  "ticketId": "123",
  "quantity": 2,
  "visitorInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "orderId": "ORD-123456",
    "tickets": [
      {
        "id": "TKT-789",
        "type": "regular",
        "price": 15.00,
        "date": "2024-03-15",
        "qrCode": "base64_encoded_qr_code"
      }
    ],
    "totalAmount": 30.00,
    "paymentStatus": "completed"
  }
}
```

### Get Ticket Details

Retrieve details of a purchased ticket.

**URL**: `/tickets/{ticketId}`  
**Method**: `GET`  
**Auth required**: Yes

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "TKT-789",
    "type": "regular",
    "price": 15.00,
    "date": "2024-03-15",
    "visitorInfo": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "qrCode": "base64_encoded_qr_code",
    "status": "valid",
    "purchaseDate": "2024-03-01T10:00:00Z"
  }
}
```

### Cancel Ticket

Cancel a purchased ticket.

**URL**: `/tickets/{ticketId}/cancel`  
**Method**: `POST`  
**Auth required**: Yes

#### Success Response
```json
{
  "status": "success",
  "data": {
    "ticketId": "TKT-789",
    "refundAmount": 15.00,
    "status": "cancelled"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| TKT_001 | Ticket not found |
| TKT_002 | Ticket not available |
| TKT_003 | Invalid ticket quantity |
| TKT_004 | Payment failed |
| TKT_005 | Ticket already cancelled |
| TKT_006 | Cancellation period expired | 