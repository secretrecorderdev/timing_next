'use client';

import { borderColorMap } from '@/shared/ui/colors';

export default function GlobalLoadingSpinner() {
  const borderColor = borderColorMap.primary.default;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30">
      <div       className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${borderColor}`} />
    </div>
  );
}

// ${textColorMap.primary.default.replace('text-', 'border-')}