// External lead CRM forwarding (Supabase ingest-lead function).
// Shared by every lead-capture surface in the app (property detail enquiry
// modal, ads landing page, etc.) so all leads land in the same external CRM
// feed regardless of which form on the site produced them.
const LEAD_INGEST_URL = 'https://ltxrufpovgsapunjdmwp.supabase.co/functions/v1/ingest-lead';
const LEAD_INGEST_TENANT_TOKEN = '392af738ee89f213764df32b1d1bdbe5ef5bd1ca511cd5f3';

export function toIndianPhone(raw) {
  const digits = (raw || '').replace(/\D/g, '').slice(-10);
  return digits ? `+91${digits}` : undefined;
}

export function forwardLeadToIngestEndpoint({ name, phone, email, source }) {
  if (!phone && !email) return; // endpoint requires at least one of phone/email
  fetch(LEAD_INGEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-token': LEAD_INGEST_TENANT_TOKEN,
    },
    body: JSON.stringify({ name, phone, email, source }),
  }).catch(() => {
    // Non-blocking: this is a secondary CRM feed, never surface its failures to the user.
  });
}
