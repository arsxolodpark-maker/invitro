import React, { ReactNode, useRef, useState } from 'react';

type HintAlign = 'left' | 'center' | 'right';
type HintLayout = 'overlay' | 'inline';

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
  const [layout, setLayout] = useState<HintLayout>('overlay');
  const [resolvedAlign, setResolvedAlign] = useState<HintAlign>(align);

  const resolvePosition = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof window === 'undefined') return;
    const rect = wrapper.getBoundingClientRect();
    const estimatedTipHeight = 100;
    const estimatedHalfWidth = 144;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Lower actions must never cover the action text above them. Instead of
    // flipping a tall tooltip over the card, show a wide inline helper strip
    // that expands the layout by one or two lines.
    const shouldUseInline = spaceBelow < estimatedTipHeight || rect.top > window.innerHeight * 0.55;
    setLayout(shouldUseInline ? 'inline' : 'overlay');

    if (rect.right + estimatedHalfWidth > window.innerWidth) setResolvedAlign('right');
    else if (rect.left - estimatedHalfWidth < 0) setResolvedAlign('left');
    else setResolvedAlign(align);
  };

  const inline = layout === 'inline';

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={resolvePosition}
      onFocusCapture={resolvePosition}
      className={`group relative inline-flex max-w-full flex-col items-start ${inline ? 'md:w-full' : ''} ${className}`}
    >
      {children}
      {inline ? (
        <div
          role="tooltip"
          className="mt-2 hidden w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-left text-xs font-medium leading-5 text-white shadow-lg md:group-hover:block md:group-focus-within:block"
        >
          {text}
        </div>
      ) : (
        <div
          role="tooltip"
          className={`pointer-events-none absolute top-full z-30 mt-2 hidden w-72 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-left text-xs font-medium leading-5 text-white shadow-xl md:group-hover:block md:group-focus-within:block ${positionClass[resolvedAlign]}`}
        >
          {text}
          <span className={`absolute -top-1 h-2 w-2 rotate-45 border-l border-t border-slate-200 bg-slate-900 ${arrowClass[resolvedAlign]}`} />
        </div>
      )}
      <div className="mt-1.5 text-[11px] leading-4 text-slate-400 md:hidden">
        <strong className="font-semibold text-slate-500">{mobilePrefix}</strong> {text}
      </div>
    </div>
  );
};
