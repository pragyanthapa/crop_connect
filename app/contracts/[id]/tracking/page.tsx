"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaTruck, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import DeliveryMap from "@/app/components/DeliveryMap";


interface Contract {
  id: string;
  status: string;
  quantity: number;
  deliveryDate: string;
  buyerLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  farmerLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  crop: {
    name: string;
    price: number;
  };
  buyer: {
    name: string;
  };
  farmer: {
    name: string;
  };
}

type DeliveryStatus = "PENDING" | "ACCEPTED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export default function ContractTracking() {
  const params = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch contract");
        }
        const data = await response.json();
        setContract(data);
        setDeliveryStatus(data.status as DeliveryStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [params.id]);

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            const address = data.results[0]?.formatted_address || "Current Location";
            setCurrentLocation({
              lat: latitude,
              lng: longitude,
              address,
            });
          } catch (err) {
            setCurrentLocation({
              lat: latitude,
              lng: longitude,
              address: "Current Location",
            });
          }
        },
        (error) => {
          setError("Error getting location: " + error.message);
        }
      );
    };

    getLocation();
  }, []);

  useEffect(() => {
    const calculateEstimatedTime = async () => {
      if (!contract || !currentLocation) return;

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${currentLocation.lat},${currentLocation.lng}&destinations=${contract.buyerLocation.lat},${contract.buyerLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.rows[0].elements[0].status === "OK") {
          setEstimatedTime(data.rows[0].elements[0].duration.text);
        }
      } catch (err) {
        console.error("Error calculating estimated time:", err);
      }
    };

    calculateEstimatedTime();
  }, [contract, currentLocation]);

  const updateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      setDeliveryStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error || "Contract not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Contract Delivery Tracking</h1>

        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contract Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Crop:</span> {contract.crop.name}</p>
              <p><span className="font-medium">Quantity:</span> {contract.quantity} kg</p>
              <p><span className="font-medium">Price:</span> ₹{contract.crop.price}/kg</p>
              <p><span className="font-medium">Delivery Date:</span> {new Date(contract.deliveryDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Delivery Status</h2>
            <div className="flex items-center space-x-2">
              <FaTruck className={`text-2xl ${deliveryStatus === "IN_TRANSIT" ? "text-blue-500" : "text-gray-400"}`} />
              <span className={`font-medium ${
                deliveryStatus === "IN_TRANSIT" ? "text-blue-500" :
                deliveryStatus === "DELIVERED" ? "text-green-500" :
                deliveryStatus === "CANCELLED" ? "text-red-500" :
                "text-gray-500"
              }`}>
                {deliveryStatus.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Location Tracking */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Location Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-500" />
              <div>
                <p className="font-medium">Farmer Location</p>
                <p className="text-sm text-gray-600">{contract.farmerLocation.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <div>
                <p className="font-medium">Buyer Location</p>
                <p className="text-sm text-gray-600">{contract.buyerLocation.address}</p>
              </div>
            </div>
            {currentLocation && (
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-purple-500" />
                <div>
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-gray-600">{currentLocation.address}</p>
                </div>
              </div>
            )}
            {estimatedTime && (
              <div className="flex items-center space-x-2">
                <FaClock className="text-yellow-500" />
                <div>
                  <p className="font-medium">Estimated Delivery Time</p>
                  <p className="text-sm text-gray-600">{estimatedTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Delivery Route</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <DeliveryMap
              farmerLocation={contract.farmerLocation}
              buyerLocation={contract.buyerLocation}
              currentLocation={currentLocation}
            />
          </div>
        </div>

        {/* Status Update Buttons */}
        <div className="flex flex-wrap gap-4">
          {deliveryStatus === "PENDING" && (
            <button
              onClick={() => updateDeliveryStatus("ACCEPTED")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Accept Contract
            </button>
          )}
          {deliveryStatus === "ACCEPTED" && (
            <button
              onClick={() => updateDeliveryStatus("IN_TRANSIT")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Delivery
            </button>
          )}
          {deliveryStatus === "IN_TRANSIT" && (
            <button
              onClick={() => updateDeliveryStatus("DELIVERED")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark as Delivered
            </button>
          )}
          {(deliveryStatus === "PENDING" || deliveryStatus === "ACCEPTED") && (
            <button
              onClick={() => updateDeliveryStatus("CANCELLED")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancel Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 