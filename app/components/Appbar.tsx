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
      {/* Header */}
      <header className="bg-gray-950 bg-opacity-80 backdrop-blur-md shadow-xl py-4 px-6 sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-xl"
          >
            CropConnect
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
            {["Home", "Market", "Contracts", "Advisory"].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.1, y: -3 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Link href={`/${item.toLowerCase()}`} className="hover:text-green-400 transition-all duration-300">
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* User Authentication */}
          <div className="relative flex items-center space-x-4">
            {user ? (
              <motion.div className="relative group" whileHover={{ scale: 1.05 }}>
                <button className="flex items-center space-x-2 text-gray-300 focus:outline-none">
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:inline">{user.name || "Profile"}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-xl rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700 rounded-lg">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-700 rounded-lg">
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0px 4px 15px rgba(34, 255, 34, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn()}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 shadow-xl transition"
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="container mx-auto">
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-xl">
            The Future of <span className="text-white">Agriculture</span> is Here
          </h1>
          <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
            A seamless digital platform empowering farmers with fair contract farming and AI-powered crop insights.
          </p>
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0px 4px 15px rgba(34, 255, 34, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-10 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-700 transition"
          >
            <Link href="/market">Explore Marketplace</Link>
          </motion.button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-4xl font-bold text-green-400">Why Choose CropConnect?</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "🌱 Direct Trade", desc: "No middlemen, fair pricing." },
            { title: "📊 AI Insights", desc: "Smart recommendations." },
            { title: "🔒 Secure Contracts", desc: "Guaranteed payments." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(34, 255, 34, 0.2)" }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 bg-gray-800 shadow-xl rounded-3xl border-t-4 border-green-500 transform hover:shadow-green-500/25 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-green-400">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 CropConnect. All Rights Reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            {["Home", "Market", "Contact Us"].map((item) => (
              <motion.div key={item} whileHover={{ scale: 1.1, y: -3 }} transition={{ type: "spring", stiffness: 200 }}>
                <Link href={`/${item.toLowerCase()}`} className="hover:text-green-400 transition-all">
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
