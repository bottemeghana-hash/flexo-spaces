
require("dotenv").config();

const mongoose = require("mongoose");
const Workspace = require("./models/Workspace");

const initialWorkspaces = [
  {
    workspaceId: "1",
    name: "The Executive Suite",
    location: "Hitech City, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹85,000",
    amount: 85000,
    period: "/ month",
    capacity: "10–15 people",
    area: "1,200 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Private Office", "Premium Wi-Fi", "Valet Parking"],
  },
  {
    workspaceId: "2",
    name: "The Creative Hub",
    location: "Jubilee Hills, Hyderabad",
    type: "SHARED WORKSPACE",
    price: "₹18,000",
    amount: 18000,
    period: "/ month",
    capacity: "1–4 people",
    area: "Shared Desk",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Designer Interiors", "Cafeteria", "Power Backup"],
  },
  {
    workspaceId: "3",
    name: "The Grand Boardroom",
    location: "Gachibowli, Hyderabad",
    type: "MEETING ROOM",
    price: "₹3,500",
    amount: 3500,
    period: "/ hour",
    capacity: "12–20 people",
    area: "650 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Executive Seating", "Projector", "Video Conferencing"],
  },
  {
    workspaceId: "4",
    name: "The Platinum Offices",
    location: "Financial District, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹75,000",
    amount: 75000,
    period: "/ month",
    capacity: "8–12 people",
    area: "1,000 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Dedicated Team Space", "Reception", "24/7 Security"],
  },
  {
    workspaceId: "5",
    name: "The Imperial Workspace",
    location: "Banjara Hills, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹65,000",
    amount: 65000,
    period: "/ month",
    capacity: "6–10 people",
    area: "900 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Luxury Interiors", "Private Cabins", "Executive Lounge"],
  },
  {
    workspaceId: "6",
    name: "The Urban Collective",
    location: "Madhapur, Hyderabad",
    type: "SHARED WORKSPACE",
    price: "₹15,000",
    amount: 15000,
    period: "/ month",
    capacity: "1–3 people",
    area: "Shared Desk",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Flexible Seating", "High-speed Wi-Fi", "Cafeteria"],
  },
  {
    workspaceId: "7",
    name: "The CEO's Private Cabin",
    location: "Kondapur, Hyderabad",
    type: "PRIVATE OFFICE",
    price: "₹45,000",
    amount: 45000,
    period: "/ month",
    capacity: "3–6 people",
    area: "550 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Executive Cabin", "Premium Furniture", "Parking"],
  },
  {
    workspaceId: "8",
    name: "The Signature Meeting Lounge",
    location: "Hitech City, Hyderabad",
    type: "MEETING ROOM",
    price: "₹2,500",
    amount: 2500,
    period: "/ hour",
    capacity: "8–12 people",
    area: "450 sq.ft.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Smart Display", "Conference Table", "Air Conditioning"],
  },
  {
    workspaceId: "9",
    name: "The Elite Business Club",
    location: "Jubilee Hills, Hyderabad",
    type: "SHARED WORKSPACE",
    price: "₹25,000",
    amount: 25000,
    period: "/ month",
    capacity: "1–5 people",
    area: "Premium Shared Desk",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Premium Lounge", "Networking Area", "Cafeteria"],
  },
];

const seedWorkspaces = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB.");

    const existingCount = await Workspace.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Seeding skipped. ${existingCount} workspace(s) already exist.`
      );
      return;
    }

    await Workspace.insertMany(initialWorkspaces);

    console.log("Successfully added all 9 initial workspaces.");
  } catch (error) {
    console.error("Workspace seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedWorkspaces();
