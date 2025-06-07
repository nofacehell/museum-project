# Events API

This API manages museum events, including exhibitions, workshops, and special programs.

## Endpoints

### Get All Events

Retrieve a list of all upcoming events.

**URL**: `/events`  
**Method**: `GET`  
**Auth required**: No

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | Filter events starting after this date |
| endDate | string | Filter events ending before this date |
| type | string | Filter by event type (exhibition/workshop/special) |
| status | string | Filter by status (upcoming/ongoing/past) |

#### Success Response
```json
{
  "status": "success",
  "data": {
    "events": [
      {
        "id": "123",
        "title": "Ancient Art Exhibition",
        "description": "Special exhibition of ancient artifacts...",
        "type": "exhibition",
        "startDate": "2024-04-01T10:00:00Z",
        "endDate": "2024-06-30T18:00:00Z",
        "location": "Main Hall",
        "imageUrl": "https://example.com/event-image.jpg",
        "status": "upcoming"
      }
    ],
    "total": 15
  }
}
```

### Get Event Details

Retrieve detailed information about a specific event.

**URL**: `/events/{id}`  
**Method**: `GET`  
**Auth required**: No

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "title": "Ancient Art Exhibition",
    "description": "Special exhibition of ancient artifacts...",
    "type": "exhibition",
    "startDate": "2024-04-01T10:00:00Z",
    "endDate": "2024-06-30T18:00:00Z",
    "location": "Main Hall",
    "imageUrl": "https://example.com/event-image.jpg",
    "status": "upcoming",
    "details": {
      "curator": "Dr. Jane Smith",
      "capacity": 100,
      "price": 25.00,
      "schedule": [
        {
          "date": "2024-04-01",
          "startTime": "10:00",
          "endTime": "18:00"
        }
      ]
    }
  }
}
```

### Register for Event

Register a user for an event.

**URL**: `/events/{id}/register`  
**Method**: `POST`  
**Auth required**: Yes

#### Request Body
```json
{
  "ticketQuantity": 2,
  "attendees": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "registrationId": "REG-123456",
    "eventId": "123",
    "attendees": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "ticketId": "TKT-789"
      }
    ],
    "totalAmount": 50.00,
    "status": "confirmed"
  }
}
```

### Get Event Registrations

Retrieve registrations for a specific event (Admin only).

**URL**: `/events/{id}/registrations`  
**Method**: `GET`  
**Auth required**: Yes (Admin)

#### Success Response
```json
{
  "status": "success",
  "data": {
    "eventId": "123",
    "registrations": [
      {
        "registrationId": "REG-123456",
        "userId": "456",
        "attendees": [
          {
            "name": "John Doe",
            "email": "john@example.com"
          }
        ],
        "registrationDate": "2024-03-01T10:00:00Z",
        "status": "confirmed"
      }
    ],
    "total": 50
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| EVT_001 | Event not found |
| EVT_002 | Event registration closed |
| EVT_003 | Event capacity reached |
| EVT_004 | Invalid registration data |
| EVT_005 | Unauthorized access |
| EVT_006 | Registration already exists 