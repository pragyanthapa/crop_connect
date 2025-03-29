"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signOut, useSession } from "next-auth/react";

export default function FarmerDashboard() {
  const { register, handleSubmit, reset } = useForm();
  const { data: session } = useSession();
  const [image, setImage] = useState<string | null>(null);

  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

 
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/farmer/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          quantity: Number(data.quantity),
          imageUrl: image,
          location: {
            address: data.location,
            coordinates: null
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add crop");
      }

      reset();
      setImage(null);
      alert("Crop added successfully!");
    } catch (error) {
      console.error("Error adding crop:", error);
      alert(error instanceof Error ? error.message : "Error adding crop");
    }
  };

  if (!session) return <p>Please log in as a farmer.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-green-700">Farmer Dashboard</h1>
      
     
      <div className="text-right">
        <button onClick={() => signOut()} className="px-4 py-2 bg-red-600 text-white rounded-md">Sign Out</button>
      </div>

     
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white p-6 shadow-lg rounded-md">
        <label className="block text-gray-700 font-semibold">Crop Name</label>
        <input type="text" {...register("name", { required: true })} className="w-full px-4 py-2 border rounded-md mt-2" />

        <label className="block mt-4 text-gray-700 font-semibold">Quantity (kg)</label>
        <input type="number" {...register("quantity", { required: true })} className="w-full px-4 py-2 border rounded-md mt-2" />

        <label className="block mt-4 text-gray-700 font-semibold">Price ($/kg)</label>
        <input type="number" {...register("price", { required: true })} className="w-full px-4 py-2 border rounded-md mt-2" />

        <label className="block mt-4 text-gray-700 font-semibold">Description</label>
        <textarea {...register("description", { required: true })} className="w-full px-4 py-2 border rounded-md mt-2"></textarea>

        <label className="block mt-4 text-gray-700 font-semibold">Location</label>
        <input type="text" {...register("location", { required: true })} className="w-full px-4 py-2 border rounded-md mt-2" placeholder="Enter your farm location" />

        <label className="block mt-4 text-gray-700 font-semibold">Upload Field Picture</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
        {image && <img src={image} alt="Uploaded Field" className="mt-4 w-48 rounded-md" />}

        <button type="submit" className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-md">Submit Crop Details</button>
      </form>
    </div>
  );
}
