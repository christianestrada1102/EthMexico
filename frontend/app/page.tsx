"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Wallet, ArrowRight, Zap, Lock, DollarSign, Sparkles } from "lucide-react";
import { WalletModal } from "@/components/WalletModal";
import { useWalletStore } from "@/store/walletStore";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

// Floating particles component for blockchain effect
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const x = useMotionValue(Math.random() * 100);
  const y = useMotionValue(Math.random() * 100);
  const opacity = useSpring(useMotionValue(0.3), { stiffness: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      x.set(Math.random() * 100);
      y.set(Math.random() * 100);
    }, 3000 + delay * 1000);

    return () => clearInterval(interval);
  }, [x, y, delay]);

  return (
    <motion.div
      style={{
        x: useTransform(x, (value) => `${value}%`),
        y: useTransform(y, (value) => `${value}%`),
        opacity,
      }}
      className="absolute w-1 h-1 bg-arbitrum-cyan rounded-full blur-sm"
      animate={{
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 2 + delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Animated connection lines between L1 and L2
const ConnectionLine = () => {
  return (
    <motion.svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
      viewBox="0 0 800 200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ delay: 1 }}
    >
      <motion.path
        d="M 100 100 Q 400 50 700 100"
        stroke="url(#gradient)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#28A0F0" stopOpacity="0" />
          <stop offset="50%" stopColor="#00E0FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#28A0F0" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const isConnected = useWalletStore((state) => state.isConnected);
  const theme = useWalletStore((state) => state.theme);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax effect for hero content
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 15,
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const features = [
    {
      icon: Zap,
      title: "Instantáneo",
      description: "Recibe tus fondos inmediatamente sin esperar",
      gradient: "from-yellow-400/20 to-orange-500/20",
      iconColor: "text-yellow-400",
    },
    {
      icon: Lock,
      title: "Seguro",
      description: "Sistema de bonds y validaciones robustas",
      gradient: "from-green-400/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: DollarSign,
      title: "Comisiones Justas",
      description: "Comisión del 1% para retiros rápidos",
      gradient: "from-arbitrum-cyan/20 to-arbitrum-blue/20",
      iconColor: "text-arbitrum-cyan",
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Settarb Animated Background */}
      <AnimatedBackground />
      
      {/* Enhanced animated background with gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-arbitrum-blue/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-arbitrum-cyan/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}

        {/* Connection lines */}
        <ConnectionLine />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(40, 160, 240, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(40, 160, 240, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-5xl w-full text-center relative z-10">
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Powered by Arbitrum Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-arbitrum-cyan"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm text-arbitrum-cyan font-medium">
              Powered by Arbitrum
            </span>
          </motion.div>

          {/* Main icon with enhanced glow */}
          <motion.div
            className="inline-flex items-center justify-center mb-10 relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-arbitrum-blue/30 rounded-3xl blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue p-1 shadow-2xl">
              <div className="w-full h-full rounded-3xl bg-arbitrum-navy/90 flex items-center justify-center backdrop-blur-sm border border-arbitrum-cyan/30">
                <Wallet className="w-14 h-14 text-arbitrum-cyan drop-shadow-lg" />
              </div>
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-6 h-6 text-arbitrum-cyan" />
            </motion.div>
          </motion.div>

          {/* Title with enhanced shimmer */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 relative"
          >
            <span className="bg-gradient-to-r from-white via-arbitrum-blue to-arbitrum-cyan bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite] drop-shadow-2xl font-display">
              Settarb
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-arbitrum-blue/0 via-arbitrum-cyan/30 to-arbitrum-blue/0 blur-xl"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-gray-200 mb-3 font-medium tracking-tight"
          >
            Sistema de Retiros Rápidos y Liquidez L2→L1
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            Retira tus fondos de Arbitrum a Ethereum en segundos, no en días. Proveedores de liquidez adelantan tus fondos instantáneamente.
          </motion.p>

          {/* Enhanced CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 60px rgba(40, 160, 240, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="group relative inline-flex items-center gap-4 px-10 py-6 rounded-2xl overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-arbitrum-blue via-arbitrum-cyan to-arbitrum-blue"
                animate={{
                  backgroundPosition: ["0%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 100%" }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-arbitrum-cyan/50 blur-xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10 text-white font-bold text-lg flex items-center gap-3">
                <Wallet className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Conectar Wallet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          {/* Enhanced feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    borderColor: "rgba(40, 160, 240, 0.5)",
                  }}
                  className="relative group p-8 rounded-3xl glass-glow border border-arbitrum-blue/30 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  {/* Icon */}
                  <motion.div
                    className="relative z-10 mb-4"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-arbitrum-navy/50 border border-arbitrum-blue/30">
                      <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                  </motion.div>
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

