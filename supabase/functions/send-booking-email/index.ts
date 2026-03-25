import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Pingram } from "npm:pingram";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ROOM_NAMES: Record<string, string> = {
  "garden-room": "Garden View Room",
  "deluxe-ocean": "Deluxe Ocean Suite",
  "premium-villa": "Premium Pool Villa",
  "presidential-suite": "Presidential Suite",
};

const pingram = new Pingram({
  apiKey: "pingram_sk_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJrZXlfNTM2MzQxMGI3MTc4NGZjZDZjYzZmNjAwMGY3OTQ2ZWMiLCJ2ZXJzaW9uIjoxLCJhY2NvdW50SWQiOiJhNnJsNnd0bWp4ZndtdjV4Nmp3eGQ2NTVpNiIsImtleVR5cGUiOiJzZWNyZXQiLCJlbnZpcm9ubWVudElkIjoiYTZybDZ3dG1qeGZ3bXY1eDZqd3hkNjU1aTYifQ.i-F9bfzQpnSsTADcZVzAHd3uE9m-cJvn3Iumg5StXbA",
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, checkIn, checkOut, guestName, email, phone, guests, specialRequests, totalPrice } = await req.json();

    if (!guestName || !email || !checkIn || !checkOut || !roomId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roomName = ROOM_NAMES[roomId] || roomId;

    // --- 1. Management notification (email + SMS) ---
    const managementHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1a1a2e; border-bottom: 2px solid #c9a96e; padding-bottom: 16px;">New Booking Received</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Guest Name</td><td style="padding: 8px 0; font-weight: bold;">${guestName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone || "N/A"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Room</td><td style="padding: 8px 0; font-weight: bold;">${roomName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Check-in</td><td style="padding: 8px 0;">${checkIn}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Check-out</td><td style="padding: 8px 0;">${checkOut}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Guests</td><td style="padding: 8px 0;">${guests || 1}</td></tr>
          ${totalPrice ? `<tr><td style="padding: 8px 0; color: #666;">Total Price</td><td style="padding: 8px 0; font-weight: bold;">$${totalPrice}</td></tr>` : ""}
          ${specialRequests ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Special Requests</td><td style="padding: 8px 0;">${specialRequests}</td></tr>` : ""}
        </table>
      </div>
    `;

    await pingram.send({
      type: "booking_form_serene",
      to: {
        id: "sasairomualdo@gmail.com",
        email: "sasairomualdo@gmail.com",
        number: "+639763249330",
      },
      email: {
        subject: `New Booking: ${guestName} — ${roomName} — ${checkIn} to ${checkOut}`,
        html: managementHtml,
      },
      sms: {
        message: `New Booking: ${guestName}, ${roomName}, ${checkIn} to ${checkOut}, ${guests || 1} guest(s)${totalPrice ? `, $${totalPrice}` : ""}`,
      },
    });

    console.log("Management notification sent");

    // --- 2. Customer confirmation email ---
    const customerHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #faf9f6;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">Booking Confirmed!</h1>
          <p style="color: #c9a96e; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px;">Thank you for choosing us</p>
        </div>
        <div style="background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <p style="color: #333; font-size: 16px; margin: 0 0 24px;">Dear ${guestName},</p>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            We are delighted to confirm your reservation. Here are the details of your upcoming stay:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
            <tr><td style="padding: 12px 0; color: #888; border-bottom: 1px solid #eee; width: 140px; font-size: 14px;">Room</td><td style="padding: 12px 0; font-weight: bold; color: #1a1a2e; border-bottom: 1px solid #eee; font-size: 14px;">${roomName}</td></tr>
            <tr><td style="padding: 12px 0; color: #888; border-bottom: 1px solid #eee; font-size: 14px;">Check-in</td><td style="padding: 12px 0; color: #333; border-bottom: 1px solid #eee; font-size: 14px;">${checkIn}</td></tr>
            <tr><td style="padding: 12px 0; color: #888; border-bottom: 1px solid #eee; font-size: 14px;">Check-out</td><td style="padding: 12px 0; color: #333; border-bottom: 1px solid #eee; font-size: 14px;">${checkOut}</td></tr>
            <tr><td style="padding: 12px 0; color: #888; border-bottom: 1px solid #eee; font-size: 14px;">Guests</td><td style="padding: 12px 0; color: #333; border-bottom: 1px solid #eee; font-size: 14px;">${guests || 1}</td></tr>
            ${totalPrice ? `<tr><td style="padding: 12px 0; color: #888; font-size: 14px;">Total</td><td style="padding: 12px 0; font-weight: bold; color: #c9a96e; font-size: 18px;">$${totalPrice}</td></tr>` : ""}
          </table>
          ${specialRequests ? `<p style="color: #555; font-size: 13px; background: #f5f3ef; padding: 12px 16px; border-radius: 8px; margin: 0 0 24px;"><strong>Your special requests:</strong> ${specialRequests}</p>` : ""}
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">
            If you have any questions or need to make changes to your reservation, please don't hesitate to contact us.
          </p>
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #999; font-size: 12px; margin: 0;">We look forward to welcoming you!</p>
          <p style="color: #c9a96e; font-size: 13px; font-weight: bold; margin-top: 4px;">Resort Escape</p>
        </div>
      </div>
    `;

    await pingram.send({
      type: "booking_form_serene",
      to: {
        id: email,
        email: email,
      },
      email: {
        subject: `Booking Confirmed — ${roomName} — ${checkIn} to ${checkOut}`,
        html: customerHtml,
      },
    });

    console.log("Customer confirmation sent to", email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
