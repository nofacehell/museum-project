# Users API

This API manages user profiles and related functionality.

## Endpoints

### Get User Profile

Retrieve the current user's profile information.

**URL**: `/users/profile`  
**Method**: `GET`  
**Auth required**: Yes

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "visitor",
    "profile": {
      "phone": "+1234567890",
      "address": "123 Main St",
      "preferences": {
        "notifications": true,
        "language": "en"
      }
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Update User Profile

Update the current user's profile information.

**URL**: `/users/profile`  
**Method**: `PUT`  
**Auth required**: Yes

#### Request Body
```json
{
  "name": "John Updated",
  "profile": {
    "phone": "+1987654321",
    "address": "456 New St",
    "preferences": {
      "notifications": false,
      "language": "fr"
    }
  }
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Updated",
    "role": "visitor",
    "profile": {
      "phone": "+1987654321",
      "address": "456 New St",
      "preferences": {
        "notifications": false,
        "language": "fr"
      }
    },
    "updatedAt": "2024-03-01T12:00:00Z"
  }
}
```

### Get User Tickets

Retrieve all tickets purchased by the current user.

**URL**: `/users/tickets`  
**Method**: `GET`  
**Auth required**: Yes

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by ticket status (valid/used/cancelled) |
| startDate | string | Filter tickets after this date |
| endDate | string | Filter tickets before this date |

#### Success Response
```json
{
  "status": "success",
  "data": {
    "tickets": [
      {
        "id": "TKT-789",
        "type": "regular",
        "price": 15.00,
        "date": "2024-03-15",
        "status": "valid",
        "qrCode": "base64_encoded_qr_code"
      }
    ],
    "total": 5
  }
}
```

### Get User Event Registrations

Retrieve all event registrations for the current user.

**URL**: `/users/registrations`  
**Method**: `GET`  
**Auth required**: Yes

#### Success Response
```json
{
  "status": "success",
  "data": {
    "registrations": [
      {
        "id": "REG-123456",
        "eventId": "123",
        "eventTitle": "Ancient Art Exhibition",
        "date": "2024-04-01",
        "status": "confirmed",
        "attendees": [
          {
            "name": "John Doe",
            "ticketId": "TKT-789"
          }
        ]
      }
    ],
    "total": 3
  }
}
```

### Change Password

Update the current user's password.

**URL**: `/users/password`  
**Method**: `PUT`  
**Auth required**: Yes

#### Request Body
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

#### Success Response
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| USR_001 | User not found |
| USR_002 | Invalid profile data |
| USR_003 | Current password incorrect |
| USR_004 | New password too weak |
| USR_005 | Unauthorized access |
| USR_006 | Email already in use | 