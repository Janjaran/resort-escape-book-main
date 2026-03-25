import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { rooms } from "@/data/rooms";
import { Users, Maximize } from "lucide-react";

export default function Rooms() {
  return (
    <main className="pt-20 md:pt-24">
      {/* Header */}
      <section className="py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-4">Accommodations</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Rooms & Suites
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Each room is a sanctuary of comfort, designed to immerse you in the beauty of the coast.
          </p>
        </div>
      </section>

      {/* Room Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4 space-y-16 max-w-6xl">
          {rooms.map((room, i) => (
            <AnimatedSection key={room.id} delay={i * 0.1}>
              <div className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow`}>
                <div className="lg:w-1/2 aspect-[4/3] lg:aspect-auto">
                  <img
                    src={room.image}
                    alt={`${room.name} at The Serene Escape Resort`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-3">
                    {room.name}
                  </h2>
                  <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                    {room.description}
                  </p>
                  <div className="flex items-center gap-6 mb-6 font-body text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users size={16} className="text-accent" /> Up to {room.maxGuests} guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize size={16} className="text-accent" /> {room.size}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {room.amenities.map((a) => (
                      <span
                        key={a}
                        className="font-body text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-2xl md:text-3xl font-bold text-accent">
                        ${room.pricePerNight}
                      </span>
                      <span className="font-body text-sm text-muted-foreground ml-1">/ night</span>
                    </div>
                    <Link to={`/booking?room=${room.id}`}>
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body text-sm font-semibold px-6">
                        Book This Room
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  );
}
