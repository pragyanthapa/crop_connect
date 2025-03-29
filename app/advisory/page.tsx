"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaRobot, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

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

export default function Advisory() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          getAIResponse(transcript); // Auto-fetch AI response when voice input is captured
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
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

  const getAIResponse = async (queryText: string) => {
    if (!queryText.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: queryText }] }]
        }
      );

      const generatedText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
      setResponse(generatedText);

      // Speak the AI response
      const utterance = new SpeechSynthesisUtterance(generatedText);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("API Error:", error);
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
          <p className="text-gray-300 mt-2">Speak or type your query and receive expert guidance instantly.</p>

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
              onClick={() => getAIResponse(query)}
              disabled={loading}
            >
              <FaSearch />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
            >
              {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </motion.button>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg text-gray-300">
            {loading ? <p className="text-green-400">Fetching advice...</p> : <p>{response || "Awaiting your query..."}</p>}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-8 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 CropConnect. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}