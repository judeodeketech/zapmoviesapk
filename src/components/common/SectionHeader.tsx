import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onSeeAll,
  seeAllLabel = 'See all',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between px-4 mb-3 ${className}`}>
      <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
        <span className="w-1 h-3.5 bg-[#F5B301] rounded-full inline-block" />
        {title}
      </h2>
      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="group text-xs font-semibold text-slate-400 hover:text-[#F5B301] transition-colors flex items-center gap-0.5 cursor-pointer py-1"
        >
          <span>{seeAllLabel}</span>
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform text-slate-500 group-hover:text-[#F5B301]"
          />
        </button>
      )}
    </div>
  );
};
