"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar/page.js";
import Footer from "./components/Footer/page.js";
import LoginModal from "./components/LoginModal/page.js";
import { AuthProvider } from "../context/AuthContext.js";
import { ToastProvider } from "../context/toast.js";
import { CardProvider } from "../context/addToCart.js";
import FloatingCartIcon from "../app/components/FloatingCartIcon/page.js"; // moved out

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthProvider>
      <CardProvider>
        <ToastProvider>
          <Navbar onLoginClick={openLoginModal} />
          <LoginModal isOpen={isLoginModalOpen} isClose={closeLoginModal} />
          {children}
          <FloatingCartIcon />
          <Footer />
        </ToastProvider>
      </CardProvider>
    </AuthProvider>
  );
}
