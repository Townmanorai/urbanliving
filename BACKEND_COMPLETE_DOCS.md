# OvikaLiving — Complete Backend Documentation
## Feedback & Review System + Meta Leads

---

## PART 1 — PURA SYSTEM SAMJHO (Flow Diagram)

```
CUSTOMER                    BACKEND                     SUPER ADMIN              PROPERTY PAGE
   |                            |                             |                        |
   | 1. Property book karta hai |                             |                        |
   |--------------------------->|                             |                        |
   |                            |                             |                        |
   | 2. Stay complete hoti hai  |                             |                        |
   | (check-out ke baad)        |                             |                        |
   |                            |                             |                        |
   | 3. "Feedback" button click |                             |                        |
   |    karta hai dashboard pe  |                             |                        |
   |                            |                             |                        |
   | 4. Form fill karta hai:    |                             |                        |
   |    - 6 star ratings        |                             |                        |
   |    - Remarks (optional)    |                             |                        |
   |                            |                             |                        |
   | 5. Submit                  |                             |                        |
   |--------------------------->|                             |                        |
   |    POST /api/feedback      | review_status = 'pending'  |                        |
   |                            | DB mein save hota hai      |                        |
   |                            |---------------------------->|                        |
   |                            |                             | 6. Super Admin dekhta  |
   |                            |                             |    hai pending review  |
   |                            |                             |                        |
   |                            |                 APPROVE     |                        |
   |                            |<----------------------------|                        |
   |                            | PATCH /feedback/:id/approve |                        |
   |                            | review_status = 'approved' |                        |
   |                            |                             |----------------------->|
   |                            |                             |    7. Property Details |
   |                            |                             |       page pe LIVE     |
   |                            |                             |       dikhta hai       |
   |                            |                 REJECT      |                        |
   |                            |<----------------------------|                        |
   |                            | PATCH /feedback/:id/reject  |                        |
   |                            | review_status = 'rejected' |                        |
   |                            |                             | Property page pe       |
   |                            |                             | NAHI dikhta            |
```

---

## PART 2 — DATABASE TABLES

### Table 1: `feedback` (Reviews & Ratings)

```sql
CREATE TABLE feedback (
    id                  VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Booking Reference
    booking_id          VARCHAR(100) NOT NULL,
    property_id         VARCHAR(100) NOT NULL,
    property_name       VARCHAR(255),
    
    -- Customer Info
    username            VARCHAR(100) NOT NULL,
    user_id             VARCHAR(100),
    
    -- Star Ratings (1 to 5)
    overall_experience  SMALLINT NOT NULL CHECK (overall_experience BETWEEN 1 AND 5),
    cleanliness         SMALLINT NOT NULL CHECK (cleanliness BETWEEN 1 AND 5),
    location            SMALLINT NOT NULL CHECK (location BETWEEN 1 AND 5),
    value_for_money     SMALLINT NOT NULL CHECK (value_for_money BETWEEN 1 AND 5),
    amenities           SMALLINT NOT NULL CHECK (amenities BETWEEN 1 AND 5),
    staff_behavior      SMALLINT NOT NULL CHECK (staff_behavior BETWEEN 1 AND 5),
    
    -- Average (auto-calculate)
    average_rating      DECIMAL(3,2),
    
    -- Review Text
    remarks             TEXT,
    
    -- Status (IMPORTANT)
    -- 'pending'  = Customer ne submit kiya, Super Admin ne dekha nahi
    -- 'approved' = Super Admin ne approve kiya → Property page pe dikhega
    -- 'rejected' = Super Admin ne reject kiya → Kahi nahi dikhega
    review_status       VARCHAR(20) DEFAULT 'pending' 
                        CHECK (review_status IN ('pending', 'approved', 'rejected')),
    
    -- Timestamps
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    approved_at         TIMESTAMP,     -- jab approve hua
    rejected_at         TIMESTAMP      -- jab reject hua
);

-- Indexes for fast queries
CREATE INDEX idx_feedback_property   ON feedback(property_id);
CREATE INDEX idx_feedback_username   ON feedback(username);
CREATE INDEX idx_feedback_status     ON feedback(review_status);
CREATE INDEX idx_feedback_booking    ON feedback(booking_id);
```

### Table 2: `meta_leads` (Facebook/Instagram Ads Leads)

```sql
CREATE TABLE meta_leads (
    id                  SERIAL PRIMARY KEY,
    lead_id             VARCHAR(100) UNIQUE,    -- Meta ka leadgen_id
    
    -- Lead Info
    full_name           VARCHAR(255),
    phone               VARCHAR(20),
    email               VARCHAR(255),
    location            VARCHAR(255),
    room_type           VARCHAR(100),
    budget              VARCHAR(100),
    
    -- Ad Info
    ad_id               VARCHAR(100),
    ad_name             VARCHAR(255),
    campaign_name       VARCHAR(255),
    platform            VARCHAR(50) DEFAULT 'facebook',  -- 'facebook' ya 'instagram'
    
    -- Status
    lead_status         VARCHAR(20) DEFAULT 'new'
                        CHECK (lead_status IN ('new', 'contacted', 'converted', 'lost')),
    
    -- Meta Response Data (raw JSON backup)
    raw_data            JSONB,
    
    -- Timestamps
    created_time        TIMESTAMP,   -- Meta ka created_time
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meta_leads_status   ON meta_leads(lead_status);
CREATE INDEX idx_meta_leads_platform ON meta_leads(platform);
```

---

## PART 3 — API ENDPOINTS

### Base URLs
```
Local:       http://localhost:3030
Production:  https://townmanor.ai
```

---

### FEEDBACK APIs

#### API F1 — Customer Feedback Submit
```
POST /api/feedback
```

**Request Body:**
```json
{
  "booking_id":          "booking_abc123",
  "property_id":         "prop_456",
  "property_name":       "Ovika Signature 2",
  "username":            "rahul_sharma",
  "user_id":             "user_789",
  "overall_experience":  5,
  "cleanliness":         4,
  "location":            5,
  "value_for_money":     4,
  "amenities":           3,
  "staff_behavior":      5,
  "remarks":             "Bahut accha stay tha!"
}
```

**Backend Logic:**
1. Sabhi required fields validate karo
2. `average_rating` calculate karo: `(overall + cleanliness + location + value + amenities + staff) / 6`
3. `review_status = 'pending'` set karo (default)
4. DB mein save karo
5. Success response bhejo

**Success Response (201):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback_id": "abc-uuid-123"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "overall_experience is required and must be between 1-5"
}
```

**Duplicate Check (Optional but recommended):**
```sql
-- Ek booking ke liye sirf ek feedback allow karo
SELECT id FROM feedback WHERE booking_id = ? AND username = ?
-- Agar mila to 409 Conflict return karo
```

---

#### API F2 — Property Page ke liye Reviews Fetch (PUBLIC)
```
GET /api/feedback?property_id=:id&status=approved&limit=100
```

**Query Params:**
| Param | Required | Description |
|-------|----------|-------------|
| property_id | Yes | Kis property ke reviews chahiye |
| status | No | 'approved' pass karo — sirf approved dikhenge |
| limit | No | Default 20 |
| page | No | Default 1 |

**Backend Logic:**
```sql
SELECT * FROM feedback 
WHERE property_id = ? 
  AND review_status = 'approved'
ORDER BY created_at DESC
LIMIT ? OFFSET ?
```

**Response:**
```json
{
  "success": true,
  "total": 15,
  "feedbacks": [
    {
      "id": "abc123",
      "username": "Harprit Singh",
      "overall_experience": 5,
      "cleanliness": 5,
      "location": 5,
      "value_for_money": 4,
      "amenities": 4,
      "staff_behavior": 5,
      "average_rating": 4.83,
      "remarks": "Best stay ever!",
      "created_at": "2026-03-05T10:00:00Z",
      "review_status": "approved"
    }
  ]
}
```

---

#### API F3 — Super Admin ke liye ALL Reviews Fetch
```
GET /api/feedback
```

**Query Params:**
| Param | Example | Description |
|-------|---------|-------------|
| status | ?status=pending | pending / approved / rejected |
| property_id | ?property_id=prop1 | Filter by property |
| limit | ?limit=200 | Items per page |
| page | ?page=1 | Page number |

**Response:**
```json
{
  "success": true,
  "total": 50,
  "feedbacks": [ ...same format as above... ]
}
```

---

#### API F4 — Super Admin Review Approve
```
PATCH /api/feedback/:id/approved
```

**Backend Logic:**
```sql
UPDATE feedback 
SET review_status = 'approved', 
    approved_at = NOW(),
    updated_at = NOW()
WHERE id = ?
```

**Response:**
```json
{
  "success": true,
  "message": "Review approved — now live on property page"
}
```

---

#### API F5 — Super Admin Review Reject
```
PATCH /api/feedback/:id/rejected
```

**Backend Logic:**
```sql
UPDATE feedback 
SET review_status = 'rejected',
    rejected_at = NOW(),
    updated_at = NOW()
WHERE id = ?
```

**Response:**
```json
{
  "success": true,
  "message": "Review rejected"
}
```

---

### META LEADS APIs

#### API M1 — Meta Webhook (Facebook se data aata hai)
```
POST /api/meta-leads/webhook
GET  /api/meta-leads/webhook   (verification ke liye)
```

**GET (Verification):**
```javascript
// Meta verify karta hai ek baar
app.get('/api/meta-leads/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN; // apna token rakho
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});
```

**POST (Lead aata hai):**
```javascript
app.post('/api/meta-leads/webhook', async (req, res) => {
  res.sendStatus(200); // Pehle 200 bhejo (5 sec rule)
  
  const leadgen_id = req.body.entry[0].changes[0].value.leadgen_id;
  
  // Graph API se full data fetch karo
  const lead = await fetchFromGraphAPI(leadgen_id);
  
  // DB mein save karo
  await saveLead(lead);
});
```

**Graph API Call:**
```javascript
async function fetchFromGraphAPI(leadgen_id) {
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v19.0/${leadgen_id}?access_token=${ACCESS_TOKEN}`;
  const res = await axios.get(url);
  
  // Response format:
  // { id, created_time, field_data: [{name, values}] }
  
  const formatted = {};
  res.data.field_data.forEach(field => {
    formatted[field.name] = field.values[0];
  });
  
  return {
    lead_id:       res.data.id,
    created_time:  res.data.created_time,
    full_name:     formatted.full_name,
    phone:         formatted.phone_number,
    email:         formatted.email,
    location:      formatted.location,
    room_type:     formatted.what_room_type_are_you_looking_for,
    budget:        formatted.what_is_your_preferred_monthly_budget,
    raw_data:      res.data
  };
}
```

---

#### API M2 — Meta Leads Fetch (Frontend/Admin)
```
GET /api/meta-leads
```

**Query Params:**
| Param | Example | Description |
|-------|---------|-------------|
| search | ?search=Rahul | name, phone, location, campaign search |
| status | ?status=new | new / contacted / converted / lost |
| page | ?page=1 | Pagination |
| limit | ?limit=20 | Items per page |

**Response:**
```json
{
  "success": true,
  "total": 150,
  "page": 1,
  "limit": 20,
  "leads": [
    {
      "id": 1,
      "lead_id": "1234567890",
      "created_time": "2026-05-05T10:00:00Z",
      "full_name": "Rahul Sharma",
      "phone": "9876543210",
      "email": "rahul@gmail.com",
      "budget": "10k-15k",
      "location": "Pune",
      "room_type": "1BHK",
      "campaign_name": "Ovika May Campaign",
      "ad_name": "Pune Ad",
      "platform": "facebook",
      "lead_status": "new",
      "created_at": "2026-05-05T10:00:00Z"
    }
  ]
}
```

---

#### API M3 — Meta Lead Status Update
```
PATCH /api/meta-leads/:id/status
```

**Request Body:**
```json
{ "status": "contacted" }
```

**Valid Values:** `new` / `contacted` / `converted` / `lost`

**Response:**
```json
{ "success": true, "message": "Status updated" }
```

---

## PART 4 — FRONTEND KO KYA CHAHIYE (Summary)

| Frontend Page | API Call | Kab |
|---|---|---|
| User Dashboard → Feedback Button | `POST /api/feedback` | Customer submit kare |
| Property Details Page → Reviews Section | `GET /api/feedback?property_id=X&status=approved` | Page load pe |
| Super Admin → Review Feedback tab | `GET /api/feedback` (sabhi reviews) | Tab open pe |
| Super Admin → Approve button | `PATCH /api/feedback/:id/approved` | Click pe |
| Super Admin → Reject button | `PATCH /api/feedback/:id/rejected` | Click pe |
| Super Admin → Meta Leads tab | `GET /api/meta-leads` | Tab open pe |
| Super Admin → Status dropdown | `PATCH /api/meta-leads/:id/status` | Change pe |

---

## PART 5 — ENVIRONMENT VARIABLES (.env)

```env
PORT=3030
DATABASE_URL=postgresql://user:password@localhost:5432/ovikaliving

META_VERIFY_TOKEN=ovika123          # Apna unique token rakho
META_ACCESS_TOKEN=YOUR_META_ACCESS_TOKEN

JWT_SECRET=your_jwt_secret
```

---

## PART 6 — FOLDER STRUCTURE (Backend)

```
backend/
├── server.js                 # Entry point
├── .env                      # Environment variables
│
├── routes/
│   ├── feedback.routes.js    # /api/feedback
│   └── metaLeads.routes.js   # /api/meta-leads
│
├── controllers/
│   ├── feedback.controller.js
│   └── metaLeads.controller.js
│
├── models/
│   ├── feedback.model.js     # DB queries for feedback table
│   └── metaLeads.model.js    # DB queries for meta_leads table
│
└── middleware/
    └── auth.middleware.js    # Admin routes protect karo
```

---

## PART 7 — IMPORTANT RULES

1. **Feedback submit:** `review_status` hamesha `'pending'` se start hoga
2. **Property page:** Sirf `review_status = 'approved'` wale reviews dikhenge
3. **Super Admin:** Saare reviews dikhenge (pending + approved + rejected)
4. **Duplicate prevention:** Ek `booking_id` ke liye sirf ek feedback allow karo
5. **Meta Webhook:** Response 5 seconds ke andar dena zaroori hai (Meta ka rule)
6. **HTTPS required:** Meta webhook sirf HTTPS pe kaam karta hai
7. **Token security:** `META_ACCESS_TOKEN` kisi ko mat batao, `.env` mein rakho

---

## PART 8 — TESTING CHECKLIST

Backend ready hone ke baad yeh test karo:

- [ ] `POST /api/feedback` — submit karo, DB mein `pending` status check karo
- [ ] `GET /api/feedback?property_id=X&status=approved` — sirf approved aaye
- [ ] `GET /api/feedback` — saare aaye (admin)
- [ ] `PATCH /api/feedback/:id/approved` — status change ho
- [ ] `PATCH /api/feedback/:id/rejected` — status change ho
- [ ] Property page pe approved review dikh raha hai
- [ ] Rejected review property page pe NAHI dikh raha
- [ ] `GET /api/meta-leads` — pagination kaam kare
- [ ] `PATCH /api/meta-leads/:id/status` — status update ho
- [ ] Meta webhook verification kaam kare

---

*Document prepared for OvikaLiving Backend Team*
*Frontend: React + Vite | Backend: Node.js + Express recommended*
