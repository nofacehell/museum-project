# Exhibits API

This API manages museum exhibits and their information.

## Endpoints

### Get All Exhibits

Retrieve a list of all exhibits.

**URL**: `/exhibits`  
**Method**: `GET`  
**Auth required**: No

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | integer | Number of exhibits to return (default: 20) |
| offset | integer | Number of exhibits to skip (default: 0) |
| category | string | Filter by category |
| status | string | Filter by status (active/inactive) |

#### Success Response
```json
{
  "status": "success",
  "data": {
    "exhibits": [
      {
        "id": "123",
        "title": "Ancient Artifacts",
        "description": "Collection of ancient artifacts...",
        "category": "history",
        "status": "active",
        "imageUrl": "https://example.com/image.jpg",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Single Exhibit

Retrieve detailed information about a specific exhibit.

**URL**: `/exhibits/{id}`  
**Method**: `GET`  
**Auth required**: No

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "title": "Ancient Artifacts",
    "description": "Collection of ancient artifacts...",
    "category": "history",
    "status": "active",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "details": {
      "era": "Ancient",
      "location": "Main Hall",
      "curator": "John Smith"
    }
  }
}
```

### Create Exhibit

Create a new exhibit (Admin only).

**URL**: `/exhibits`  
**Method**: `POST`  
**Auth required**: Yes (Admin)

#### Request Body
```json
{
  "title": "New Exhibit",
  "description": "Description of the new exhibit...",
  "category": "art",
  "imageUrl": "https://example.com/new-image.jpg",
  "details": {
    "era": "Modern",
    "location": "Gallery 1",
    "curator": "Jane Doe"
  }
}
```

#### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "124",
    "title": "New Exhibit",
    "description": "Description of the new exhibit...",
    "category": "art",
    "status": "active",
    "imageUrl": "https://example.com/new-image.jpg",
    "createdAt": "2024-01-02T00:00:00Z",
    "details": {
      "era": "Modern",
      "location": "Gallery 1",
      "curator": "Jane Doe"
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| EXH_001 | Exhibit not found |
| EXH_002 | Invalid exhibit data |
| EXH_003 | Unauthorized access |
| EXH_004 | Invalid category | 