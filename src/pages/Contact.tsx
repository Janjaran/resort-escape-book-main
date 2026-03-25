import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AnimatedSection from "@/components/AnimatedSection";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: { name: form.name, email: form.email, message: form.message },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="pt-20 md:pt-24">
      <section className="py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-4">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            We'd love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <AnimatedSection>
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-primary mb-6">
                    Resort Information
                  </h2>
                  <div className="space-y-6">
                    {[
                      { icon: MapPin, label: "Address", value: "123 Coastal Drive, Paradise Bay, PB 90210" },
                      { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                      { icon: Mail, label: "Email", value: "sansairomualdo@gmail.com" },
                      { icon: Clock, label: "Front Desk", value: "24 hours, 7 days a week" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <item.icon size={18} className="text-accent" />
                        </div>
                        <div>
                          <p className="font-body text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-body text-base text-foreground font-medium">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map embed */}
                <div className="rounded-xl overflow-hidden shadow-card aspect-video">
                  <iframe
                    title="Resort Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjciTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1234567890"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.15}>
              <div className="bg-card rounded-xl p-8 md:p-10 shadow-card">
                <h2 className="font-display text-2xl font-bold text-primary mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Your Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Full name"
                      required
                      maxLength={100}
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      maxLength={255}
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body text-sm">Message</Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help?"
                      required
                      maxLength={2000}
                      rows={5}
                      className="font-body"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-body text-base font-semibold py-6"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
}
