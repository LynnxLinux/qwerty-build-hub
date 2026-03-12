import { motion } from "framer-motion";
import { Keyboard, Heart, Zap, Globe } from "lucide-react";

const values = [
  { icon: Keyboard, title: "Craft", desc: "Every keyboard is a unique expression of its creator." },
  { icon: Heart, title: "Passion", desc: "Built by enthusiasts, for enthusiasts." },
  { icon: Zap, title: "Innovation", desc: "Pushing the boundaries of keyboard technology." },
  { icon: Globe, title: "Community", desc: "A global network of keyboard lovers." },
];

const AboutPage = () => (
  <div className="container mx-auto px-4 py-12">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
        Helping You Build Your<br />
        <span className="text-gradient-primary">Dream Keyboard</span>
      </h1>
      <p className="text-lg text-foreground leading-relaxed">
        Qwerty was founded with a simple mission: make the complex process of custom keyboard building accessible, visual, and satisfying for everyone — from first-timers to seasoned enthusiasts.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
      {values.map((v, i) => (
        <motion.div
          key={v.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-card rounded-lg shadow-card p-6"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            <v.icon className="h-5 w-5" />
          </div>
          <h3 className="font-semibold mb-2">{v.title}</h3>
          <p className="text-sm text-foreground">{v.desc}</p>
        </motion.div>
      ))}
    </div>

    <div className="glass rounded-lg p-12 text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Our Story</h2>
      <p className="text-foreground leading-relaxed">
        What started as a side project by a group of keyboard enthusiasts has grown into a platform used by thousands of builders worldwide. We believe that the perfect keyboard isn't something you buy — it's something you create. Every switch, every keycap, every detail matters. That's why we built Qwerty: to give you the tools to make it yours.
      </p>
    </div>
  </div>
);

export default AboutPage;
