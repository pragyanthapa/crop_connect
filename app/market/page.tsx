"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Crop {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  location: {
    address: string;
  };
  farmer: {
    user: {
      name: string;
    };
  };
}

export default function Market() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchCrops = async () => {
      try {
        const response = await fetch("/api/crops");
        if (!response.ok) {
          throw new Error("Failed to fetch crops");
        }
        const data = await response.json();
        setCrops(data);
      } catch (err) {
        console.error("Error fetching crops:", err);
        setError("Failed to load crops");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchCrops();
    }
  }, [status, router]);

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market</h1>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCrops.map((crop) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{crop.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{crop.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Price: ₹{crop.price}/kg
                  </p>
                  <p className="text-sm text-gray-600">
                    Available: {crop.quantity} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {crop.location.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    Farmer: {crop.farmer.user.name}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/create-contract?cropId=${crop.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create Contract
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No crops available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
