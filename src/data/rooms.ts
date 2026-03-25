import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomVilla from "@/assets/room-villa.jpg";
import roomPresidential from "@/assets/room-presidential.jpg";

export interface Room {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  size: string;
  image: string;
  amenities: string[];
  totalRooms: number;
}

export const rooms: Room[] = [
  {
    id: "garden-room",
    name: "Garden View Room",
    description: "A tranquil retreat surrounded by lush tropical gardens. Perfect for couples seeking a peaceful escape with direct garden access.",
    pricePerNight: 250,
    maxGuests: 2,
    size: "45 sqm",
    image: roomStandard,
    amenities: ["King Bed", "Garden View", "Rain Shower", "Mini Bar", "Wi-Fi", "Room Service"],
    totalRooms: 5,
  },
  {
    id: "deluxe-ocean",
    name: "Deluxe Ocean Suite",
    description: "Wake up to panoramic ocean views from floor-to-ceiling windows. Spacious suite with premium furnishings and a private balcony.",
    pricePerNight: 450,
    maxGuests: 3,
    size: "72 sqm",
    image: roomDeluxe,
    amenities: ["King Bed", "Ocean View", "Private Balcony", "Soaking Tub", "Mini Bar", "Butler Service"],
    totalRooms: 4,
  },
  {
    id: "premium-villa",
    name: "Premium Pool Villa",
    description: "Your own private sanctuary with a plunge pool, tropical garden, and outdoor living area. The ultimate in resort luxury.",
    pricePerNight: 750,
    maxGuests: 4,
    size: "120 sqm",
    image: roomVilla,
    amenities: ["King Bed", "Private Pool", "Outdoor Shower", "Living Room", "Kitchen", "Butler Service"],
    totalRooms: 3,
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    description: "The pinnacle of luxury. A grand suite featuring marble floors, panoramic ocean views, a private terrace, and personalized concierge service.",
    pricePerNight: 1200,
    maxGuests: 4,
    size: "200 sqm",
    image: roomPresidential,
    amenities: ["Master Bedroom", "Ocean Panorama", "Private Terrace", "Jacuzzi", "Grand Living Room", "24/7 Concierge"],
    totalRooms: 2,
  },
];
