import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  email: string;
  phone: string;
  guests: number;
  special_requests: string;
  created_at: string;
}

export async function getUnavailableDates(roomId: string): Promise<Date[]> {
  const { data: roomBookings } = await supabase
    .from("bookings")
    .select("check_in, check_out")
    .eq("room_id", roomId);

  const dates: Date[] = [];
  for (const booking of roomBookings || []) {
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }
  return dates;
}

export async function isRoomAvailable(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean> {
  const checkInStr = checkIn.toISOString().split("T")[0];
  const checkOutStr = checkOut.toISOString().split("T")[0];

  // Overlap: existing.check_in < checkOut AND existing.check_out > checkIn
  const { data } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", roomId)
    .lt("check_in", checkOutStr)
    .gt("check_out", checkInStr)
    .limit(1);

  return !data || data.length === 0;
}

export async function addBooking(booking: Omit<Booking, "id" | "created_at">): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("bookings").insert(booking);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
