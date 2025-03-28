"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FaUserCircle, FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Market() {
  const { data: session } = useSession();
  const user = session?.user;

  const crops = [
    { name: "Organic Wheat", price: "$200/ton", location: "Punjab, India" },
    { name: "Basmati Rice", price: "$350/ton", location: "Haryana, India" },
    { name: "Golden Corn", price: "$180/ton", location: "Texas, USA" },
    { name: "Fresh Apples", price: "$500/ton", location: "Himachal Pradesh, India" },
    { name: "Soybeans", price: "$230/ton", location: "Iowa, USA" },
  ];

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
            Buy & Sell <span className="text-white">Crops</span> with Ease
          </h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            A **transparent, secure**, and **efficient** marketplace for farmers and buyers.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/sell">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-700 transition flex items-center space-x-2"
              >
                <FaPlus />
                <span>List Your Crop</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      
      <section className="container mx-auto py-8 px-6">
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <FaSearch className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search crops..." 
              className="bg-transparent outline-none text-gray-300 placeholder-gray-400"
            />
          </div>
          <button className="flex items-center space-x-2 text-green-400 hover:text-green-500 transition">
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </section>

     
      <section className="container mx-auto py-12">
        <h2 className="text-4xl font-bold text-center text-green-400">Available Crops</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crops.map((crop, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-800 shadow-md rounded-xl border-t-4 border-green-500"
            >
              <h3 className="text-xl font-semibold text-green-400">{crop.name}</h3>
              <p className="text-gray-300 mt-2">{crop.price}</p>
              <p className="text-gray-400">{crop.location}</p>
              <button 
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full"
              >
                Buy Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

     
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-4xl font-bold text-green-400">Start Selling Today</h2>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          Join thousands of farmers selling their produce at **fair prices**. Get **instant market access** and reach **verified buyers**.
        </p>
        <div className="mt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-600 transition"
          >
            List Your Crop
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
