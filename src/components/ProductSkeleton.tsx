import React from "react";
import { motion } from "framer-motion";

export const ProductSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden border border-[#9c9c9c]/30"
    >
      <div className="h-60 md:h-80 bg-gradient-to-br from-[#f5f5f5] to-[#e5e5e5] animate-pulse">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
      </div>
      <div className="p-4 md:p-6">
        <div className="h-5 md:h-6 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded mb-3 md:mb-4 animate-pulse"></div>
        <div className="h-3 md:h-4 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded mb-2 md:mb-3 w-3/4 animate-pulse"></div>
        <div className="h-12 md:h-16 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded mb-4 md:mb-6 animate-pulse"></div>
        <div className="h-8 md:h-10 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded animate-pulse"></div>
      </div>
    </motion.div>
  );
};