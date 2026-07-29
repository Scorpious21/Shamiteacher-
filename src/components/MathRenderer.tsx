import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Function to process block $$...$$ and inline $...$ math expressions
  const renderFormattedText = (text: string) => {
    // Split by block math $$...$$ first
    const parts = text.split(/(\$\$[\s\S]*?\$\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <div
              key={idx}
              id={`math-block-${idx}`}
              className="my-3 overflow-x-auto p-3 bg-slate-950/60 rounded-lg text-emerald-300 flex justify-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <pre key={idx} className="p-2 bg-slate-900 font-mono text-emerald-400">{math}</pre>;
        }
      }

      // Process inline math $...$
      const inlineParts = part.split(/(\$[^\$\n]+?\$)/g);
      return (
        <span key={idx}>
          {inlineParts.map((subPart, subIdx) => {
            if (subPart.startsWith('$') && subPart.endsWith('$') && subPart.length > 2) {
              const math = subPart.slice(1, -1).trim();
              try {
                const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
                return (
                  <span
                    key={subIdx}
                    id={`math-inline-${idx}-${subIdx}`}
                    className="px-1 text-emerald-300 font-medium"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch {
                return <code key={subIdx} className="text-emerald-400">{math}</code>;
              }
            }
            return <span key={subIdx}>{subPart}</span>;
          })}
        </span>
      );
    });
  };

  return <div className={`prose prose-invert max-w-none text-slate-200 ${className}`}>{renderFormattedText(content)}</div>;
};
