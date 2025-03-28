"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Appbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
     
      <header className="bg-gray-950 shadow-lg py-5 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-extrabold text-green-400 tracking-wide">
            CropConnect
          </Link>
          <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
            <Link href="/" className="hover:text-green-400 transition">Home</Link>
            <Link href="/market" className="hover:text-green-400 transition">Market</Link>
            <Link href="/contracts" className="hover:text-green-400 transition">Contracts</Link>
            <Link href="/advisory" className="hover:text-green-400 transition">AI Advisory</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-300">
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:inline">{user.name || "Profile"}</span>
                </button>
                <div className="absolute right-0 mt-2 bg-gray-800 shadow-lg rounded-md p-3 hidden group-hover:block">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => signIn()} 
                className="px-5 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

     
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-24 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-green-400 leading-tight">
            The Future of <span className="text-white">Agriculture</span> is Here
          </h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            A seamless digital platform empowering farmers with fair contract farming and AI-powered crop insights**.
          </p>
          <div className="mt-8">
            <Link href="/market">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-700 transition"
              >
                Explore Marketplace
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

     
      <section className="container mx-auto py-20">
        <h2 className="text-4xl font-bold text-center text-green-400">Why Choose CropConnect?</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "🌱 Direct Farmer-to-Buyer Trade", desc: "No middlemen, ensuring **fair pricing** and **maximum profits**." },
            { title: "📊 AI-Powered Insights", desc: "Smart recommendations based on **weather, soil, and demand trends**." },
            { title: "🔒 Secure Contracts", desc: "Pre-agreed contracts offer **income security** for farmers." }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-800 shadow-md rounded-xl border-t-4 border-green-500"
            >
              <h3 className="text-xl font-semibold text-green-400">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-400">What Farmers Say</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {[
              { name: "Raj Patel", feedback: "CropConnect helped me find the best buyers without any hassle!" },
              { name: "Ananya Verma", feedback: "The AI advisory boosted my crop yield by 20%! Incredible support." },
              { name: "Mohan Das", feedback: "Pre-agreed contracts ensure I get paid fairly, no middlemen involved." }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gray-700 shadow-md rounded-xl"
              >
                <p className="text-gray-300 italic">"{testimonial.feedback}"</p>
                <h3 className="text-lg font-semibold text-green-400 mt-3">— {testimonial.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-4xl font-bold text-green-400">Join CropConnect Today</h2>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          Start selling your crops directly to buyers, get AI-driven insights, and secure **fair contracts** today.
        </p>
        <div className="mt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-600 transition"
          >
            Get Started
          </motion.button>
        </div>
      </section>

     
      <footer className="bg-gray-950 text-gray-400 py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 CropConnect. All Rights Reserved.</p>
          <div className="mt-4 space-x-6">
            <Link href="/" className="hover:text-green-400 transition">Home</Link>
            <Link href="/market" className="hover:text-green-400 transition">Market</Link>
            <Link href="/contact" className="hover:text-green-400 transition">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
