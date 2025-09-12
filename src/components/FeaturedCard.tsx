import React from "react";
import type { Feature } from "../Data/featuresData";

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <div className="p-4 sm:p-6 group">
      <div className="mb-4 sm:mb-5 text-[#89764b] group-hover:text-black transition-colors duration-200">
        {feature.icon()}
      </div>
      <h3 className="text-lg sm:text-xl uppercase tracking-tight mb-3 font-normal text-gray-900">
        {feature.title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-left font-light text-sm sm:text-base">
        {feature.description.trim()}
      </p>
    </div>
  );
};

export default FeatureCard;
