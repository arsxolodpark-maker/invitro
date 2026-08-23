import React, { ReactNode } from 'react';

type HintAlign = 'left' | 'center' | 'right';

interface ActionHintProps {
  text: string;
  children: ReactNode;
  mobilePrefix?: string;
  className?: string;
  align?: HintAlign;
}

const positionClass: Record<HintAlign, string> = {
  left: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-0',
};

const arrowClass: Record<HintAlign, string> = {
  left: 'left-6',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-6',
};

export const ActionHint: React.FC<ActionHintProps> = ({ text, children, mobilePrefix = 'После нажатия:', className = '', align = 'center' }) => (
  <div className={`group relative inline-flex max-w-full flex-col items-start ${className}`}>
    {children}
    <div
      role="tooltip"
      className={`pointer-events-none absolute top-full z-30 mt-2 hidden w-72 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-left text-xs font-medium leading-5 text-white shadow-xl md:group-hover:block md:group-focus-within:block ${positionClass[align]}`}
    >
      {text}
      <span className={`absolute -top-1 h-2 w-2 rotate-45 border-l border-t border-slate-200 bg-slate-900 ${arrowClass[align]}`} />
    </div>
    <div className="mt-1.5 text-[11px] leading-4 text-slate-400 md:hidden">
      <strong className="font-semibold text-slate-500">{mobilePrefix}</strong> {text}
    </div>
  </div>
);
