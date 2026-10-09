import React from 'react';
import { ExternalLink, Info } from 'lucide-react';

export const ArasaacAttribution: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <footer className="w-full py-3 px-4 border-t border-slate-200/80 bg-white/70 text-center text-[11px] text-slate-500">
        <p>
          Pictographic symbols used are a property of the Government of Aragón and have been created by{' '}
          <strong>Sergio Palao</strong> for{' '}
          <a
            href="https://arasaac.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 font-semibold underline hover:text-teal-900 inline-flex items-center gap-0.5"
          >
            ARASAAC <ExternalLink className="w-2.5 h-2.5" />
          </a>
          , that distributes them under{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 font-semibold underline hover:text-teal-900"
          >
            Creative Commons License BY-NC-SA
          </a>
          .
        </p>
      </footer>
    );
  }

  return (
    <div className="w-full bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 sm:p-4 my-4 text-xs text-slate-700 leading-relaxed shadow-2xs">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-teal-200/70 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-teal-950 text-xs mb-1">
            ARASAAC Official Pictogram Attribution (Creative Commons BY-NC-SA)
          </h4>
          <p className="text-[11px] text-slate-600">
            The pictographic symbols used in this application are the property of the{' '}
            <strong>Government of Aragón</strong> and have been created by <strong>Sergio Palao</strong> for{' '}
            <a
              href="https://arasaac.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 font-bold underline hover:text-teal-900 inline-flex items-center gap-0.5"
            >
              ARASAAC <ExternalLink className="w-3 h-3" />
            </a>
            , which distributes them under the{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 font-bold underline hover:text-teal-900"
            >
              Creative Commons License (BY-NC-SA 4.0)
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
