
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate page transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-mindful-soft/30 to-mindful-light/50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 p-5 md:p-8 transition-all duration-300 ease-in-out">
        <div className="mb-6 flex items-center md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
        
        {/* Background patterns */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-mindful-primary/5 blur-3xl"></div>
          <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-mindful-secondary/5 blur-3xl"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="animate-fade-in"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
