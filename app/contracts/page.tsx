"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FaUserCircle, FaFileContract, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Contracts() {
  const { data: session } = useSession();
  const user = session?.user;

  const contracts = [
    { title: "Wheat Supply Agreement", price: "$20,000", status: "Active", buyer: "AgroCorp" },
    { title: "Organic Rice Deal", price: "$15,000", status: "Pending", buyer: "Green Foods Ltd." },
    { title: "Corn Purchase Agreement", price: "$30,000", status: "Completed", buyer: "FreshHarvest" },
    { title: "Soybean Export Contract", price: "$25,000", status: "Active", buyer: "Global Traders Inc." },
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
            Secure & Fair <span className="text-white">Farming Contracts</span>
          </h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Ensure **stable pricing and guaranteed income** with transparent **contract farming**.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/create-contract">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-700 transition flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create a Contract</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

     
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-4xl font-bold text-center text-green-400">Active Contracts</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contracts.map((contract, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-800 shadow-md rounded-xl border-t-4 border-green-500"
            >
              <h3 className="text-xl font-semibold text-green-400">{contract.title}</h3>
              <p className="text-gray-300 mt-2">Price: {contract.price}</p>
              <p className={`mt-2 ${contract.status === "Active" ? "text-green-400" : "text-gray-400"}`}>
                Status: {contract.status}
              </p>
              <p className="text-gray-300">Buyer: {contract.buyer}</p>
              <button 
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-4xl font-bold text-green-400">Start Securing Your Produce</h2>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          Sign up today and **lock in your crop prices** before the market fluctuates.
        </p>
        <div className="mt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-600 transition"
          >
            Create a Contract
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
