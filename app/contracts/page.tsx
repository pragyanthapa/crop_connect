"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaTruck, FaMapMarkerAlt, FaClock, FaUserCircle, } from "react-icons/fa";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

interface Contract {
  id: string;
  status: string;
  deliveryDate: string;
  notes: string;
  buyer: {
    user: {
      name: string;
    };
  };
  crop: {
    name: string;
    quantity: number;
    price: number;
    imageUrl: string | null;
  };
}

export default function Contracts() {
  const { data: session, status } = useSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "active" | "completed">("all");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch("/api/contracts");
        if (!response.ok) {
          throw new Error("Failed to fetch contracts");
        }
        const data = await response.json();
        setContracts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch contracts");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchContracts();
    }
  }, [status]);

  const filteredContracts = contracts.filter((contract) => {
    switch (activeTab) {
      case "pending":
        return contract.status === "PENDING";
      case "active":
        return ["ACCEPTED", "IN_TRANSIT"].includes(contract.status);
      case "completed":
        return contract.status === "DELIVERED";
      default:
        return true;
    }
  });

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please Sign In</h1>
          <button
            onClick={() => signIn()}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-900/80 backdrop-blur-xl shadow-lg py-5 px-6 sticky top-0 z-50 border-b border-gray-800/50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600">
            CropConnect
          </Link>
          <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
            <Link href="/" className="hover:text-green-400 transition-colors duration-300">Home</Link>
            <Link href="/market" className="hover:text-green-400 transition-colors duration-300">Market</Link>
            <Link href="/contracts" className="text-green-400">Contracts</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300">
                <FaUserCircle className="text-2xl" />
                <span className="hidden md:inline">{session?.user?.name || "Profile"}</span>
              </button>
              <div className="absolute right-0 mt-2 bg-gray-800 shadow-lg rounded-md p-3 hidden group-hover:block">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link>
                <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">
            My Contracts
          </h1>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {["all", "pending", "active", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors duration-300 ${
                  activeTab === tab
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 backdrop-blur-xl border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors duration-300"
            >
              {contract.crop.imageUrl && (
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={contract.crop.imageUrl}
                    alt={contract.crop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-400">{contract.crop.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  contract.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                  contract.status === "ACCEPTED" ? "bg-blue-500/20 text-blue-400" :
                  contract.status === "IN_TRANSIT" ? "bg-purple-500/20 text-purple-400" :
                  contract.status === "DELIVERED" ? "bg-green-500/20 text-green-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {contract.status.replace("_", " ")}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-gray-300">
                  <FaUserCircle className="text-gray-400" />
                  <span>Buyer: {contract.buyer.user.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <FaClock className="text-gray-400" />
                  <span>Delivery: {new Date(contract.deliveryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>Quantity: {contract.crop.quantity} kg</span>
                </div>
                {contract.notes && (
                  <p className="text-gray-400 text-sm">{contract.notes}</p>
                )}
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/contracts/${contract.id}/tracking`}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
                >
                  <FaTruck />
                  <span>Track Delivery</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No contracts found</p>
          </div>
        )}
      </main>
    </div>
  );
}
