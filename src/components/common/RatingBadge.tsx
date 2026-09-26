import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  size = 'md',
  className = ''
}) => {
  const sizeConfig = {
    sm: { icon: 10, text: 'text-[11px]' },
    md: { icon: 13, text: 'text-xs' },
    lg: { icon: 15, text: 'text-sm font-semibold' }
  };

  const current = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-1 font-medium text-[#F5B301] ${current.text} ${className}`}
    >
      <Star
        size={current.icon}
        className="fill-[#F5B301] text-[#F5B301] drop-shadow-[0_0_6px_rgba(245,179,1,0.4)]"
      />
      <span className="tabular-nums tracking-tight font-semibold text-amber-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
