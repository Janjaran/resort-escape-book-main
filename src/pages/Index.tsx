import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { Waves, Utensils, Dumbbell, Sparkles, Wifi, Car } from "lucide-react";

import heroImg from "@/assets/hero-resort.jpg";
import galleryBeach from "@/assets/gallery-beach.jpg";
import gallerySpa from "@/assets/gallery-spa.jpg";
import galleryDining from "@/assets/gallery-dining.jpg";

const amenities = [
{ icon: Waves, title: "Infinity Pool", desc: "Ocean-edge pool with panoramic views" },
{ icon: Utensils, title: "Fine Dining", desc: "World-class cuisine by the sea" },
{ icon: Sparkles, title: "Luxury Spa", desc: "Rejuvenating treatments & wellness" },
{ icon: Dumbbell, title: "Fitness Center", desc: "State-of-the-art equipment" },
{ icon: Wifi, title: "High-Speed Wi-Fi", desc: "Complimentary throughout resort" },
{ icon: Car, title: "Airport Transfer", desc: "Complimentary luxury transfer" }];


const gallery = [
{ src: galleryBeach, alt: "Pristine white sand beach at The Serene Escape" },
{ src: gallerySpa, alt: "Spa and wellness pool overlooking the ocean" },
{ src: galleryDining, alt: "Fine dining terrace at sunset" }];


export default function Index() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="The Serene Escape luxury resort with infinity pool at golden hour"
          className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-sand mb-6 leading-tight">
            Your Serene Escape Awaits
          </h1>
          <p className="font-body text-lg md:text-xl text-sand/90 mb-10 max-w-xl mx-auto">
            A luxury coastal retreat where every moment is crafted for tranquility and timeless elegance.
          </p>
          <Link to="/booking">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body text-base font-semibold tracking-wide px-10 py-6 rounded-lg shadow-elevated">
              Check Availability
            </Button>
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <AnimatedSection>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-4">Welcome</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-6 mx-0 border-0">
              A Sanctuary by the Sea
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
              Nestled along a pristine coastline, The Serene Escape offers an
              unparalleled blend of natural beauty and world-class hospitality.
              From our infinity pool overlooking the ocean to our signature spa
              treatments, every detail is designed to help you unwind, reconnect,
              and discover paradise.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-4">Experience</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
                Resort Amenities
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {amenities.map((a, i) =>
            <AnimatedSection key={a.title} delay={i * 0.1}>
                <div className="bg-card rounded-lg p-8 text-center shadow-card hover:shadow-elevated transition-shadow">
                  <a.icon className="mx-auto mb-4 text-accent" size={32} />
                  <h3 className="font-display text-lg font-semibold text-primary mb-2">{a.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{a.desc}</p>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="font-body text-sm uppercase tracking-[0.2em] text-accent mb-4">Gallery</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">
                Moments of Serenity
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {gallery.map((img, i) =>
            <AnimatedSection key={i} delay={i * 0.15}>
                <div className="overflow-hidden rounded-lg aspect-[4/3]">
                  <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy" />
                
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Begin Your Journey
            </h2>
            <p className="font-body text-lg text-primary-foreground/80 mb-10 max-w-lg mx-auto">
              Reserve your stay and discover the art of coastal luxury.
            </p>
            <Link to="/booking">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body text-base font-semibold tracking-wide px-10 py-6 rounded-lg">
                Book Your Stay
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>);

}