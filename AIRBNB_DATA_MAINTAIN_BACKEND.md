# Airbnb Data Maintain — Backend TODO

Admin panel mein ek naya section "Airbnb Data Maintain" add kiya gaya hai (Booking Inquiries jaisa hi table, bas manually Airbnb bookings add karne ke liye). Frontend ready hai, sirf ye 2 APIs banani hain — bilkul `booking-request` jaisi hi shape mein.

## 1. GET — list

```
GET https://www.townmanor.ai/api/airbnb-bookings
```

Response: array of records (ya `{ data: [...] }`), same fields jo neeche di hain. Sort by `created_at` desc frontend khud kar leta hai.

## 2. POST — create (Add popup se)

Ye request ab **`multipart/form-data`** hai (JSON nahi), kyunki Photo ID ab ek text URL field nahi hai — admin seedha apne computer se photo file upload karta hai.

```
POST https://www.townmanor.ai/api/airbnb-bookings
Content-Type: multipart/form-data
```

Form fields (jo bhi khaali chhoda gaya wo bilkul bheja hi nahi jaata, field missing samjho):

| Field | Type | Notes |
|---|---|---|
| `username` | text | Guest full name |
| `phone_number` | text | 10-digit mobile |
| `property_name` | text | e.g. "Ovika Signature 5" |
| `city` | text | e.g. "Noida" |
| `property_id` | text (number) | optional |
| `start_date` | text (`YYYY-MM-DD`) | check-in |
| `end_date` | text (`YYYY-MM-DD`) | check-out |
| `id_type` | text | `"aadhaar"` or `"passport"` |
| `aadhar_number` | text | if id_type = aadhaar |
| `passport_number` | text | if id_type = passport |
| `passport_name` | text | if id_type = passport |
| `passport_dob` | text | if id_type = passport |
| `subtotal` | text (number) | ₹ |
| `discount_amount` | text (number) | ₹ |
| `gst_amount` | text (number) | ₹ |
| `total_price` | text (number) | ₹ |
| `booking_status` | text | `confirmed \| pending \| accepted \| cancelled \| rejected` |
| `payment_status` | text | `paid \| pending` |
| `user_photo` | **file** (image, jpg/png) | optional — actual uploaded photo, present only if admin ne file choose ki ho |

Notes:
- Backend ko multipart parser lagana hoga (e.g. `multer` Node mein). `user_photo` file ko apne storage (S3 / local `/uploads`) mein save karke uska URL/path DB mein store karna hai.
- `id_type` ya to `"aadhaar"` ya `"passport"` — usi ke hisaab se `aadhar_number` ya `passport_number`/`passport_name`/`passport_dob` bhare honge.
- Response mein created record wapas bhej do (poora object with `id`, `created_at`, aur `user_photo` ki final saved **URL** ya relative path) — agar nahi bheja to frontend list dubara GET kar lega, lekin turant table mein dikhane ke liye best hai ki bana hua record hi return ho.

## Response record shape (dono GET aur POST ke liye)

```json
{
  "id": 142,
  "username": "string",
  "phone_number": "string",
  "property_name": "string",
  "city": "string",
  "property_id": 81,
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
  "user_photo": "",
  "created_at": "2026-10-01T10:30:00Z"
}
```

Yehi table `booking-request` API se milta-julta hai, bas ek naya table/collection banega (kyunki ye Airbnb se aayi hui bookings hain jo manually enter ki ja rahi hain, real property bookings se alag rakhni hain).
