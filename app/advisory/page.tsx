"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaMicrophone, FaMicrophoneSlash, FaRobot } from "react-icons/fa";

// Add type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export default function AIAdvisory() {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          getAIResponse(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setError('Speech recognition failed. Please try again.');
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      } else {
        setError('Speech recognition is not supported in your browser.');
      }
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setError(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const getAIResponse = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Sending message to AI:", text);
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      console.log("AI response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      if (!data.message) {
        throw new Error("No response from AI");
      }

      setResponse(data.message);

      // Convert response to speech
      const utterance = new SpeechSynthesisUtterance(data.message);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setError(error instanceof Error ? error.message : "Failed to get AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <header className="bg-gray-950/80 backdrop-blur-md shadow-lg py-5 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="text-3xl font-extrabold text-green-400 tracking-wide">
              CropConnect
            </Link>
          </motion.div>
          <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/" className="hover:text-green-400 transition">Home</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/market" className="hover:text-green-400 transition">Market</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/contracts" className="hover:text-green-400 transition">Contracts</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/advisory" className="hover:text-green-400 transition">AI Advisory</Link>
            </motion.div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-gray-700"
          >
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-green-400 mb-8"
            >
              AI Farming Assistant
            </motion.h1>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ 
                    boxShadow: isRecording 
                      ? "0 0 20px rgba(239, 68, 68, 0.5)" 
                      : "0 0 20px rgba(34, 197, 94, 0.5)"
                  }}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={loading}
                  className={`p-6 rounded-full ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white transition-colors duration-300`}
                >
                  {isRecording ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
                </motion.button>
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600"
                >
                  <p className="text-gray-300">Your message: {message}</p>
                </motion.div>
              )}

              {response && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-start space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <FaRobot className="text-green-400 mt-1" />
                    </motion.div>
                    <p className="text-gray-300">{response}</p>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⚡
                  </motion.div>
                  <span className="ml-2">Processing your request...</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-950/80 backdrop-blur-md text-gray-400 py-8 mt-16"
      >
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 CropConnect. All Rights Reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}
