"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

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

export default function CreateContract() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cropId = searchParams.get("cropId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [formData, setFormData] = useState({
    cropId: cropId || "",
    quantity: "",
    deliveryDate: "",
    notes: "",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchCrop = async () => {
      if (!cropId) {
        setError("No crop selected");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/crops/${cropId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch crop details");
        }
        const data = await response.json();
        setSelectedCrop(data);
      } catch (err) {
        console.error("Error fetching crop:", err);
        setError("Failed to load crop details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchCrop();
    }
  }, [status, router, cropId]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Failed to get your location");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!location) {
      setError("Please get your location first");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          buyerLocation: location,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create contract");
      }

      router.push("/contracts");
    } catch (err) {
      console.error("Error creating contract:", err);
      setError(err instanceof Error ? err.message : "Failed to create contract");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!selectedCrop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">No crop selected</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create New Contract
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Crop</h3>
            <div className="space-y-2">
              <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedCrop.name}</p>
              <p className="text-gray-600"><span className="font-medium">Price:</span> ₹{selectedCrop.price}/kg</p>
              <p className="text-gray-600"><span className="font-medium">Available Quantity:</span> {selectedCrop.quantity} kg</p>
              <p className="text-gray-600"><span className="font-medium">Location:</span> {selectedCrop.location.address}</p>
              <p className="text-gray-600"><span className="font-medium">Farmer:</span> {selectedCrop.farmer.user.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity (kg)
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                max={selectedCrop.quantity}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum available: {selectedCrop.quantity} kg
              </p>
            </div>

            <div>
              <label
                htmlFor="deliveryDate"
                className="block text-sm font-medium text-gray-700"
              >
                Delivery Date
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Location
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : ""}
                  readOnly
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
                  placeholder="Click to get your location"
                />
                <button
                  type="button"
                  onClick={getLocation}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2"
                >
                  <FaMapMarkerAlt />
                  <span>Get Location</span>
                </button>
              </div>
              {locationError && (
                <p className="mt-1 text-sm text-red-600">{locationError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Contract"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
