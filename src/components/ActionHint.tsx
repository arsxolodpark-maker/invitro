import React, { ReactNode, useRef, useState } from 'react';

type HintAlign = 'left' | 'center' | 'right';
type HintPlacement = 'top' | 'bottom';

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

export const ActionHint: React.FC<ActionHintProps> = ({ text, children, mobilePrefix = 'После нажатия:', className = '', align = 'center' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<HintPlacement>('bottom');
  const [resolvedAlign, setResolvedAlign] = useState<HintAlign>(align);

  const resolvePosition = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window === 'undefined') return;
    const rect = wrapper.getBoundingClientRect();
    const estimatedTipHeight = 105;
    const estimatedHalfWidth = 144;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setPlacement(spaceBelow < estimatedTipHeight && spaceAbove > estimatedTipHeight ? 'top' : 'bottom');

    if (rect.right + estimatedHalfWidth > window.innerWidth) setResolvedAlign('right');
    else if (rect.left - estimatedHalfWidth < 0) setResolvedAlign('left');
    else setResolvedAlign(align);
  };

  const verticalClass = placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const tipArrowClass = placement === 'top'
    ? 'absolute -bottom-1 h-2 w-2 rotate-45 border-b border-r border-slate-200 bg-slate-900'
    : 'absolute -top-1 h-2 w-2 rotate-45 border-l border-t border-slate-200 bg-slate-900';

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={resolvePosition}
      onFocusCapture={resolvePosition}
      className={`group relative inline-flex max-w-full flex-col items-start ${className}`}
    >
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-30 hidden w-72 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-left text-xs font-medium leading-5 text-white shadow-xl md:group-hover:block md:group-focus-within:block ${verticalClass} ${positionClass[resolvedAlign]}`}
      >
        {text}
        <span className={`${tipArrowClass} ${arrowClass[resolvedAlign]}`} />
      </div>
      <div className="mt-1.5 text-[11px] leading-4 text-slate-400 md:hidden">
        <strong className="font-semibold text-slate-500">{mobilePrefix}</strong> {text}
      </div>
    </div>
  );
};
