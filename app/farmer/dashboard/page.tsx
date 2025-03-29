"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";

interface Crop {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  imageUrl: string | null;
  location: {
    address: string;
    coordinates: { lat: number; lng: number } | null;
  };
  farmerId: string;
  createdAt: string;
}

interface FarmerProfile {
  id: string;
  experience: number;
  farmSize: number;
  cropTypes: string[];
  user: {
    name: string | null;
    username: string;
    location: string;
  };
}

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
  };
}

export default function FarmerDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    imageUrl: "",
    location: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/farmer/profile");
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/register/farmer?message=Please complete your farmer registration first.");
          return;
        }
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile");
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await fetch("/api/farmer/crops");
      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }
      const data = await response.json();
      setCrops(data);
    } catch (error) {
      console.error("Error fetching crops:", error);
      setError("Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/farmer/contracts");
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError("Failed to fetch contracts");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "FARMER") {
        router.push("/market");
        return;
      }

      const initializeData = async () => {
        await Promise.all([fetchProfile(), fetchCrops(), fetchContracts()]);
      };
      initializeData();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/farmer/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          description: formData.description,
          imageUrl: formData.imageUrl || null,
          location: {
            address: formData.location,
            coordinates: null
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add crop");
      }

      setShowAddForm(false);
      setFormData({
        name: "",
        quantity: "",
        price: "",
        description: "",
        imageUrl: "",
        location: "",
      });
      await fetchCrops();
    } catch (error) {
      console.error("Error adding crop:", error);
      setError(error instanceof Error ? error.message : "Failed to add crop");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cropId: string) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;

    try {
      const response = await fetch(`/api/farmer/crops/${cropId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete crop");
      }

      await fetchCrops();
    } catch (error) {
      console.error("Failed to delete crop:", error);
      setError(error instanceof Error ? error.message : "Failed to delete crop");
    }
  };

  const handleAcceptContract = async (contractId: string) => {
    if (!confirm("Are you sure you want to accept this contract?")) return;

    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to accept contract");
      }

      await Promise.all([fetchContracts(), fetchCrops()]);
    } catch (error) {
      console.error("Error accepting contract:", error);
      setError(error instanceof Error ? error.message : "Failed to accept contract");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.1)_0%,transparent_70%)]" />
      
      <motion.header 
        className="bg-gray-900/80 backdrop-blur-xl shadow-lg py-5 px-6 sticky top-0 z-50 border-b border-gray-800/50"
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600">
            CropConnect
          </Link>
          <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
            <Link href="/" className="hover:text-green-400 transition-colors duration-300">Home</Link>
            <Link href="/market" className="hover:text-green-400 transition-colors duration-300">Market</Link>
            <Link href="/contracts" className="hover:text-green-400 transition-colors duration-300">Contracts</Link>
          </nav>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12 relative z-10">
        {profile && (
          <div className="mb-8 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Farmer Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-lg">{profile.user.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Experience</p>
                <p className="text-lg">{profile.experience} years</p>
              </div>
              <div>
                <p className="text-gray-400">Farm Size</p>
                <p className="text-lg">{profile.farmSize} acres</p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-lg">{profile.user.location}</p>
              </div>
              <div>
                <p className="text-gray-400">Crop Types</p>
                <p className="text-lg">{profile.cropTypes.join(", ")}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
            My Crops
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add New Crop</span>
          </motion.button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 backdrop-blur-xl border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold text-green-400 mb-6">Add New Crop</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Crop Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Quantity (kg)</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Price per kg ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700/30 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Crop"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors duration-300"
            >
              {crop.imageUrl && (
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <img
                    src={crop.imageUrl}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-green-400 mb-2">{crop.name}</h3>
              <p className="text-gray-300 mb-4 line-clamp-2">{crop.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-gray-400">Quantity: {crop.quantity} kg</p>
                <p className="text-gray-400">Price: ${crop.price}/kg</p>
                <p className="text-gray-400">Location: {crop.location.address}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(crop.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pending Contracts Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-6">
            Pending Contracts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors duration-300"
              >
                <h3 className="text-xl font-bold text-green-400 mb-2">{contract.crop.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-400">Buyer: {contract.buyer.user.name}</p>
                  <p className="text-gray-400">Delivery Date: {new Date(contract.deliveryDate).toLocaleDateString()}</p>
                  {contract.notes && (
                    <p className="text-gray-400">Notes: {contract.notes}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleAcceptContract(contract.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Accept Contract
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 