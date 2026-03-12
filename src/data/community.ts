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
  { id: "b1", user: "MechMaster99", title: "Midnight Purple", description: "Deep purple anodized Tofu65 with Lavender switches and GMK Laser keycaps.", likes: 234, layout: "65%", switches: "Durock Lavender", keycaps: "GMK Laser", image: "🟣" },
  { id: "b2", user: "TypeWriter", title: "Botanical Garden", description: "Nature-inspired build with PBT Botanical on a wooden case.", likes: 189, layout: "75%", switches: "Holy Panda", keycaps: "PBT Botanical", image: "🌱" },
  { id: "b3", user: "ClickClack", title: "Retro Terminal", description: "Vintage IBM-inspired build with MT3 Susuwatari.", likes: 312, layout: "TKL", switches: "Box Jade", keycaps: "MT3 Susuwatari", image: "🖥️" },
  { id: "b4", user: "SilentTypist", title: "Stealth Mode", description: "All-black silent build with dampened case and silent reds.", likes: 156, layout: "60%", switches: "Silent Red", keycaps: "ePBT Black", image: "⬛" },
  { id: "b5", user: "RGBFanatic", title: "Neon Dreams", description: "Full RGB build with transparent case and pudding keycaps.", likes: 278, layout: "Full Size", switches: "Gateron Milky Yellow", keycaps: "Pudding", image: "🌈" },
  { id: "b6", user: "MinimalKeys", title: "Clean White", description: "Minimalist all-white setup with silent tactile switches.", likes: 203, layout: "65%", switches: "Boba U4", keycaps: "ePBT White", image: "⚪" },
];
