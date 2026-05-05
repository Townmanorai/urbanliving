# Feedback API — Backend Documentation

## Overview

User apne booking ke baad "Feedback" button click karta hai.
Ek right-side drawer open hota hai jisme 6 categories ko 1–5 stars mein rate karna hai + optional remarks.
Submit hone par frontend yeh data `POST /api/feedback` pe bhejta hai.

---

## API 1 — Feedback Submit

### `POST /api/feedback`

**Request Body (JSON):**

```json
{
  "booking_id":    "abc123",
  "property_id":   "prop456",
  "property_name": "Ovika Signature 2",
  "username":      "rahul_sharma",
  "user_id":       "user_789",

  "overall_experience": 5,
  "cleanliness":        4,
  "location":           5,
  "value_for_money":    4,
  "amenities":          3,
  "staff_behavior":     5,

  "remarks": "Bahut accha stay tha, staff helpful tha."
}
```

**Field Details:**

| Field | Type | Required | Description |
|---|---|---|---|
| booking_id | string | Yes | Booking ka ID |
| property_id | string | Yes | Property ka ID |
| property_name | string | No | Property name (display ke liye) |
| username | string | Yes | Logged-in user ka username |
| user_id | string | No | Logged-in user ka ID |
| overall_experience | integer 1–5 | Yes | Overall stay rating |
| cleanliness | integer 1–5 | Yes | Property cleanliness rating |
| location | integer 1–5 | Yes | Location convenience rating |
| value_for_money | integer 1–5 | Yes | Price vs value rating |
| amenities | integer 1–5 | Yes | WiFi, AC, etc. rating |
| staff_behavior | integer 1–5 | Yes | Owner/staff behavior rating |
| remarks | string | No | Free text, max 500 chars |

**Success Response (200 or 201):**

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback_id": "fb_001"
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "message": "booking_id is required"
}
```

---

## API 2 — Feedback Fetch (Admin use)

### `GET /api/feedback`

Query params (all optional):

| Param | Example | Description |
|---|---|---|
| property_id | ?property_id=prop456 | Filter by property |
| username | ?username=rahul | Filter by user |
| page | ?page=1 | Pagination |
| limit | ?limit=20 | Items per page |

**Response:**

```json
{
  "success": true,
  "total": 50,
  "page": 1,
  "limit": 20,
  "feedbacks": [
    {
      "id": 1,
      "booking_id": "abc123",
      "property_id": "prop456",
      "property_name": "Ovika Signature 2",
      "username": "rahul_sharma",
      "overall_experience": 5,
      "cleanliness": 4,
      "location": 5,
      "value_for_money": 4,
      "amenities": 3,
      "staff_behavior": 5,
      "average_rating": 4.33,
      "remarks": "Bahut accha stay tha.",
      "created_at": "2026-05-05T10:30:00Z"
    }
  ]
}
```

---

## Database Table — `feedback`

```sql
CREATE TABLE feedback (
  id                  SERIAL PRIMARY KEY,
  booking_id          VARCHAR(100) NOT NULL,
  property_id         VARCHAR(100) NOT NULL,
  property_name       VARCHAR(255),
  username            VARCHAR(100) NOT NULL,
  user_id             VARCHAR(100),

  overall_experience  SMALLINT NOT NULL CHECK (overall_experience BETWEEN 1 AND 5),
  cleanliness         SMALLINT NOT NULL CHECK (cleanliness BETWEEN 1 AND 5),
  location            SMALLINT NOT NULL CHECK (location BETWEEN 1 AND 5),
  value_for_money     SMALLINT NOT NULL CHECK (value_for_money BETWEEN 1 AND 5),
  amenities           SMALLINT NOT NULL CHECK (amenities BETWEEN 1 AND 5),
  staff_behavior      SMALLINT NOT NULL CHECK (staff_behavior BETWEEN 1 AND 5),

  average_rating      DECIMAL(3,2) GENERATED ALWAYS AS (
                        (overall_experience + cleanliness + location +
                         value_for_money + amenities + staff_behavior) / 6.0
                      ) STORED,

  remarks             TEXT,
  created_at          TIMESTAMP DEFAULT NOW()
);
```

> MongoDB use kar rahe ho to same fields ka schema banao, `average_rating` computed field ke roop mein save karo.

---

## Validation Rules (Backend)

- `booking_id`, `username` — required, string
- `overall_experience`, `cleanliness`, `location`, `value_for_money`, `amenities`, `staff_behavior` — required, integer, range 1–5
- `remarks` — optional, string, max 500 characters
- Duplicate check (optional): ek `booking_id` ke liye sirf ek feedback allow karo

---

## Base URLs

| Environment | URL |
|---|---|
| Local | `http://localhost:3030` |
| Production | `https://townmanor.ai` |

Full endpoint: `POST https://townmanor.ai/api/feedback`
