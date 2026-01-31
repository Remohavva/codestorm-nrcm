'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items = [],
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ease = "power3.out",
  theme = "light"
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveItem(null);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (index) => {
    if (activeItem === index) {
      setActiveItem(null);
      setIsOpen(false);
    } else {
      setActiveItem(index);
      setIsOpen(true);
    }
  };

  const handleLinkClick = (link) => {
    if (link.href) {
      router.push(link.href);
    }
    setActiveItem(null);
    setIsOpen(false);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      rotateX: -15,
      transition: {
        duration: 0.2
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <nav 
      ref={navRef}
      className={cn(
        "relative flex items-center justify-between p-4",
        theme === "dark" ? "text-white" : "text-black"
      )}
      style={{ backgroundColor: baseColor }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        {logo && (
          <img 
            src={logo} 
            alt={logoAlt} 
            className="h-8 w-auto"
          />
        )}
        <span className="font-plus-jakarta font-bold text-lg text-white">
          College Events
        </span>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center space-x-6">
        {items.map((item, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleItemClick(index)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105",
                activeItem === index 
                  ? "shadow-lg transform scale-105" 
                  : "hover:shadow-md"
              )}
              style={{
                backgroundColor: activeItem === index ? buttonBgColor : 'transparent',
                color: activeItem === index ? buttonTextColor : (theme === "dark" ? "#fff" : "#000")
              }}
              aria-expanded={activeItem === index}
              aria-haspopup="true"
            >
              {item.label}
            </button>

            {/* Dropdown Card */}
            <AnimatePresence>
              {activeItem === index && (
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="rounded-xl shadow-2xl border backdrop-blur-xl min-w-[200px] overflow-hidden"
                    style={{
                      backgroundColor: item.bgColor,
                      color: item.textColor,
                      borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }}
                  >
                    {/* Card Header */}
                    <div className="px-6 py-4 border-b border-white/10">
                      <h3 className="font-semibold text-lg">{item.label}</h3>
                    </div>

                    {/* Card Links */}
                    <div className="p-4 space-y-2">
                      {item.links?.map((link, linkIndex) => (
                        <motion.button
                          key={linkIndex}
                          custom={linkIndex}
                          variants={linkVariants}
                          initial="hidden"
                          animate="visible"
                          className="block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/10 hover:translate-x-1"
                          aria-label={link.ariaLabel}
                          onClick={() => handleLinkClick(link)}
                        >
                          {link.label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Card Footer - Optional */}
                    <div className="px-6 py-3 bg-black/10 border-t border-white/10">
                      <p className="text-xs opacity-70">
                        {item.links?.length} items
                      </p>
                    </div>
                  </div>

                  {/* Arrow pointer */}
                  <div 
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
                    style={{ backgroundColor: item.bgColor }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 md:hidden"
          >
            <div 
              className="rounded-xl shadow-2xl border backdrop-blur-xl p-4 space-y-4"
              style={{
                backgroundColor: menuColor,
                borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }}
            >
              {items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 
                    className="font-semibold text-lg px-3 py-2"
                    style={{ color: item.textColor }}
                  >
                    {item.label}
                  </h3>
                  {item.links?.map((link, linkIndex) => (
                    <button
                      key={linkIndex}
                      className="block w-full text-left px-6 py-2 rounded-lg transition-all duration-200 hover:bg-white/10"
                      style={{ color: item.textColor }}
                      aria-label={link.ariaLabel}
                      onClick={() => handleLinkClick(link)}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default CardNav;