"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import Link from "next/link";

export default function ContractSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to contracts page after 5 seconds
    const timer = setTimeout(() => {
      router.push("/contracts");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 max-w-md w-full mx-4 text-center"
      >
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-6xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Contract Accepted!
        </h1>
        <p className="text-gray-300 mb-6">
          Thank you for accepting the contract. Your order has been placed successfully.
        </p>
        <div className="flex justify-center mb-8">
          <FaTruck className="text-4xl text-blue-500 animate-bounce" />
        </div>
        <div className="space-y-4">
          <Link
            href="/contracts"
            className="block w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            View All Contracts
          </Link>
          <p className="text-sm text-gray-400">
            Redirecting to contracts page in 5 seconds...
          </p>
        </div>
      </motion.div>
    </div>
  );
} 