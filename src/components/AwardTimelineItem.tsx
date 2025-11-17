import React from "react";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import type { Award } from "../Data/awardsData";

export const timelineIconStyle = { 
  background: '#89764b', 
  color: '#fff',
  boxShadow: '0 0 0 4px #d4d4d4, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)'
};

export const timelineContentStyle = {
  background: '#ffffff',
  color: '#000000',
  border: '1px solid #e0e0e0',
  boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  padding: '1rem',
};

const AwardTimelineItem: React.FC<{ award: Award }> = ({ award }) => (
  <VerticalTimelineElement
    className="vertical-timeline-element--work hover:scale-[1.02] transition-transform duration-200"
    contentStyle={timelineContentStyle}
    contentArrowStyle={{ borderRight: '7px solid #ffffff' }}
    date={award.month ? `${award.month.toUpperCase()} ${award.year}` : award.year}
    dateClassName="font-light text-[#89764b] uppercase tracking-wider text-xs sm:text-sm"
    iconStyle={timelineIconStyle}
    icon={award.icon}
  >
    {award.month && (
      <h3 className="vertical-timeline-element-title text-sm sm:text-base text-[#89764b] font-light uppercase tracking-wide mb-2 border-b border-[#89764b]/20 pb-1">
        {award.month.toUpperCase()}
      </h3>
    )}
    <p className="text-gray-700 font-light leading-relaxed text-xs sm:text-sm">
      {award.name}
    </p>
  </VerticalTimelineElement>
);

export default AwardTimelineItem;
