import { useEffect, useRef } from 'react';

export function DetailDialog({ open, title, html, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
      document.documentElement.classList.add('overflow-hidden');
    } else if (el.open) {
      el.close();
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCloseEv = () => onClose();
    el.addEventListener('close', onCloseEv);
    return () => el.removeEventListener('close', onCloseEv);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      id="detail-modal"
      className="w-full max-w-lg rounded-2xl border-0 p-0 text-slate-700 shadow-2xl"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="max-h-[80vh] overflow-y-auto p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold leading-tight text-navy">{title}</h2>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl leading-none text-navy transition hover:bg-slate-200"
            aria-label="Close"
            onClick={() => ref.current?.close()}
          >
            ×
          </button>
        </div>
        <div
          className="modal-body mt-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </dialog>
  );
}
