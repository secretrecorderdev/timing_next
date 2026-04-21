'use client';

import { useRef } from 'react';
import type { ColorType } from '@/common/ui/colors';
import { textColorMap } from '@/common/ui/colors';

export type TabItem = {
  key: string;
  label: string;
};

type HorizontalTabsProps = {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  color?: ColorType;
};

export default function HorizontalTab({
  tabs,
  activeKey,
  onChange,
  color = 'primary',
}: HorizontalTabsProps) {
  // const [activeTab, setActiveTab] = useState(activeKey);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  const isDrag = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDrag.current = true;
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft; 
      scrollLeft.current = scrollRef.current.scrollLeft; 
    }
  };

  const onDragEnd = () => {
    isDrag.current = false;
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (isDrag.current && scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX.current) * 1;
      scrollRef.current.scrollLeft = scrollLeft.current - walk; 
    }
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing bg-white"
    >
      <div className="flex space-x-6 px-4 w-max">
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          const textClass = isActive
            ? textColorMap[color].default + ' border-b-2 ' + textColorMap[color].default.replace('text-', 'border-')
            : 'text-gray-500';

          return (
            <button
              key={tab.key}
              className={`py-3 text-sm font-medium whitespace-nowrap cursor-pointer ${textClass}`}
              onClick={() => onChange(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
