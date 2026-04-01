import { motion } from "framer-motion";
import type { BuilderProduct, LayoutSize } from "@/data/builderProducts";

interface KeyboardPreviewProps {
  selectedLayout: LayoutSize;
  selectedCase: BuilderProduct | null;
  selectedKeycap: BuilderProduct | null;
  selectedSwitch: BuilderProduct | null;
  selectedPcb: BuilderProduct | null;
  caseColor: string; // hex
}

const keycapColorMap: Record<string, { base: string; accent: string }> = {
  "kc-mx-laser": { base: "#2d1b69", accent: "#e94560" },
  "kc-mx-botanical": { base: "#2d4a3e", accent: "#8fb996" },
  "kc-mx-retro": { base: "#1a1a2e", accent: "#4a4a4a" },
  "kc-lp-white": { base: "#e8e8e8", accent: "#ffffff" },
  "kc-mx-minimal": { base: "#1a1a1a", accent: "#333333" },
};

const layoutKeyCount: Record<string, number> = {
  "60%": 61, "65%": 68, "75%": 84, "TKL": 87, "Full": 104,
};

/* Row definitions per layout */
const baseRows = [
  { keys: ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"], widths: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2] },
  { keys: ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"], widths: [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5] },
  { keys: ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"], widths: [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25] },
  { keys: ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"], widths: [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75] },
  { keys: ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Menu", "Ctrl"], widths: [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25] },
];

/* F-row for 75% and TKL */
const fRow = {
  keys: ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  widths: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

function getRowsForLayout(layout: LayoutSize) {
  if (layout === "75%" || layout === "TKL" || layout === "Full") {
    return [fRow, ...baseRows];
  }
  return baseRows; // 60%, 65%
}

const KeyboardPreview = ({ selectedLayout, selectedCase, selectedKeycap, selectedSwitch, selectedPcb, caseColor }: KeyboardPreviewProps) => {
  const kcColors = selectedKeycap ? keycapColorMap[selectedKeycap.id] : null;
  const keycapBase = kcColors?.base ?? "#3a3a4a";
  const keycapAccent = kcColors?.accent ?? "#555";
  const keyCount = layoutKeyCount[selectedLayout] ?? 68;
  const rows = getRowsForLayout(selectedLayout);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Layout label */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Layout</span>
        <span className="text-sm font-bold" style={{ color: "hsl(var(--foreground-strong))" }}>{selectedLayout}</span>
        <span className="text-xs text-muted-foreground">({keyCount} teclas)</span>
      </div>

      {/* Keyboard body */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative rounded-2xl p-4 shadow-2xl"
        style={{ backgroundColor: caseColor, boxShadow: `0 20px 60px -10px ${caseColor}55, 0 0 0 1px hsl(215 28% 17%)` }}
      >
        <div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: `${caseColor}cc` }}>
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.keys.map((key, ki) => {
                const w = row.widths[ki];
                const isAccent = key === "Esc" || key === "Enter" || key === "Space";
                const isDark = selectedKeycap?.id === "kc-lp-white";
                return (
                  <motion.div
                    key={`${ri}-${ki}`}
                    whileHover={{ y: -2, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center justify-center rounded-md text-[9px] font-medium cursor-default select-none border border-white/5"
                    style={{
                      width: `${w * 2.4}rem`,
                      height: "2.2rem",
                      backgroundColor: isAccent ? keycapAccent : keycapBase,
                      color: isDark ? "#555" : "#ddd",
                      boxShadow: `0 2px 0 1px ${isAccent ? keycapAccent : keycapBase}88, 0 4px 8px -2px rgba(0,0,0,0.4)`,
                    }}
                  >
                    {w >= 1.5 || key.length <= 3 ? key : ""}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Status pills */}
      <div className="flex flex-wrap justify-center gap-2 text-[10px]">
        {selectedSwitch && (
          <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
            {selectedSwitch.name}
          </span>
        )}
        {selectedKeycap && (
          <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/20">
            {selectedKeycap.name}
          </span>
        )}
        {selectedPcb && (
          <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground border border-border">
            {selectedPcb.name}
          </span>
        )}
        {selectedCase && (
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
            {selectedCase.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default KeyboardPreview;
