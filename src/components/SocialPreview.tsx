import React, { useState } from 'react';
import { Platform, ContentType } from '../types';
import { CreativeThumbnail } from './CreativeThumbnail';
import { Instagram, Facebook, Linkedin, Heart, MessageCircle, Send, Bookmark, ThumbsUp, Share2, MoreHorizontal, Globe, ExternalLink } from 'lucide-react';

interface SocialPreviewProps {
  title: string;
  organization?: string;
  headline?: string;
  caption?: string;
  cta?: string;
  hashtags?: string[];
  platform: Platform;
  contentType?: ContentType;
  onPlatformChange?: (platform: Platform) => void;
  allowToggle?: boolean;
}

export const SocialPreview: React.FC<SocialPreviewProps> = ({
  title,
  organization = 'Himalayan Guardian Nepal',
  headline,
  caption,
  cta,
  hashtags = [],
  platform: initialPlatform,
  contentType = 'Social Media Post',
  onPlatformChange,
  allowToggle = true,
}) => {
  const [activePlatform, setActivePlatform] = useState<Platform>(initialPlatform);

  const handlePlatformClick = (p: Platform) => {
    setActivePlatform(p);
    if (onPlatformChange) {
      onPlatformChange(p);
    }
  };

  const displayPlatform = allowToggle ? activePlatform : initialPlatform;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Header bar with platform selector */}
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
          Content Preview
        </span>
        {allowToggle && (
          <div className="inline-flex rounded-lg bg-stone-200/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => handlePlatformClick('Instagram')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                displayPlatform === 'Instagram'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Instagram size={13} className="text-pink-600" />
              <span>Instagram</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformClick('Facebook')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                displayPlatform === 'Facebook'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Facebook size={13} className="text-blue-600" />
              <span>Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => handlePlatformClick('LinkedIn')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                displayPlatform === 'LinkedIn'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Linkedin size={13} className="text-sky-700" />
              <span>LinkedIn</span>
            </button>
          </div>
        )}
      </div>

      {/* Social Post Mockup Card */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto bg-stone-50/40">
        <div className="max-w-md mx-auto bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden text-sm">
          {/* Mock Header */}
          <div className="p-3.5 flex items-center justify-between border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs border border-violet-200">
                HG
              </div>
              <div>
                <div className="font-semibold text-stone-900 text-xs flex items-center gap-1">
                  {organization}
                  <span className="text-[10px] text-stone-400">• Follow</span>
                </div>
                <div className="text-[10px] text-stone-500 flex items-center gap-1">
                  <span>Sponsored</span>
                  <span>•</span>
                  <Globe size={10} />
                </div>
              </div>
            </div>
            <button type="button" className="text-stone-400 hover:text-stone-600">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Post Creative Card */}
          <div className="w-full">
            <CreativeThumbnail
              title={title || 'Campaign Title'}
              category={contentType}
              platform={displayPlatform}
              aspectRatio={displayPlatform === 'Instagram' ? 'square' : 'video'}
            />
          </div>

          {/* Social Post Body */}
          <div className="p-3.5 sm:p-4 space-y-3">
            {/* Interaction icons for Instagram / Facebook */}
            {displayPlatform === 'Instagram' ? (
              <div className="flex items-center justify-between text-stone-700 pb-1">
                <div className="flex items-center gap-3">
                  <Heart size={18} className="hover:text-rose-500 cursor-pointer" />
                  <MessageCircle size={18} className="cursor-pointer" />
                  <Send size={18} className="cursor-pointer" />
                </div>
                <Bookmark size={18} className="cursor-pointer" />
              </div>
            ) : displayPlatform === 'LinkedIn' ? (
              <div className="flex items-center gap-4 text-xs text-stone-600 border-b border-stone-100 pb-2">
                <span className="flex items-center gap-1 cursor-pointer hover:text-stone-900 font-medium">
                  <ThumbsUp size={14} className="text-sky-600" /> Like
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-stone-900 font-medium">
                  <MessageCircle size={14} /> Comment
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-stone-900 font-medium">
                  <Share2 size={14} /> Repost
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-100 pb-2">
                <span className="flex items-center gap-1.5 cursor-pointer hover:text-stone-900 font-medium">
                  <ThumbsUp size={14} className="text-blue-600" /> Like
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-stone-900 font-medium">
                  <MessageCircle size={14} /> Comment
                </span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-stone-900 font-medium">
                  <Share2 size={14} /> Share
                </span>
              </div>
            )}

            {/* Headline */}
            {headline && (
              <div className="font-bold text-stone-950 text-sm leading-snug">
                {headline}
              </div>
            )}

            {/* Caption */}
            {caption ? (
              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line break-words">
                {caption}
              </p>
            ) : (
              <p className="text-xs text-stone-400 italic">
                Generate or edit caption in the workspace to preview here.
              </p>
            )}

            {/* CTA button inside preview */}
            {cta && (
              <div className="pt-1">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{cta}</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            )}

            {/* Hashtags */}
            {hashtags && hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {hashtags.map((ht, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium text-violet-700 hover:underline"
                  >
                    {ht.startsWith('#') ? ht : `#${ht}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
