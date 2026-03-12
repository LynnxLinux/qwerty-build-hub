import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const spring = { type: "spring" as const, stiffness: 300, damping: 25, mass: 0.5 };

const layouts = [
  { id: "60", label: "60%", price: 0, keys: "61 keys" },
  { id: "65", label: "65%", price: 15, keys: "68 keys" },
  { id: "tkl", label: "TKL", price: 30, keys: "87 keys" },
  { id: "full", label: "Full Size", price: 45, keys: "104 keys" },
];

const switches = [
  { id: "linear", label: "Linear", desc: "Smooth, no bump", price: 32, color: "bg-red-500" },
  { id: "tactile", label: "Tactile", desc: "Noticeable bump", price: 38, color: "bg-amber-600" },
  { id: "clicky", label: "Clicky", desc: "Bump + click sound", price: 28, color: "bg-blue-500" },
];

const keycapStyles = [
  { id: "minimal", label: "Minimal White", price: 49, emoji: "⚪" },
  { id: "retro", label: "Retro Terminal", price: 69, emoji: "🖥️" },
  { id: "laser", label: "Laser Purple", price: 89, emoji: "🟣" },
  { id: "botanical", label: "Botanical", price: 79, emoji: "🌿" },
];

const caseColors = [
  { id: "black", label: "Matte Black", hex: "#1a1a2e" },
  { id: "silver", label: "Silver", hex: "#94a3b8" },
  { id: "navy", label: "Navy Blue", hex: "#1e3a5f" },
  { id: "purple", label: "Deep Purple", hex: "#4c1d95" },
];

const rgbOptions = [
  { id: "none", label: "None", price: 0 },
  { id: "white", label: "White", price: 15 },
  { id: "rgb", label: "Full RGB", price: 30 },
];

const cableOptions = [
  { id: "straight", label: "Straight USB-C", price: 19 },
  { id: "coiled", label: "Coiled USB-C", price: 49 },
];

const BuilderPage = () => {
  const { addItem } = useCart();
  const [layout, setLayout] = useState("65");
  const [switchType, setSwitchType] = useState("linear");
  const [keycap, setKeycap] = useState("minimal");
  const [caseColor, setCaseColor] = useState("black");
  const [rgb, setRgb] = useState("none");
  const [cable, setCable] = useState("straight");

  const totalPrice = useMemo(() => {
    const base = 89.99;
    const l = layouts.find((x) => x.id === layout)!.price;
    const s = switches.find((x) => x.id === switchType)!.price;
    const k = keycapStyles.find((x) => x.id === keycap)!.price;
    const r = rgbOptions.find((x) => x.id === rgb)!.price;
    const c = cableOptions.find((x) => x.id === cable)!.price;
    return base + l + s + k + r + c;
  }, [layout, switchType, keycap, rgb, cable]);

  const handleAddToCart = () => {
    const selectedKeycap = keycapStyles.find((x) => x.id === keycap)!;
    const selectedLayout = layouts.find((x) => x.id === layout)!;
    addItem({
      id: `build-${Date.now()}`,
      name: `Custom ${selectedLayout.label} - ${selectedKeycap.label}`,
      price: totalPrice,
      image: selectedKeycap.emoji,
    });
    toast.success("Build added to cart!");
  };

  const selectedCase = caseColors.find((x) => x.id === caseColor)!;
  const selectedKeycapStyle = keycapStyles.find((x) => x.id === keycap)!;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Keyboard Builder</h1>
        <p className="text-foreground mb-10">Configure every detail. Preview in real-time.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="glass rounded-lg p-8 sticky top-24">
            <div
              className="rounded-lg p-8 flex items-center justify-center min-h-[320px] transition-colors duration-300"
              style={{ backgroundColor: selectedCase.hex }}
            >
              <div className="text-center">
                <div className="text-8xl mb-4">{selectedKeycapStyle.emoji}</div>
                <p className="text-foreground-strong text-lg font-semibold">
                  {layouts.find((x) => x.id === layout)!.label} Layout
                </p>
                <p className="text-foreground text-sm">
                  {switches.find((x) => x.id === switchType)!.label} • {selectedKeycapStyle.label} • {selectedCase.label}
                </p>
                {rgb !== "none" && (
                  <div className="mt-3 text-xs text-primary font-medium uppercase tracking-widest">
                    ✦ {rgbOptions.find((x) => x.id === rgb)!.label} Lighting
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <div>
                <p className="text-sm text-foreground">Total Price</p>
                <p className="text-3xl font-bold text-foreground-strong tabular-nums">${totalPrice.toFixed(2)}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                onClick={handleAddToCart}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-button"
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Layout */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">Layout</h3>
            <div className="grid grid-cols-2 gap-2">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={`p-3 rounded-md text-sm font-medium transition-all ${
                    layout === l.id ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  {l.label}
                  <span className="block text-xs opacity-70">{l.keys}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switches */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">Switches</h3>
            <div className="space-y-2">
              {switches.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSwitchType(s.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-all ${
                    switchType === s.id ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${s.color}`} />
                  <div className="text-left">
                    <div>{s.label}</div>
                    <div className="text-xs opacity-70">{s.desc}</div>
                  </div>
                  <span className="ml-auto text-xs tabular-nums">${s.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Keycaps */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">Keycaps</h3>
            <div className="grid grid-cols-2 gap-2">
              {keycapStyles.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setKeycap(k.id)}
                  className={`p-3 rounded-md text-sm font-medium transition-all ${
                    keycap === k.id ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  <span className="text-2xl block mb-1">{k.emoji}</span>
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          {/* Case Color */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">Case Color</h3>
            <div className="flex gap-3">
              {caseColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCaseColor(c.id)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    caseColor === c.id ? "border-primary scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* RGB */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">RGB Lighting</h3>
            <div className="flex gap-2">
              {rgbOptions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRgb(r.id)}
                  className={`flex-1 p-3 rounded-md text-sm font-medium transition-all ${
                    rgb === r.id ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cable */}
          <div className="bg-card rounded-lg shadow-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-3">Cable</h3>
            <div className="space-y-2">
              {cableOptions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCable(c.id)}
                  className={`w-full flex justify-between p-3 rounded-md text-sm font-medium transition-all ${
                    cable === c.id ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  {c.label}
                  <span className="tabular-nums">${c.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
