
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnterApp = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 800); // Delay to allow for animation
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 flex flex-col items-center text-center px-6 max-w-lg transition-all duration-500 ease-in-out ${
          isTransitioning ? "opacity-0 transform translate-y-10" : ""
        }`}
      >
        {/* Logo */}
        <div className="mb-6">
          <div className="h-24 w-24 relative">
            <div className="absolute inset-0 rounded-full bg-white/90 shadow-lg"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-mindful-primary via-mindful-secondary to-mindful-tertiary animate-pulse-glow"></div>
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
              <svg 
                className="h-10 w-10 text-mindful-primary" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          MindfulMe
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
          Nurturing Your Mind, One Moment at a Time
        </p>

        {/* Description */}
        <p className="text-white/80 mb-10 max-w-md shadow-sm">
          Your personal companion for mental wellness, providing tools to track mood, 
          journal your thoughts, practice meditation, and discover helpful resources.
        </p>

        {/* Enter button */}
        <Button
          onClick={handleEnterApp}
          className="px-8 py-6 text-lg rounded-full bg-white/90 text-mindful-primary hover:bg-white hover:scale-105 transition-all duration-300 font-medium shadow-lg"
        >
          Begin Your Journey
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
