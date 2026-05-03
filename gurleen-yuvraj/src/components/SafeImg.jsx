import { forwardRef, useState } from 'react';

/**
 * Tries `primary`, then `fallback`. Shows minimal placeholder if both fail.
 */
export const SafeImg = forwardRef(function SafeImg(
  { primary, fallback, alt, className = '', loading = 'lazy', ...rest },
  ref
) {
  const chain = [primary, fallback].filter(Boolean);
  const [idx, setIdx] = useState(0);
  const src = chain[idx] ?? '';

  if (idx >= chain.length) {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center bg-gradient-to-br from-navy/90 to-blue/80 text-center text-xs font-medium text-white/70 ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4">{alt}</span>
      </div>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={() => setIdx((i) => i + 1)}
      {...rest}
    />
  );
});
