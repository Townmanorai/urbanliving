# Airbnb Data Maintain — Backend TODO

Admin panel ke "Airbnb Data Maintain" section mein ab table ke har row pe **Edit** aur **Delete** button bhi hain (GET/POST already ban chuke hain aur kaam kar rahe hain — un mein koi change nahi). Iske liye 2 naye endpoints chahiye: **PUT** (update) aur **DELETE** (remove), same table (`airbnb_bookings`) pe.

Ek naya field bhi add hua hai — **`confirmation_code`** (Airbnb ka booking confirmation code, jaise `HMABCD1234` — alphanumeric, letters aur numbers dono ho sakte hain). Ye field GET, POST, aur PUT — teeno mein hai. DB table mein ek column add karna hoga:

```sql
ALTER TABLE airbnb_bookings ADD COLUMN confirmation_code VARCHAR(50) NULL;
```

Base URL: `https://www.townmanor.ai/api/airbnb-bookings`

---

## 1. PUT — record update karo (Edit popup se)

```
PUT https://www.townmanor.ai/api/airbnb-bookings/:id
Content-Type: multipart/form-data
```

POST jaisi hi body hai (same fields, same multer setup reuse ho sakta hai) — bas URL mein record ka `id` jaata hai. Fields wahi hain jo POST mein hain:

`username`, `phone_number`, `property_name`, `city`, `property_id`, `confirmation_code`, `start_date`, `end_date`, `id_type`, `aadhar_number`, `passport_number`, `passport_name`, `passport_dob`, `subtotal`, `discount_amount`, `gst_amount`, `total_price`, `booking_status`, `payment_status`, aur optional file `user_photo`.

**Important:** `user_photo` field **sirf tab aayegi jab admin ne naya photo select kiya ho**. Agar admin sirf naam/status jaisi cheez edit kar raha hai aur photo nahi chhedi, to `user_photo` field is request mein bilkul nahi aayegi — us case mein **purani photo waisi hi rehni chahiye** (overwrite/delete mat karo).

Success (200): updated record wapas bhejo, poora object (jaisa GET/POST mein aata hai — `data` ke andar ya seedha, dono chalega frontend handle kar leta hai).

Error (400/404): 
```json
{ "success": false, "message": "Booking not found" }
```

## 2. DELETE — record delete karo

```
DELETE https://www.townmanor.ai/api/airbnb-bookings/:id
```

Success (200): kuch bhi bhej do, frontend list se hata deta hai apne aap. Agar record na mile to 404 + `{ "success": false, "message": "..." }`.

---

## Reference — GET aur POST already bane hue hain (recap, koi change nahi)

**GET** `https://www.townmanor.ai/api/airbnb-bookings` → `{ success: true, data: [ ...records ] }`

**POST** `https://www.townmanor.ai/api/airbnb-bookings` (multipart/form-data) → same fields jo upar likhe hain, `user_photo` file optional, response mein poora saved record (201).

Record shape (GET, POST, PUT teeno mein same):

```json
{
  "id": 142,
  "username": "string",
  "phone_number": "string",
  "property_name": "string",
  "city": "string",
  "property_id": 81,
  "confirmation_code": "HMABCD1234",
  "start_date": "2026-10-07",
  "end_date": "2026-10-10",
  "id_type": "aadhaar",
  "aadhar_number": "string",
  "passport_number": "string",
  "passport_name": "string",
  "passport_dob": "string",
  "subtotal": 7797,
  "discount_amount": 0,
  "gst_amount": 389.85,
  "total_price": 8186.85,
  "booking_status": "confirmed",
  "payment_status": "paid",
  "user_photo": "/files/airbnb-bookings/1787566840523-user_photo.jpg",
  "created_at": "2026-08-24T10:20:13.000Z",
  "updated_at": "2026-08-24T10:20:13.000Z"
}
```

Bas itna hi karna hai — PUT aur DELETE dono short hain, existing GET/POST code (multer setup, validation) largely reuse ho jayega.
