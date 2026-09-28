import React from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCampaigns();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm transition-all duration-200 animate-in fade-in slide-in-from-top-2 bg-white ${
              isSuccess
                ? 'border-emerald-200 text-stone-900'
                : isWarning
                ? 'border-amber-200 text-stone-900'
                : 'border-violet-200 text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
              {isWarning && <AlertCircle size={18} className="text-amber-600 shrink-0" />}
              {!isSuccess && !isWarning && <Info size={18} className="text-violet-600 shrink-0" />}
              <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
