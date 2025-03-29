"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FaLeaf, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";

export default function AppBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/market", label: "Market" },
    { href: "/contracts", label: "Contracts" },
    { href: "/advisory", label: "AI Advisory" },
  ];

  return (
    <motion.header
      style={{ 
        y: headerY,
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur}px)`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/90" : "bg-transparent"
      }`}
    >
      <div className="relative">
        {/* 3D Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 to-gray-900/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,255,0,0.05)_0%,transparent_100%)]" />
        
        {/* Main content */}
        <div className="relative container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with 3D effect */}
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full transform group-hover:scale-150 transition-transform duration-300" />
                  <FaLeaf className="text-3xl text-green-400 group-hover:text-green-300 transition-colors duration-300 relative z-10" />
                </div>
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600 relative">
                  CropConnect
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 blur-sm transform translate-y-1" />
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation with 3D hover effects */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative group ${
                    pathname === item.href
                      ? "text-green-400"
                      : "text-gray-300 hover:text-green-400"
                  } transition-colors duration-300`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-lg"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute -inset-1 bg-green-500/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Link>
              ))}
            </nav>

            {/* Auth Buttons with enhanced 3D effects */}
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="relative group flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full transform group-hover:scale-150 transition-transform duration-300" />
                      <FaUser className="text-lg relative z-10" />
                    </div>
                    <span className="relative z-10">Profile</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-lg"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signOut()}
                    className="relative px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <div className="absolute inset-0 bg-red-500/10 blur-lg rounded-lg transform group-hover:scale-150 transition-transform duration-300" />
                    <FaSignOutAlt className="relative z-10" />
                    <span className="relative z-10">Sign Out</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/signin"
                    className="relative group flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full transform group-hover:scale-150 transition-transform duration-300" />
                      <FaUser className="text-lg relative z-10" />
                    </div>
                    <span className="relative z-10">Sign In</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-lg"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-lg transform group-hover:scale-150 transition-transform duration-300" />
                    <Link
                      href="/register"
                      className="relative px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 z-10"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button with 3D effect */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative text-gray-300 hover:text-green-400 transition-colors duration-300 group"
            >
              <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full transform group-hover:scale-150 transition-transform duration-300" />
              <span className="relative z-10">
                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu with enhanced 3D effects */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 relative"
              >
                <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent" />
                  <div className="p-4 space-y-4 relative z-10">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                          pathname === item.href
                            ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/10"
                            : "text-gray-300 hover:bg-gray-800/50 hover:text-green-400 hover:shadow-lg hover:shadow-gray-800/20"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {session ? (
                      <>
                        <Link
                          href="/profile"
                          className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-green-400 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-800/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-red-500/10"
                        >
                          <FaSignOutAlt />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/signin"
                          className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-green-400 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gray-800/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 text-center hover:shadow-lg hover:shadow-green-500/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
} 