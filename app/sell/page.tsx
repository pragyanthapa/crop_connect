"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Sell() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cropName, setCropName] = useState("");
  const [cropDescription, setCropDescription] = useState("");
  const [cropPrice, setCropPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session?.user?.role !== "FARMER") {
      setError("Only farmers can sell crops");
      setTimeout(() => {
        router.push("/market");
      }, 2000);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (session?.user?.role !== "FARMER") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Only farmers can sell crops</div>
      </div>
    );
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!cropName.trim()) {
      setError("Crop name is required");
      return false;
    }
    if (!cropDescription.trim()) {
      setError("Description is required");
      return false;
    }
    if (!cropPrice || parseFloat(cropPrice) <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      setError("Please enter a valid quantity");
      return false;
    }
    if (!location) {
      setError("Please get your location");
      return false;
    }
    if (!image) {
      setError("Please upload an image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!session) {
      setError("Please sign in to sell your crops.");
      router.push("/signin");
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", cropName.trim());
    formData.append("description", cropDescription.trim());
    formData.append("price", cropPrice);
    formData.append("quantity", quantity);
    if (location) {
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
    }
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/farmer", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload data");
      }

      setSuccess("Crop listed successfully!");
      setTimeout(() => {
        router.push("/market");
      }, 1500);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Error listing crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Sell Your Crop
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium">Crop Name</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
              placeholder="Enter crop name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              value={cropDescription}
              onChange={(e) => setCropDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
              placeholder="Brief description of the crop"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Price (per kg)</label>
            <input
              type="number"
              value={cropPrice}
              onChange={(e) => setCropPrice(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Quantity (kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={location ? `${location.latitude}, ${location.longitude}` : ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                placeholder="Fetching location..."
              />
              <button
                type="button"
                onClick={getLocation}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Get Location
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Crop Preview"
                className="mt-4 w-full h-40 object-cover rounded-lg shadow-md"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            {loading ? "Submitting..." : "Sell Crop"}
          </button>
        </form>
      </div>
    </div>
  );
}
