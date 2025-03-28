"use client";

import { useState } from "react";
import { FaSearch, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Advisory() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.answer || "No response available.");
    } catch (error) {
      setResponse("Error fetching advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
     
      <header className="bg-gray-950 shadow-lg py-5 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-3xl font-extrabold text-green-400 tracking-wide">
            CropConnect
          </a>
          <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
            <a href="/" className="hover:text-green-400 transition">Home</a>
            <a href="/market" className="hover:text-green-400 transition">Market</a>
            <a href="/contracts" className="hover:text-green-400 transition">Contracts</a>
            <a href="/advisory" className="hover:text-green-400 transition">AI Advisory</a>
          </nav>
        </div>
      </header>

      
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-24 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-green-400 leading-tight">
            AI-Powered <span className="text-white">Crop Advisory</span>
          </h1>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Get **personalized recommendations** for your crops based on soil health, weather, and market demand.
          </p>
        </div>
      </section>

     
      <section className="container mx-auto py-12 px-6">
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-400 flex items-center">
            <FaRobot className="mr-2" /> Ask Our AI Advisor
          </h2>
          <p className="text-gray-300 mt-2">Type your query below and receive expert guidance instantly.</p>

          <div className="mt-4 flex items-center bg-gray-700 rounded-lg">
            <input 
              type="text" 
              className="w-full bg-transparent text-white p-3 focus:outline-none" 
              placeholder="e.g., Best crops for sandy soil in summer?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition"
              onClick={handleSubmit}
              disabled={loading}
            >
              <FaSearch />
            </motion.button>
          </div>

         
          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-gray-300">
            {loading ? <p className="text-green-400">Fetching advice...</p> : <p>{response || "Awaiting your query..."}</p>}
          </div>
        </div>
      </section>

     
      <section className="container mx-auto py-16 text-center">
        <h2 className="text-4xl font-bold text-green-400">Optimize Your Farming with AI</h2>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
          Get real-time insights tailored to **your soil conditions, climate, and market trends**.
        </p>
      </section>

    
      <footer className="bg-gray-950 text-gray-400 py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 CropConnect. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
