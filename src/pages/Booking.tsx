import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { format, differenceInDays, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedSection from "@/components/AnimatedSection";
import { rooms } from "@/data/rooms";
import { getUnavailableDates, isRoomAvailable, addBooking } from "@/data/bookings";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get("room") || "";

  const [selectedRoom, setSelectedRoom] = useState(preselectedRoom || rooms[0].id);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: "1",
    specialRequests: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (preselectedRoom) setSelectedRoom(preselectedRoom);
  }, [preselectedRoom]);

  const loadUnavailableDates = useCallback(async () => {
    const dates = await getUnavailableDates(selectedRoom);
    setUnavailableDates(dates);
  }, [selectedRoom]);

  useEffect(() => {
    loadUnavailableDates();
  }, [loadUnavailableDates]);

  const currentRoom = rooms.find((r) => r.id === selectedRoom)!;
  const nights =
    dateRange.from && dateRange.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;
  const totalPrice = nights * currentRoom.pricePerNight;

  const isDateUnavailable = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
    return unavailableDates.some((d) => isSameDay(d, date));
  };

  const canSubmit =
    dateRange.from &&
    dateRange.to &&
    nights > 0 &&
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.phone.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange.from || !dateRange.to || !canSubmit) return;

    setSubmitting(true);

    const available = await isRoomAvailable(selectedRoom, dateRange.from, dateRange.to);
    if (!available) {
      toast.error("This room is not available for the selected dates. Please choose different dates.");
      setSubmitting(false);
      return;
    }

    const result = await addBooking({
      room_id: selectedRoom,
      check_in: format(dateRange.from, "yyyy-MM-dd"),
      check_out: format(dateRange.to, "yyyy-MM-dd"),
      guest_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      guests: parseInt(formData.guests),
      special_requests: formData.specialRequests,
    });

    if (!result.success) {
      toast.error("Failed to save booking. Please try again.");
      setSubmitting(false);
      return;
    }

    // Try sending email notification
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      if (projectId) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/send-booking-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roomId: selectedRoom,
              checkIn: format(dateRange.from, "yyyy-MM-dd"),
              checkOut: format(dateRange.to, "yyyy-MM-dd"),
              guestName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              guests: parseInt(formData.guests),
              specialRequests: formData.specialRequests,
              totalPrice,
            }),
          }
        );
      }
    } catch {
      // Email sending is best-effort
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
        <AnimatedSection>
          <div className="text-center max-w-md mx-auto px-4">
            <CheckCircle className="mx-auto mb-6 text-accent" size={64} />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
              Booking Confirmed!
            </h1>
            <p className="font-body text-muted-foreground mb-6">
              Thank you, {formData.fullName}. Your reservation for the{" "}
              <strong>{currentRoom.name}</strong> from{" "}
              <strong>{format(dateRange.from!, "MMM dd, yyyy")}</strong> to{" "}
              <strong>{format(dateRange.to!, "MMM dd, yyyy")}</strong> ({nights}{" "}
              night{nights > 1 ? "s" : ""}) has been received.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-2">
              Total: <strong className="text-accent">${totalPrice.toLocaleString()}</strong>
            </p>
            <p className="font-body text-sm text-muted-foreground mb-8">
              A confirmation email will be sent to {formData.email}.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setDateRange({});
                setFormData({ fullName: "", email: "", phone: "", guests: "1", specialRequests: "" });
              }}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-body"
            >
              Make Another Reservation
            </Button>
          </div>
        </AnimatedSection>
      </main>
    );
  }

  return (
    <main className="pt-20 md:pt-24">
      <section className="py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-4">Reservations</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Book Your Stay
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Select your dates, choose your room, and let us prepare your perfect escape.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left column - Form */}
              <div className="lg:w-3/5 space-y-8">
                <AnimatedSection>
                  <div className="bg-card rounded-xl p-8 shadow-card">
                    <h2 className="font-display text-xl font-bold text-primary mb-6">
                      1. Select Your Room
                    </h2>
                    <Select value={selectedRoom} onValueChange={(v) => { setSelectedRoom(v); setDateRange({}); }}>
                      <SelectTrigger className="font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id} className="font-body">
                            {room.name} — ${room.pricePerNight}/night
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.1}>
                  <div className="bg-card rounded-xl p-8 shadow-card">
                    <h2 className="font-display text-xl font-bold text-primary mb-2">
                      2. Choose Your Dates
                    </h2>
                    <p className="font-body text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Greyed-out dates are unavailable
                    </p>
                    <div className="flex justify-center">
                      <Calendar
                        mode="range"
                        selected={dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined}
                        onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                        disabled={isDateUnavailable}
                        numberOfMonths={2}
                        className={cn("p-3 pointer-events-auto rounded-lg")}
                      />
                    </div>
                    {dateRange.from && dateRange.to && (
                      <div className="mt-4 text-center font-body text-sm text-muted-foreground">
                        {format(dateRange.from, "MMM dd")} → {format(dateRange.to, "MMM dd, yyyy")} · {nights} night{nights > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <div className="bg-card rounded-xl p-8 shadow-card">
                    <h2 className="font-display text-xl font-bold text-primary mb-6">
                      3. Guest Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-body text-sm">Full Name *</Label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="John Smith"
                          required
                          maxLength={100}
                          className="font-body"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body text-sm">Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@email.com"
                          required
                          maxLength={255}
                          className="font-body"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body text-sm">Phone Number *</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          required
                          maxLength={20}
                          className="font-body"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-body text-sm">Number of Guests</Label>
                        <Select
                          value={formData.guests}
                          onValueChange={(v) => setFormData({ ...formData, guests: v })}
                        >
                          <SelectTrigger className="font-body">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: currentRoom.maxGuests }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)} className="font-body">
                                {i + 1} Guest{i > 0 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="font-body text-sm">Special Requests</Label>
                        <Textarea
                          value={formData.specialRequests}
                          onChange={(e) =>
                            setFormData({ ...formData, specialRequests: e.target.value })
                          }
                          placeholder="Early check-in, extra pillows, dietary requirements..."
                          maxLength={1000}
                          className="font-body"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Right column - Summary */}
              <div className="lg:w-2/5">
                <div className="lg:sticky lg:top-28">
                  <AnimatedSection delay={0.15}>
                    <div className="bg-card rounded-xl p-8 shadow-elevated">
                      <h2 className="font-display text-xl font-bold text-primary mb-6">
                        Your Stay Summary
                      </h2>
                      <img
                        src={currentRoom.image}
                        alt={currentRoom.name}
                        className="w-full aspect-video object-cover rounded-lg mb-6"
                      />
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {currentRoom.name}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground mt-1 mb-6">
                        ${currentRoom.pricePerNight} per night
                      </p>

                      {dateRange.from && dateRange.to ? (
                        <div className="border-t border-border pt-4 space-y-3 font-body text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-in</span>
                            <span className="text-foreground font-medium">
                              {format(dateRange.from, "MMM dd, yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-out</span>
                            <span className="text-foreground font-medium">
                              {format(dateRange.to, "MMM dd, yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nights</span>
                            <span className="text-foreground font-medium">{nights}</span>
                          </div>
                          <div className="border-t border-border pt-3 flex justify-between items-center">
                            <span className="font-semibold text-primary text-base">Total</span>
                            <span className="font-display text-2xl font-bold text-accent">
                              ${totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="font-body text-sm text-muted-foreground italic">
                          Select dates to see pricing
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={!canSubmit || submitting}
                        className="w-full mt-8 bg-accent text-accent-foreground hover:bg-accent/90 font-body text-base font-semibold py-6"
                      >
                        {submitting ? "Processing..." : "Confirm Reservation"}
                      </Button>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
