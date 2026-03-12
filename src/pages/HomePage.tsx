import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Palette, Users } from "lucide-react";
import heroImage from "@/assets/hero-keyboard.jpg";

const spring = { type: "spring" as const, stiffness: 300, damping: 25, mass: 0.5 };

const featuredBuilds = [
  { title: "Midnight Purple", layout: "65%", price: "$287.49", emoji: "🟣" },
  { title: "Arctic White", layout: "TKL", price: "$312.99", emoji: "⚪" },
  { title: "Neon Dreams", layout: "75%", price: "$259.99", emoji: "🌈" },
];

const popularProducts = [
  { name: "Gateron Oil King", price: "$32.99", category: "Switches", emoji: "🔴" },
  { name: "GMK Laser Keycaps", price: "$129.99", category: "Keycaps", emoji: "🎨" },
  { name: "Coiled USB-C Cable", price: "$49.99", category: "Cables", emoji: "🔌" },
  { name: "Tofu65 Case", price: "$119.99", category: "Cases", emoji: "🔲" },
];

const reasons = [
  { icon: Palette, title: "Full Customization", desc: "Choose every component from layout to keycaps." },
  { icon: Zap, title: "Live Preview", desc: "See your keyboard update in real-time as you build." },
  { icon: Shield, title: "Quality Parts", desc: "Only premium switches, cases, and keycaps." },
  { icon: Users, title: "Community", desc: "Share builds and get inspired by others." },
];

const HomePage = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Custom mechanical keyboard" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>
      <div className="relative container mx-auto px-4 py-32 md:py-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
            Monte o seu teclado<br />
            <span className="text-gradient-primary">Perfeito.</span>
          </h1>
          <p className="text-lg text-foreground max-w-lg mb-8">
            Design and build your dream mechanical keyboard with our interactive builder. Choose every component, preview in real-time, and order with one click.
          </p>
          <div className="flex gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-button transition-colors hover:bg-primary/90"
              >
                Start Building <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-foreground-strong font-semibold rounded-md border border-border transition-colors hover:bg-accent/80"
              >
                Browse Parts
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Featured Builds */}
    <section className="container mx-auto px-4 py-24">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Builds</h2>
      <p className="text-foreground mb-10">Handpicked custom keyboards from our community.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredBuilds.map((build, i) => (
          <motion.div
            key={build.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-lg shadow-card overflow-hidden group cursor-pointer"
          >
            <div className="h-48 bg-accent flex items-center justify-center text-6xl">
              {build.emoji}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">{build.title}</h3>
              <div className="flex justify-between text-sm text-foreground">
                <span>{build.layout}</span>
                <span className="text-primary font-semibold tabular-nums">{build.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Popular Products */}
    <section className="container mx-auto px-4 py-24">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Popular Products</h2>
      <p className="text-foreground mb-10">Top-rated parts loved by the community.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularProducts.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-card rounded-lg shadow-card p-5 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="text-4xl mb-3">{p.emoji}</div>
            <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
            <p className="text-primary font-semibold text-sm tabular-nums">{p.price}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Why Qwerty */}
    <section className="container mx-auto px-4 py-24">
      <h2 className="text-3xl font-bold tracking-tight text-center mb-2">Why Choose Qwerty</h2>
      <p className="text-foreground text-center mb-12">Everything you need to build your perfect keyboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="text-center p-6"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4">
              <r.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">{r.title}</h3>
            <p className="text-sm text-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Community CTA */}
    <section className="container mx-auto px-4 py-24">
      <div className="glass rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Join the Community</h2>
        <p className="text-foreground max-w-md mx-auto mb-8">
          Share your builds, get feedback, and discover inspiration from keyboard enthusiasts worldwide.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring} className="inline-block">
          <Link to="/community" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-button">
            Explore Builds <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default HomePage;
