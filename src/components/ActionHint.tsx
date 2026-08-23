import React, { ReactNode } from 'react';

interface ActionHintProps {
  text: string;
  children: ReactNode;
  mobilePrefix?: string;
  className?: string;
}

export const ActionHint: React.FC<ActionHintProps> = ({ text, children, mobilePrefix = 'После нажатия:', className = '' }) => (
  <div className={`group relative inline-flex max-w-full flex-col items-start ${className}`}>
    {children}
    <div
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-left text-xs font-medium leading-5 text-white shadow-xl md:group-hover:block md:group-focus-within:block"
    >
      {text}
      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-slate-900" />
    </div>
    <div className="mt-1.5 text-[11px] leading-4 text-slate-400 md:hidden">
      <strong className="font-semibold text-slate-500">{mobilePrefix}</strong> {text}
    </div>
  </div>
);
