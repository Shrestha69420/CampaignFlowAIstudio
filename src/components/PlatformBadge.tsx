import React from 'react';
import { Platform } from '../types';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, size = 'md', showLabel = true }) => {
  const iconSize = size === 'sm' ? 13 : 15;

  const config: Record<Platform, { icon: React.ReactNode; text: string; bg: string; color: string; border: string }> = {
    Instagram: {
      icon: <Instagram size={iconSize} className="text-pink-600" />,
      text: 'Instagram',
      bg: 'bg-pink-50',
      color: 'text-pink-700',
      border: 'border-pink-200/80',
    },
    Facebook: {
      icon: <Facebook size={iconSize} className="text-blue-600" />,
      text: 'Facebook',
      bg: 'bg-blue-50',
      color: 'text-blue-700',
      border: 'border-blue-200/80',
    },
    LinkedIn: {
      icon: <Linkedin size={iconSize} className="text-sky-700" />,
      text: 'LinkedIn',
      bg: 'bg-sky-50',
      color: 'text-sky-800',
      border: 'border-sky-200/80',
    },
  };

  const item = config[platform] || config.Instagram;

  if (!showLabel) {
    return (
      <span
        title={platform}
        className={`inline-flex items-center justify-center rounded-md border p-1 ${item.bg} ${item.border}`}
      >
        {item.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium ${item.bg} ${item.color} ${item.border} ${
        size === 'sm' ? 'text-xs' : 'text-xs'
      }`}
    >
      {item.icon}
      <span className="whitespace-nowrap">{item.text}</span>
    </span>
  );
};
