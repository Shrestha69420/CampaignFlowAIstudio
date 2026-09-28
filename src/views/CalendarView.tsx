import React, { useState, useMemo } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Campaign, Platform, ContentType, CampaignStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PlatformBadge } from '../components/PlatformBadge';
import { CreativeThumbnail } from '../components/CreativeThumbnail';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  Clock,
  ExternalLink,
  Edit2,
  X,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const {
    campaigns,
    scheduleCampaign,
    publishCampaign,
    schedulingCampaignId,
    setSchedulingCampaignId,
    setActiveTab,
    showToast,
  } = useCampaigns();

  // Calendar view mode: Month or Week
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Year and Month state (Default: September 2026 to fit context and demo data)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 0-indexed: 8 is September

  // Filters
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('ALL');

  // Selected calendar item modal / drawer
  const [activeItem, setActiveItem] = useState<Campaign | null>(null);

  // Scheduling Modal state
  const [showScheduleDialog, setShowScheduleDialog] = useState<boolean>(!!schedulingCampaignId);
  const [targetCampaignId, setTargetCampaignId] = useState<string>(schedulingCampaignId || '');
  const [scheduleDate, setScheduleDate] = useState<string>('2026-09-15');
  const [scheduleTime, setScheduleTime] = useState<string>('10:00');
  const [schedulePlatform, setSchedulePlatform] = useState<Platform>('Instagram');

  // Edit schedule modal
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  // Month metadata
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September 2026
  };

  // Filter campaigns
  const calendarCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (!c.scheduledDate) return false;
      if (platformFilter !== 'ALL' && c.platform !== platformFilter) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (contentTypeFilter !== 'ALL' && c.contentType !== contentTypeFilter) return false;
      return true;
    });
  }, [campaigns, platformFilter, statusFilter, contentTypeFilter]);

  // Approved campaigns eligible to schedule
  const approvedCampaigns = campaigns.filter((c) => c.status === 'Approved' || c.status === 'Scheduled');

  // Month grid calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateString = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateString,
        isCurrentMonth: false,
        items: calendarCampaigns.filter((c) => c.scheduledDate === dateString),
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateString,
        isCurrentMonth: true,
        items: calendarCampaigns.filter((c) => c.scheduledDate === dateString),
      });
    }

    // Next month padding to fill grid (35 or 42 cells)
    const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length > 0 ? 42 - days.length : 0);
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateString = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateString,
        isCurrentMonth: false,
        items: calendarCampaigns.filter((c) => c.scheduledDate === dateString),
      });
    }

    return days;
  }, [currentYear, currentMonth, calendarCampaigns]);

  // Open schedule dialog
  const openScheduleModal = (campId?: string) => {
    if (campId) {
      const c = campaigns.find(item => item.id === campId);
      if (c) {
        setTargetCampaignId(c.id);
        setSchedulePlatform(c.platform);
        if (c.scheduledDate) setScheduleDate(c.scheduledDate);
        if (c.scheduledTime) setScheduleTime(c.scheduledTime);
      }
    } else if (approvedCampaigns.length > 0) {
      setTargetCampaignId(approvedCampaigns[0].id);
      setSchedulePlatform(approvedCampaigns[0].platform);
    }
    setShowScheduleDialog(true);
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCampaignId) {
      showToast('Please select a campaign to schedule.', 'warning');
      return;
    }
    if (!scheduleDate) {
      showToast('Please pick a publication date.', 'warning');
      return;
    }

    scheduleCampaign(targetCampaignId, scheduleDate, scheduleTime, schedulePlatform);
    setShowScheduleDialog(false);
    setIsEditingSchedule(false);
    setSchedulingCampaignId(null);
  };

  const handleSimulatePublish = (campaignId: string) => {
    publishCampaign(campaignId);
    if (activeItem && activeItem.id === campaignId) {
      setActiveItem({
        ...activeItem,
        status: 'Published',
        publishedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Content Calendar
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            See what is planned, scheduled, and published.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {approvedCampaigns.length > 0 && (
            <button
              type="button"
              onClick={() => openScheduleModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={16} />
              <span>Schedule Content</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Controls & Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-900 w-44">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded hover:bg-white text-stone-600 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-2.5 py-1 rounded text-xs font-semibold hover:bg-white text-stone-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded hover:bg-white text-stone-600 transition-colors"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* View Mode Toggle (Month / Week) */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-stone-100 p-1 border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'month'
                    ? 'bg-white text-[#7C3AED] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Month View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-[#7C3AED] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Week View
              </button>
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 text-stone-500 font-medium">
            <Filter size={13} />
            <span>Calendar Filters:</span>
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="ALL">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="ALL">Scheduled &amp; Published</option>
            <option value="Scheduled">Scheduled Only</option>
            <option value="Published">Published Only</option>
          </select>

          {/* Content Type */}
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="ALL">All Content Types</option>
            <option value="Social Media Post">Social Media Post</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Carousel">Carousel</option>
            <option value="Educational Post">Educational Post</option>
          </select>

          {(platformFilter !== 'ALL' || statusFilter !== 'ALL' || contentTypeFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setPlatformFilter('ALL');
                setStatusFilter('ALL');
                setContentTypeFilter('ALL');
              }}
              className="text-xs text-[#7C3AED] hover:underline font-medium ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* CALENDAR MONTH GRID */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/70 text-center text-xs font-bold text-stone-500 py-2.5">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Date cells grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-stone-150">
          {calendarDays.map((day, idx) => {
            const isToday = day.dateString === '2026-09-10';

            return (
              <div
                key={idx}
                className={`min-h-[110px] sm:min-h-[130px] p-2 flex flex-col justify-between transition-colors ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-stone-50/40 text-stone-400'
                } ${isToday ? 'bg-purple-50/20' : ''}`}
              >
                {/* Date header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-semibold w-6 h-6 rounded-full ${
                      isToday
                        ? 'bg-[#7C3AED] text-white'
                        : day.isCurrentMonth
                        ? 'text-stone-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {day.items.length > 0 && (
                    <span className="text-[10px] text-stone-400 font-medium">
                      {day.items.length} {day.items.length === 1 ? 'post' : 'posts'}
                    </span>
                  )}
                </div>

                {/* Day events / posts */}
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-24">
                  {day.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      className={`p-1.5 rounded-md border text-left cursor-pointer transition-all hover:shadow-2xs group ${
                        item.status === 'Published'
                          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950 hover:border-emerald-300'
                          : 'bg-indigo-50/90 border-indigo-200 text-indigo-950 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Published' ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                          />
                          {item.platform}
                        </span>
                        {item.scheduledTime && (
                          <span className="text-[10px] text-stone-500 font-mono">
                            {item.scheduledTime}
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-xs truncate group-hover:text-[#7C3AED] transition-colors">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CALENDAR ITEM DETAIL MODAL / DRAWER */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2">
                <StatusBadge status={activeItem.status} size="md" />
                <PlatformBadge platform={activeItem.platform} size="md" />
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="h-44 w-full relative rounded-xl overflow-hidden shadow-inner">
                <CreativeThumbnail
                  title={activeItem.title}
                  category={activeItem.contentType}
                  platform={activeItem.platform}
                  className="h-full rounded-none"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">{activeItem.title}</h3>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span>{activeItem.organization}</span>
                  <span>•</span>
                  <span>{activeItem.contentType}</span>
                </div>
              </div>

              {activeItem.headline && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                    Headline
                  </span>
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">
                    {activeItem.headline}
                  </div>
                </div>
              )}

              {activeItem.caption && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                    Caption
                  </span>
                  <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                    {activeItem.caption}
                  </p>
                </div>
              )}

              {/* Scheduling metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">
                    Scheduled Date
                  </span>
                  <span className="font-bold text-stone-900">{activeItem.scheduledDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">
                    Scheduled Time
                  </span>
                  <span className="font-bold text-stone-900">{activeItem.scheduledTime || '--:--'}</span>
                </div>
              </div>

              {/* Published info */}
              {activeItem.status === 'Published' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Published Successfully</span>
                  </div>
                  {activeItem.publishedAt && (
                    <div className="text-stone-600">
                      Timestamp: {new Date(activeItem.publishedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Demo Notice */}
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
                <AlertCircle size={15} className="text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Demo Mode</span>: Direct social media publishing integration is planned for a future phase.
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {activeItem.status === 'Scheduled' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        openScheduleModal(activeItem.id);
                        setActiveItem(null);
                      }}
                      className="px-3.5 py-2 border border-stone-200 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit Schedule
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulatePublish(activeItem.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} /> Simulate Publish
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE CONTENT DIALOG */}
      {showScheduleDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#7C3AED]" />
                <h3 className="font-bold text-stone-900 text-base">Schedule Content</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowScheduleDialog(false);
                  setSchedulingCampaignId(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Campaign Select */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Approved Campaign
                </label>
                <select
                  value={targetCampaignId}
                  onChange={(e) => {
                    setTargetCampaignId(e.target.value);
                    const c = campaigns.find(item => item.id === e.target.value);
                    if (c) setSchedulePlatform(c.platform);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  {approvedCampaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.platform} • {c.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Publishing Platform */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Instagram', 'Facebook', 'LinkedIn'] as Platform[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSchedulePlatform(p)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        schedulePlatform === p
                          ? 'bg-[#F5F3FF] border-purple-300 text-[#7C3AED] shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Publishing Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Publishing Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-purple-900 text-xs">
                Upon confirmation, campaign status will advance from <strong>Approved</strong> to <strong>Scheduled</strong>.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleDialog(false);
                    setSchedulingCampaignId(null);
                  }}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
