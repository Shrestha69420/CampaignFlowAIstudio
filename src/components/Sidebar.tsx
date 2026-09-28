import React from 'react';
import { useCampaigns } from '../context/CampaignContext';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Building2,
  Compass
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, metrics, setEditingCampaignId } = useCampaigns();

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'campaigns' as const,
      label: 'Campaigns',
      icon: Layers,
      count: metrics.total,
    },
    {
      id: 'create' as const,
      label: 'Create Content',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'approvals' as const,
      label: 'Approvals',
      icon: CheckCircle2,
      badge: metrics.review > 0 ? metrics.review : undefined,
    },
    {
      id: 'calendar' as const,
      label: 'Content Calendar',
      icon: Calendar,
      count: metrics.scheduled,
    },
    {
      id: 'assets' as const,
      label: 'Creative Assets',
      icon: ImageIcon,
    },
  ];

  const handleNavClick = (tabId: typeof activeTab) => {
    if (tabId === 'create') {
      setEditingCampaignId(null); // start fresh if clicked from sidebar
    }
    setActiveTab(tabId);
  };

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Compass size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#18181B] tracking-tight leading-none">
                CampaignFlow
              </h1>
              <p className="text-[11px] font-medium text-[#71717A] mt-1">
                Marketing Workspace
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-[#F5F3FF] text-[#7C3AED]'
                  : 'text-[#71717A] hover:bg-stone-100/70 hover:text-[#18181B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={`transition-colors ${
                    isActive ? 'text-[#7C3AED]' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.badge === undefined && (
                <span className="text-xs text-stone-400 font-normal">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sample Organization Workspace (Small and secondary) */}
      <div className="p-4 border-t border-stone-200 bg-stone-50/70">
        <div className="flex items-start gap-2.5 p-2 rounded-md bg-white border border-stone-200/80 shadow-2xs">
          <div className="w-7 h-7 rounded bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 mt-0.5">
            <Building2 size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-stone-800 truncate leading-tight">
              Himalayan Guardian Nepal
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Sample Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
