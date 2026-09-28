import React from 'react';
import { Platform, ContentType } from '../types';
import { Mountain, Compass, ShieldCheck, Award, Sun, Layers, Sparkles } from 'lucide-react';

interface CreativeThumbnailProps {
  title: string;
  category?: ContentType | string;
  platform?: Platform;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  tag?: string;
}

export const CreativeThumbnail: React.FC<CreativeThumbnailProps> = ({
  title,
  category = 'Campaign',
  platform,
  className = '',
  aspectRatio = 'video',
  tag,
}) => {
  // Derive consistent aesthetic based on title hash
  const getTheme = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const themes = [
      {
        bg: 'from-stone-900 via-violet-950 to-indigo-950',
        glow: 'bg-violet-500/20',
        mountain: '#7C3AED',
        mountainFront: '#6D28D9',
        sun: '#A78BFA',
        accent: '#C4B5FD',
        label: 'Field Series',
        Icon: Compass,
      },
      {
        bg: 'from-slate-900 via-sky-950 to-blue-950',
        glow: 'bg-sky-500/20',
        mountain: '#0284C7',
        mountainFront: '#0369A1',
        sun: '#38BDF8',
        accent: '#BAE6FD',
        label: 'Policy Brief',
        Icon: ShieldCheck,
      },
      {
        bg: 'from-zinc-900 via-emerald-950 to-teal-950',
        glow: 'bg-emerald-500/20',
        mountain: '#059669',
        mountainFront: '#047857',
        sun: '#34D399',
        accent: '#A7F3D0',
        label: 'Standards',
        Icon: Award,
      },
      {
        bg: 'from-neutral-900 via-rose-950 to-orange-950',
        glow: 'bg-rose-500/20',
        mountain: '#E11D48',
        mountainFront: '#BE123C',
        sun: '#FB7185',
        accent: '#FECDD3',
        label: 'Expedition',
        Icon: Sun,
      },
      {
        bg: 'from-gray-900 via-purple-950 to-violet-950',
        glow: 'bg-purple-500/20',
        mountain: '#9333EA',
        mountainFront: '#7E22CE',
        sun: '#C084FC',
        accent: '#E9D5FF',
        label: 'Visual Media',
        Icon: Layers,
      },
    ];
    return themes[Math.abs(hash) % themes.length];
  };

  const theme = getTheme(title);
  const IconComponent = theme.Icon;

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[4/5]',
    landscape: 'aspect-[1.91/1]',
  }[aspectRatio];

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${theme.bg} select-none flex flex-col justify-between p-3.5 sm:p-4 text-white shadow-inner ${aspectClass} ${className}`}
    >
      {/* Background topographic and mountain silhouette graphics */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen">
        <svg
          viewBox="0 0 400 200"
          className="absolute bottom-0 left-0 w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <circle cx="200" cy="50" r="45" fill={theme.sun} opacity="0.15" />
          <path
            d="M0,200 L60,110 L130,160 L220,70 L300,140 L360,90 L400,150 L400,200 Z"
            fill={theme.mountain}
            opacity="0.35"
          />
          <path
            d="M0,200 L80,140 L160,175 L250,115 L320,160 L400,130 L400,200 Z"
            fill={theme.mountainFront}
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Ambient soft glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${theme.glow} pointer-events-none`} />

      {/* Top row: Category tag & subtle icon */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded bg-white/10 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase text-white/90 border border-white/15">
          <IconComponent size={11} className="text-white/80" />
          {tag || category}
        </span>
        {platform && (
          <span className="text-[11px] text-white/70 font-medium px-1.5 py-0.5 rounded bg-black/20 backdrop-blur-sm border border-white/10">
            {platform}
          </span>
        )}
      </div>

      {/* Bottom row: Campaign Title & Subtitle */}
      <div className="relative z-10 mt-auto pt-4">
        <h4 className="text-sm sm:text-base font-bold tracking-tight text-white line-clamp-2 drop-shadow-sm leading-snug">
          {title}
        </h4>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/70">
          <Mountain size={11} className="opacity-80" />
          <span className="truncate">Himalayan Creative Series</span>
        </div>
      </div>
    </div>
  );
};
