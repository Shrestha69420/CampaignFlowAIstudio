/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampaignProvider, useCampaigns } from './context/CampaignContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer } from './components/Toast';

import { DashboardView } from './views/DashboardView';
import { CampaignsView } from './views/CampaignsView';
import { CreateContentView } from './views/CreateContentView';
import { ApprovalsView } from './views/ApprovalsView';
import { CalendarView } from './views/CalendarView';
import { CreativeAssetsView } from './views/CreativeAssetsView';

import { Menu, X, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useCampaigns();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'create':
        return <CreateContentView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'calendar':
        return <CalendarView />;
      case 'assets':
        return <CreativeAssetsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F4F4F5] text-stone-900 overflow-hidden font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden h-14 bg-white border-b border-stone-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xs">
                C
              </div>
              <span className="font-bold text-sm text-stone-900 tracking-tight">CampaignFlow</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-semibold"
          >
            <Sparkles size={13} />
            <span>Create</span>
          </button>
        </div>

        {/* Desktop TopBar */}
        <div className="hidden md:block">
          <TopBar />
        </div>

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto pb-12">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CampaignProvider>
      <AppContent />
    </CampaignProvider>
  );
}
