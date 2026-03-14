export interface Listing {
  id: string;
  title: string;
  price: string;
  type: string;
  purpose: string;
  city: string;
  area: string;
  location: string;
  beds: number;
  baths: number;
  marla: string;
  propertyId: string;
  added: string;
  description: string;
  images: string[];
  features: { icon: string; label: string; count?: number }[];
}

export const LISTINGS_DATA: Record<string, Listing> = {
  "1": {
    id: "1", title: "5 Marla Brand New House For Rent In DHA Phase 5, Lahore",
    price: "85,000 / month", type: "House", purpose: "For Rent",
    city: "Lahore", area: "DHA Phase 5", location: "DHA Phase 5, Lahore, Punjab",
    beds: 3, baths: 2, marla: "5 Marla", propertyId: "RG-2024-00001",
    added: "2 hours ago",
    description: "Stunning brand new 5 Marla house in DHA Phase 5 Lahore. Modern architecture with high-quality fittings. Spacious rooms, beautiful kitchen, drawing room and well-maintained lawn.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 1 },{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" },{ icon: "security", label: "Security" },{ icon: "parking", label: "Parking" }],
  },
  "2": {
    id: "2", title: "2 Bed Luxury Apartment For Rent In Bahria Town, Karachi",
    price: "1,20,000 / month", type: "Apartment", purpose: "For Rent",
    city: "Karachi", area: "Bahria Town", location: "Bahria Town, Karachi, Sindh",
    beds: 2, baths: 2, marla: "950 Sqft", propertyId: "RG-2024-00002",
    added: "5 hours ago",
    description: "Luxury 2-bedroom apartment in Bahria Town Karachi. Modern finishes, stunning views, 24/7 security and electricity backup. Ideal for families and professionals.",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 1 },{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "balcony", label: "Balcony", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "internet", label: "Internet" },{ icon: "security", label: "Security" },{ icon: "generator", label: "Generator" }],
  },
  "3": {
    id: "3", title: "Cozy 1 Bed Flat For Rent In Gulshan-e-Iqbal, Karachi",
    price: "45,000 / month", type: "Flat", purpose: "For Rent",
    city: "Karachi", area: "Gulshan-e-Iqbal", location: "Gulshan-e-Iqbal, Karachi, Sindh",
    beds: 1, baths: 1, marla: "3 Marla", propertyId: "RG-2024-00003",
    added: "1 day ago",
    description: "Cozy and affordable 1-bedroom flat in the heart of Gulshan-e-Iqbal. Close to markets, schools, and public transport. Perfect for singles or small families.",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80","https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80"],
    features: [{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" }],
  },
  "4": {
    id: "4", title: "10 Marla Spacious House For Rent In F-7, Islamabad",
    price: "2,50,000 / month", type: "House", purpose: "For Rent",
    city: "Islamabad", area: "F-7", location: "F-7, Islamabad, ICT",
    beds: 5, baths: 4, marla: "10 Marla", propertyId: "RG-2024-00004",
    added: "3 hours ago",
    description: "Grand 10 Marla house in premium F-7 Islamabad. 5 spacious bedrooms, large drawing room, servant quarters and beautiful garden. Prime location near embassies.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80","https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 2 },{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "balcony", label: "Balcony", count: 2 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" },{ icon: "security", label: "Security" },{ icon: "parking", label: "Parking" },{ icon: "internet", label: "Internet" },{ icon: "generator", label: "Generator" }],
  },
  "5": {
    id: "5", title: "2 Bed Apartment For Rent In Model Town, Lahore",
    price: "65,000 / month", type: "Apartment", purpose: "For Rent",
    city: "Lahore", area: "Model Town", location: "Model Town, Lahore, Punjab",
    beds: 2, baths: 1, marla: "650 Sqft", propertyId: "RG-2024-00005",
    added: "Today",
    description: "Well-maintained 2-bedroom apartment in Model Town Lahore. Quiet neighbourhood with easy access to main city roads, shopping areas and restaurants.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 1 },{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" },{ icon: "parking", label: "Parking" }],
  },
  "6": {
    id: "6", title: "7 Marla House For Rent In G-11, Islamabad",
    price: "90,000 / month", type: "House", purpose: "For Rent",
    city: "Islamabad", area: "G-11", location: "G-11, Islamabad, ICT",
    beds: 4, baths: 3, marla: "7 Marla", propertyId: "RG-2024-00006",
    added: "2 days ago",
    description: "Beautiful 7 Marla house in the well-developed G-11 sector of Islamabad. 4 bedrooms, servant quarters, car porch and lawn. Ideal for families.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80","https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 1 },{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" },{ icon: "security", label: "Security" },{ icon: "parking", label: "Parking" }],
  },
  "7": {
    id: "7", title: "2 Marla Flat For Rent In Saddar, Rawalpindi",
    price: "30,000 / month", type: "Flat", purpose: "For Rent",
    city: "Rawalpindi", area: "Saddar", location: "Saddar, Rawalpindi, Punjab",
    beds: 1, baths: 1, marla: "2 Marla", propertyId: "RG-2024-00007",
    added: "Today",
    description: "Affordable 2 Marla flat in central Saddar Rawalpindi. Excellent location near markets, hospitals and transport hubs. Suitable for small families or professionals.",
    images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80","https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80"],
    features: [{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" }],
  },
  "8": {
    id: "8", title: "1 Kanal Luxury House For Rent In DHA Phase 2, Islamabad",
    price: "1,80,000 / month", type: "House", purpose: "For Rent",
    city: "Islamabad", area: "DHA Phase 2", location: "DHA Phase 2, Islamabad, ICT",
    beds: 6, baths: 5, marla: "1 Kanal", propertyId: "RG-2024-00008",
    added: "4 hours ago",
    description: "Ultra-luxury 1 Kanal house in DHA Phase 2 Islamabad. 6 bedrooms, home cinema, gym, servant quarters and full backup. The pinnacle of luxury living.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 2 },{ icon: "kitchen", label: "Kitchen", count: 2 },{ icon: "balcony", label: "Balcony", count: 3 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "gas", label: "Gas" },{ icon: "security", label: "Security" },{ icon: "parking", label: "Parking" },{ icon: "internet", label: "Internet" },{ icon: "generator", label: "Generator" }],
  },
  "9": {
    id: "9", title: "3 Bed Apartment For Rent In Clifton, Karachi",
    price: "55,000 / month", type: "Apartment", purpose: "For Rent",
    city: "Karachi", area: "Clifton", location: "Clifton, Karachi, Sindh",
    beds: 3, baths: 2, marla: "1100 Sqft", propertyId: "RG-2024-00009",
    added: "1 day ago",
    description: "Spacious 3-bedroom apartment in prestigious Clifton, Karachi. Sea-facing views, modern interiors, 24/7 security and backup power. Walking distance to beach.",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80","https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80"],
    features: [{ icon: "tv", label: "TV Lounge", count: 1 },{ icon: "kitchen", label: "Kitchen", count: 1 },{ icon: "balcony", label: "Balcony", count: 1 },{ icon: "electricity", label: "Electricity" },{ icon: "water", label: "Water Supply" },{ icon: "internet", label: "Internet" },{ icon: "security", label: "Security" },{ icon: "generator", label: "Generator" }],
  },
};

export function getListingById(id: string): Listing | null {
  return LISTINGS_DATA[id] ?? null;
}