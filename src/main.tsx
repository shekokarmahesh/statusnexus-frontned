import React from 'react'; // Add this import
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the theme from localStorage or use system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("status-dashboard-theme");
  
  if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
    if (savedTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return savedTheme;
  }
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Apply theme class immediately to prevent flash
const theme = getInitialTheme();
if (theme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
