import React, { useState } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Sparkles, Bell, RotateCcw, Search, Check, ChevronRight } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { activeTab, setActiveTab, setEditingCampaignId, resetDemoData, metrics, campaigns } = useCampaigns();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Marketing Overview';
      case 'campaigns':
        return 'Campaigns';
      case 'create':
        return 'Create Content';
      case 'approvals':
        return 'Content Approvals';
      case 'calendar':
        return 'Content Calendar';
      case 'assets':
        return 'Creative Library';
      default:
        return 'Dashboard';
    }
  };

  const handleCreateClick = () => {
    setEditingCampaignId(null);
    setActiveTab('create');
  };

  const recentReviews = campaigns.filter(c => c.status === 'Review');

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between z-20 shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          Workspace
        </span>
        <ChevronRight size={14} className="text-stone-400" />
        <span className="font-semibold text-stone-900">{getBreadcrumb()}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button (Unobtrusive) */}
        <div className="relative">
          {showResetConfirm ? (
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs">
              <span className="text-stone-600 px-1 font-medium">Reset sample data?</span>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-2 py-0.5 bg-stone-800 hover:bg-stone-900 text-white rounded font-medium transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-0.5 text-stone-600 hover:text-stone-900 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              title="Reset sample demo campaigns and assets"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {metrics.review > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in">
              <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                <span className="font-semibold text-stone-900">Notifications</span>
                <span className="text-[11px] text-stone-400">{metrics.review} pending</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                {recentReviews.length > 0 ? (
                  recentReviews.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setActiveTab('approvals');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <div className="font-medium text-stone-900">{r.title}</div>
                      <div className="text-stone-500 mt-0.5">
                        Awaiting review for {r.platform} ({r.contentType})
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-stone-400">
                    No pending approval requests
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary + Create Content Button */}
        <button
          type="button"
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        >
          <Sparkles size={15} />
          <span>+ Create Content</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
          <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 text-[#7C3AED] font-bold text-xs flex items-center justify-center">
            MK
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-stone-900 leading-tight">Maya K.</div>
            <div className="text-[10px] text-stone-500">Marketing Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
