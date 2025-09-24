"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../app/components/Toast/page.js";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, role = "info", duration = 2000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, role }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[10%] left-1/2 transform -translate-x-1/2 z-[2001] space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
