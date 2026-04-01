export type ComponentCategory = "switch" | "keycap" | "pcb" | "case";
export type SwitchType = "MX" | "Low Profile" | "Optical";
export type LayoutSize = "60%" | "65%" | "75%" | "TKL" | "Full";

export interface CaseColor {
  id: string;
  name: string;
  hex: string;
}

export interface BuilderProduct {
  id: string;
  name: string;
  category: ComponentCategory;
  type: SwitchType;
  layout: LayoutSize | null;
  price: number;
  image: string;
  description: string;
  /** Only for cases */
  supportedLayouts?: LayoutSize[];
  colors?: CaseColor[];
}

const standardColors: CaseColor[] = [
  { id: "black", name: "Preto", hex: "#1a1a1a" },
  { id: "silver", name: "Prata", hex: "#a0a0a0" },
  { id: "white", name: "Branco", hex: "#e8e8e8" },
  { id: "navy", name: "Azul Marinho", hex: "#1e3a5f" },
  { id: "burgundy", name: "Bordô", hex: "#6b1d1d" },
];

const slimColors: CaseColor[] = [
  { id: "white", name: "Branco", hex: "#e8e8e8" },
  { id: "silver", name: "Prata", hex: "#c0c0c0" },
  { id: "space-gray", name: "Cinza Espacial", hex: "#4a4a4a" },
  { id: "rose", name: "Rosé", hex: "#b76e79" },
  { id: "midnight", name: "Meia-noite", hex: "#1c1c2e" },
];

export const builderProducts: BuilderProduct[] = [
  // Switches
  { id: "sw-mx-gateron", name: "Gateron Oil King (Linear)", category: "switch", type: "MX", layout: null, price: 32.99, image: "🔴", description: "Ultra-smooth MX linear switches with factory lube." },
  { id: "sw-mx-cherry", name: "Cherry MX Blue (Clicky)", category: "switch", type: "MX", layout: null, price: 28.99, image: "🔵", description: "Classic MX clicky switches with tactile bump." },
  { id: "sw-mx-holy", name: "Holy Panda (Tactile)", category: "switch", type: "MX", layout: null, price: 45.99, image: "🟤", description: "Premium MX tactile switches with rounded bump." },
  { id: "sw-lp-cherry", name: "Cherry MX Low Profile Red", category: "switch", type: "Low Profile", layout: null, price: 34.99, image: "🟠", description: "Low profile linear switch for slim builds." },
  { id: "sw-opt-razer", name: "Razer Optical Red", category: "switch", type: "Optical", layout: null, price: 38.99, image: "🟡", description: "Optical actuation for ultra-fast response." },

  // Keycaps
  { id: "kc-mx-laser", name: "GMK Laser Keycaps", category: "keycap", type: "MX", layout: "Full", price: 129.99, image: "🎨", description: "Double-shot ABS MX keycaps. Full layout coverage." },
  { id: "kc-mx-botanical", name: "PBT Botanical Keycaps", category: "keycap", type: "MX", layout: "TKL", price: 69.99, image: "🌿", description: "Dye-sub PBT MX keycaps. Covers up to TKL." },
  { id: "kc-mx-retro", name: "MT3 Susuwatari Keycaps", category: "keycap", type: "MX", layout: "65%", price: 89.99, image: "⬛", description: "High-profile MX keycaps for 60%/65% boards." },
  { id: "kc-lp-white", name: "Low Profile White Keycaps", category: "keycap", type: "Low Profile", layout: "75%", price: 49.99, image: "⚪", description: "Slim keycaps for low profile switches up to 75%." },
  { id: "kc-mx-minimal", name: "Minimal Black MX Keycaps", category: "keycap", type: "MX", layout: "75%", price: 59.99, image: "⬜", description: "Clean black MX keycaps. Covers up to 75%." },

  // PCBs
  { id: "pcb-mx-60", name: "DZ60 RGB PCB", category: "pcb", type: "MX", layout: "60%", price: 55.00, image: "🔧", description: "Hot-swap MX PCB for 60% builds with RGB." },
  { id: "pcb-mx-65", name: "KBD67 Lite PCB", category: "pcb", type: "MX", layout: "65%", price: 65.00, image: "🔧", description: "Hot-swap MX PCB for 65% builds." },
  { id: "pcb-mx-75", name: "Feker IK75 PCB", category: "pcb", type: "MX", layout: "75%", price: 70.00, image: "🔧", description: "MX hot-swap PCB for 75% builds with knob." },
  { id: "pcb-mx-tkl", name: "Keychron Q3 PCB", category: "pcb", type: "MX", layout: "TKL", price: 80.00, image: "🔧", description: "MX hot-swap PCB for TKL builds." },
  { id: "pcb-lp-75", name: "Nuphy Air75 PCB", category: "pcb", type: "Low Profile", layout: "75%", price: 60.00, image: "🔧", description: "Low profile hot-swap PCB, 75% layout." },

  // Cases — now with supportedLayouts and colors
  { id: "cs-60-alu", name: "Tofu60 Aluminum Case", category: "case", type: "MX", layout: "60%", price: 99.99, image: "🔲", description: "CNC aluminum case for 60% PCBs.", supportedLayouts: ["60%"], colors: standardColors },
  { id: "cs-65-alu", name: "Tofu65 Aluminum Case", category: "case", type: "MX", layout: "65%", price: 119.99, image: "🔲", description: "CNC aluminum case for 65% PCBs.", supportedLayouts: ["65%"], colors: standardColors },
  { id: "cs-75-alu", name: "GMMK Pro Case (75%)", category: "case", type: "MX", layout: "75%", price: 139.99, image: "🔲", description: "Gasket-mount aluminum case for 75% PCBs.", supportedLayouts: ["75%"], colors: standardColors },
  { id: "cs-tkl-poly", name: "Bakeneko TKL Case", category: "case", type: "MX", layout: "TKL", price: 89.99, image: "📦", description: "O-ring gasket mount case for TKL PCBs.", supportedLayouts: ["TKL"], colors: standardColors },
  { id: "cs-lp-75", name: "Nuphy Air75 Case", category: "case", type: "Low Profile", layout: "75%", price: 69.99, image: "📦", description: "Slim case for low profile 75% PCBs.", supportedLayouts: ["75%"], colors: slimColors },
];
