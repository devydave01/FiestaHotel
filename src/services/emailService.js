const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@fiestahotel.com';

/**
 * Core function to send emails via Brevo API
 */
const sendBrevoEmail = async ({ to, subject, html }) => {
  if (!BREVO_API_KEY || BREVO_API_KEY === 'your_brevo_api_key_here') {
    console.warn('Brevo API key is not set. Skipping email.');
    return;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: "Fiesta Hotel & Suites", email: SENDER_EMAIL },
      to: [{ email: Array.isArray(to) ? to[0] : to }],
      subject: subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Brevo Error Details:', err);
    throw new Error(err.message || 'Failed to send email via Brevo');
  }

  return response.json();
};

// ─── 1. Notify ADMIN when a guest makes a booking ───────────────────────────
export const notifyAdminNewBooking = async ({ guestName, guestEmail, guestPhone, room, checkIn, checkOut, nights, totalPrice, bookingId, senderName, senderAccount }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
      <div style="background:#f97316;padding:24px 32px;">
        <h1 style="color:white;margin:0;font-size:22px;">🏨 New Booking Request</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;">A guest has submitted a booking and is awaiting your approval.</p>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Booking ID</td><td style="padding:8px 0;font-weight:bold;">${bookingId}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Guest Name</td><td style="padding:8px 0;">${guestName}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Guest Email</td><td style="padding:8px 0;">${guestEmail}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Phone</td><td style="padding:8px 0;">${guestPhone || 'N/A'}</td></tr>
          <tr style="border-top:1px solid #eee;"><td colspan="2" style="padding:4px;"></td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Room</td><td style="padding:8px 0;">${room}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Check-in</td><td style="padding:8px 0;">${checkIn}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Check-out</td><td style="padding:8px 0;">${checkOut}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Nights</td><td style="padding:8px 0;">${nights}</td></tr>
          <tr style="border-top:1px solid #eee;"><td colspan="2" style="padding:4px;"></td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Transfer Name</td><td style="padding:8px 0;font-weight:bold;">${senderName}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Account Number</td><td style="padding:8px 0;font-weight:bold;">${senderAccount}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Total Amount</td><td style="padding:8px 0;font-size:18px;font-weight:bold;color:#f97316;">₦${totalPrice.toLocaleString()}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#fff7ed;border-radius:8px;border:1px solid #fed7aa;">
          <p style="margin:0;color:#92400e;font-size:13px;">Please verify the bank transfer and log in to the admin dashboard to <strong>approve or reject</strong> this booking.</p>
        </div>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: ADMIN_EMAIL,
    subject: `🏨 New Booking Request — ${guestName} | ${bookingId}`,
    html,
  });
};

// ─── 2. Notify GUEST when admin APPROVES their booking ───────────────────────
export const notifyGuestApproved = async ({ guestName, guestEmail, room, checkIn, checkOut, nights, totalPrice, bookingId }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
      <div style="background:#f97316;padding:24px 32px;">
        <h1 style="color:white;margin:0;font-size:22px;">✅ Booking Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;">Your stay at Fiesta Hotel & Suites is confirmed.</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:16px;">Dear <strong>${guestName}</strong>,</p>
        <p style="color:#555;">Great news! Your payment has been verified and your booking is now <strong style="color:#16a34a;">confirmed</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Booking ID</td><td style="padding:8px 0;font-weight:bold;">${bookingId}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Room</td><td style="padding:8px 0;">${room}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Check-in</td><td style="padding:8px 0;font-weight:bold;">${checkIn}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Check-out</td><td style="padding:8px 0;font-weight:bold;">${checkOut}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Duration</td><td style="padding:8px 0;">${nights} Night(s)</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;font-weight:bold;">Total Paid</td><td style="padding:8px 0;font-size:18px;font-weight:bold;color:#f97316;">₦${totalPrice.toLocaleString()}</td></tr>
        </table>
        <div style="margin-top:8px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
          <p style="margin:0;color:#166534;font-size:13px;">We look forward to welcoming you! Please keep this email as your booking confirmation. See you soon 🎉</p>
        </div>
        <p style="margin-top:24px;color:#888;font-size:12px;">— The Fiesta Hotel Team</p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: guestEmail,
    subject: `✅ Your Fiesta Booking is Confirmed! | ${bookingId}`,
    html,
  });
};

// ─── 3. Notify GUEST when admin REJECTS their booking ────────────────────────
export const notifyGuestRejected = async ({ guestName, guestEmail, bookingId, reason }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
      <div style="background:#6b7280;padding:24px 32px;">
        <h1 style="color:white;margin:0;font-size:22px;">❌ Booking Update</h1>
        <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;">An update regarding your booking request.</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:16px;">Dear <strong>${guestName}</strong>,</p>
        <p style="color:#555;">Unfortunately, we were unable to verify the payment for your booking request (ID: <strong>${bookingId}</strong>).</p>
        ${reason ? `<p style="color:#555;"><strong>Reason:</strong> ${reason}</p>` : ''}
        <div style="margin-top:24px;padding:16px;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;">
          <p style="margin:0;color:#991b1b;font-size:13px;">If you believe this is a mistake or need assistance, please contact us directly or try booking again.</p>
        </div>
        <p style="margin-top:24px;color:#888;font-size:12px;">— The Fiesta Hotel Team</p>
      </div>
    </div>
  `;

  return sendBrevoEmail({
    to: guestEmail,
    subject: `❌ Fiesta Booking Update | ${bookingId}`,
    html,
  });
};
