"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Users, Zap, Bookmark, ArrowRight } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Real-time Collaboration",
      description: "Join rooms, code together, chat, and share ideas live using WebSockets.",
      icon: Users,
    },
    {
      title: "Problem Solving",
      description: "Browse problems, run code, and get instant feedback through Judge0 API.",
      icon: Code2,
    },
    {
      title: "Live Code Execution",
      description: "Run code in 60+ languages and view results instantly.",
      icon: Zap,
    },
    {
      title: "Bookmarks & Snippets",
      description: "Save code snippets, bookmark problems, and build your personal library.",
      icon: Bookmark,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white flex flex-col items-center px-4 md:px-12 py-16">
      {/* Animated Heading */}
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-rose-500 to-indigo-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to ZCoder
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="mt-6 text-lg text-center text-zinc-300 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Real-time collaborative coding, problem solving, and learning — all in one platform.
      </motion.p>

      {/* CTA Button with glowing animated border and arrow */}
      <motion.div
        className="mt-10 relative group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          size="lg"
          className="relative z-10 overflow-hidden px-8 py-4 bg-zinc-900 text-white rounded-2xl flex items-center gap-2 font-semibold
                     before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-transparent
                     before:animate-border before:bg-[linear-gradient(115deg,theme(colors.rose.500),theme(colors.indigo.500),theme(colors.rose.500))] 
                     before:bg-[length:200%_200%] before:z-[-1]"
        >
          <Link href="/auth">
           <span className="flex items-center gap-2">
          Get Started
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          </Link>
        </Button>
      </motion.div>

      {/* Features Section */}
      <section className="mt-24 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-700 hover:border-rose-400 transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <feature.icon className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-rose-400">{feature.title}</h3>
            </div>
            <p className="text-zinc-300">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
