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
  { id: "sw-1", name: "Gateron Oil King (Linear)", price: 32.99, rating: 4.8, category: "Switches", brand: "Gateron", image: "🔴", description: "Switches lineares ultra suaves com lubrificação de fábrica." },
  { id: "sw-2", name: "Cherry MX Blue (Clicky)", price: 28.99, rating: 4.5, category: "Switches", brand: "Cherry", image: "🔵", description: "Switches clicky clássicos com retorno tátil." },
  { id: "sw-3", name: "Holy Panda (Táctil)", price: 45.99, rating: 4.9, category: "Switches", brand: "Drop", image: "🟤", description: "Switches táteis premium com bump arredondado." },

  { id: "kc-1", name: "Keycaps GMK Laser", price: 129.99, rating: 4.9, category: "Keycaps", brand: "GMK", image: "🎨", description: "Keycaps ABS double-shot com icônico tema Laser." },
  { id: "kc-2", name: "Keycaps PBT Botanical", price: 69.99, rating: 4.7, category: "Keycaps", brand: "Infinikey", image: "🌿", description: "Keycaps PBT dye-sub com tema botânico." },
  { id: "kc-3", name: "Keycaps MT3 Susuwatari", price: 89.99, rating: 4.6, category: "Keycaps", brand: "Drop", image: "⬛", description: "Keycaps esculpidos de perfil alto com estilo retrô." },

  { id: "cs-1", name: "Case de Alumínio Tofu65", price: 119.99, rating: 4.7, category: "Cases", brand: "KBDFans", image: "🔲", description: "Case de alumínio CNC para teclados 65%." },
  { id: "cs-2", name: "Case Bakeneko60", price: 89.99, rating: 4.6, category: "Cases", brand: "CannonKeys", image: "📦", description: "Case 60% com montagem gasket o-ring." },

  { id: "cb-1", name: "Cabo USB-C Coiled Personalizado", price: 49.99, rating: 4.8, category: "Cables", brand: "CruzCtrl", image: "🔌", description: "Cabo coiled artesanal com conector aviador." },
  { id: "cb-2", name: "Cabo USB-C Reto", price: 19.99, rating: 4.4, category: "Cables", brand: "Mechcables", image: "➰", description: "Cabo trançado reto em cores personalizadas." },

  { id: "ac-1", name: "Testador de Switches (72 switches)", price: 39.99, rating: 4.5, category: "Accessories", brand: "KPRepublic", image: "🧪", description: "Teste 72 switches diferentes antes de comprar." },
  { id: "ac-2", name: "Case de Transporte para Teclado", price: 34.99, rating: 4.3, category: "Accessories", brand: "KBDFans", image: "💼", description: "Case acolchoado para teclados 65%." },
];

export const categories = ["All", "Switches", "Keycaps", "Cases", "Cables", "Accessories"];
export const brands = ["All", "Gateron", "Cherry", "Drop", "GMK", "Infinikey", "KBDFans", "CannonKeys", "CruzCtrl", "Mechcables", "KPRepublic"];
