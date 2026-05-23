export interface CommunityBuild {
  id: string;
  user: string;
  title: string;
  description: string;
  likes: number;
  layout: string;
  switches: string;
  keycaps: string;
  image: string;
}

export const communityBuilds: CommunityBuild[] = [
  { id: "b1", user: "MechMaster99", title: "Roxo Meia-noite", description: "Build em alumínio anodizado roxo escuro Tofu65 com switches Lavender e keycaps GMK Laser.", likes: 234, layout: "65%", switches: "Durock Lavender", keycaps: "GMK Laser", image: "🟣" },
  { id: "b2", user: "TypeWriter", title: "Jardim Botânico", description: "Build inspirada na natureza com PBT Botanical em um case de madeira.", likes: 189, layout: "75%", switches: "Holy Panda", keycaps: "PBT Botanical", image: "🌱" },
  { id: "b3", user: "ClickClack", title: "Terminal Retrô", description: "Build inspirada em IBM vintage com MT3 Susuwatari.", likes: 312, layout: "TKL", switches: "Box Jade", keycaps: "MT3 Susuwatari", image: "🖥️" },
  { id: "b4", user: "SilentTypist", title: "Modo Furtivo", description: "Build toda preta silenciosa com case amortecido e silent reds.", likes: 156, layout: "60%", switches: "Silent Red", keycaps: "ePBT Black", image: "⬛" },
  { id: "b5", user: "RGBFanatic", title: "Sonhos Neon", description: "Build full RGB com case transparente e keycaps pudding.", likes: 278, layout: "Full Size", switches: "Gateron Milky Yellow", keycaps: "Pudding", image: "🌈" },
  { id: "b6", user: "MinimalKeys", title: "Branco Limpo", description: "Setup minimalista todo branco com switches táteis silenciosos.", likes: 203, layout: "65%", switches: "Boba U4", keycaps: "ePBT White", image: "⚪" },
];