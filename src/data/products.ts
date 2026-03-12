export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  brand: string;
  image: string;
  description: string;
}

export const products: Product[] = [
  { id: "sw-1", name: "Gateron Oil King (Linear)", price: 32.99, rating: 4.8, category: "Switches", brand: "Gateron", image: "🔴", description: "Ultra-smooth linear switches with factory lube." },
  { id: "sw-2", name: "Cherry MX Blue (Clicky)", price: 28.99, rating: 4.5, category: "Switches", brand: "Cherry", image: "🔵", description: "Classic clicky switches with tactile bump." },
  { id: "sw-3", name: "Holy Panda (Tactile)", price: 45.99, rating: 4.9, category: "Switches", brand: "Drop", image: "🟤", description: "Premium tactile switches with rounded bump." },
  { id: "kc-1", name: "GMK Laser Keycaps", price: 129.99, rating: 4.9, category: "Keycaps", brand: "GMK", image: "🎨", description: "Double-shot ABS keycaps in iconic Laser colorway." },
  { id: "kc-2", name: "PBT Botanical Keycaps", price: 69.99, rating: 4.7, category: "Keycaps", brand: "Infinikey", image: "🌿", description: "Dye-sub PBT keycaps with botanical theme." },
  { id: "kc-3", name: "MT3 Susuwatari Keycaps", price: 89.99, rating: 4.6, category: "Keycaps", brand: "Drop", image: "⬛", description: "High-profile sculpted keycaps with retro style." },
  { id: "cs-1", name: "Tofu65 Aluminum Case", price: 119.99, rating: 4.7, category: "Cases", brand: "KBDFans", image: "🔲", description: "CNC machined aluminum case for 65% boards." },
  { id: "cs-2", name: "Bakeneko60 Case", price: 89.99, rating: 4.6, category: "Cases", brand: "CannonKeys", image: "📦", description: "O-ring gasket mount 60% case." },
  { id: "cb-1", name: "Custom Coiled USB-C Cable", price: 49.99, rating: 4.8, category: "Cables", brand: "CruzCtrl", image: "🔌", description: "Handmade coiled cable with aviator connector." },
  { id: "cb-2", name: "Straight USB-C Cable", price: 19.99, rating: 4.4, category: "Cables", brand: "Mechcables", image: "➰", description: "Braided straight cable in custom colors." },
  { id: "ac-1", name: "Switch Tester (72 switches)", price: 39.99, rating: 4.5, category: "Accessories", brand: "KPRepublic", image: "🧪", description: "Try 72 different switches before you buy." },
  { id: "ac-2", name: "Keyboard Carrying Case", price: 34.99, rating: 4.3, category: "Accessories", brand: "KBDFans", image: "💼", description: "Padded carrying case for 65% keyboards." },
];

export const categories = ["All", "Switches", "Keycaps", "Cases", "Cables", "Accessories"];
export const brands = ["All", "Gateron", "Cherry", "Drop", "GMK", "Infinikey", "KBDFans", "CannonKeys", "CruzCtrl", "Mechcables", "KPRepublic"];
