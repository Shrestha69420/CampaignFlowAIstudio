import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Campaign, CreativeAsset, CampaignStatus, Platform, ContentType } from '../types';
import { INITIAL_CAMPAIGNS, INITIAL_ASSETS } from '../data/sampleData';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface CampaignContextType {
  campaigns: Campaign[];
  assets: CreativeAsset[];
  activeTab: 'dashboard' | 'campaigns' | 'create' | 'approvals' | 'calendar' | 'assets';
  setActiveTab: (tab: 'dashboard' | 'campaigns' | 'create' | 'approvals' | 'calendar' | 'assets') => void;
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  editingCampaignId: string | null;
  setEditingCampaignId: (id: string | null) => void;
  schedulingCampaignId: string | null;
  setSchedulingCampaignId: (id: string | null) => void;
  reviewingCampaignId: string | null;
  setReviewingCampaignId: (id: string | null) => void;
  
  // Actions
  saveCampaign: (campaign: Partial<Campaign> & { title: string }) => Campaign;
  updateCampaignStatus: (id: string, status: CampaignStatus, extra?: Partial<Campaign>) => void;
  requestChanges: (id: string, feedback: string) => void;
  approveCampaign: (id: string) => void;
  scheduleCampaign: (id: string, date: string, time: string, platform?: Platform) => void;
  publishCampaign: (id: string) => void;
  deleteCampaign: (id: string) => void;
  resetDemoData: () => void;
  addAsset: (asset: Omit<CreativeAsset, 'id' | 'createdAt'>) => void;
  
  // Dynamic KPIs
  metrics: {
    total: number;
    draft: number;
    review: number;
    approved: number;
    scheduled: number;
    published: number;
  };
  pipelineCounts: Record<CampaignStatus, number>;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const STORAGE_KEY_CAMPAIGNS = 'campaignflow_campaigns_v1';
const STORAGE_KEY_ASSETS = 'campaignflow_assets_v1';

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load campaigns from storage:', e);
    }
    return INITIAL_CAMPAIGNS;
  });

  const [assets, setAssets] = useState<CreativeAsset[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ASSETS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load assets from storage:', e);
    }
    return INITIAL_ASSETS;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'create' | 'approvals' | 'calendar' | 'assets'>('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [schedulingCampaignId, setSchedulingCampaignId] = useState<string | null>(null);
  const [reviewingCampaignId, setReviewingCampaignId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    } catch (e) {
      console.error('Failed to save campaigns:', e);
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
    } catch (e) {
      console.error('Failed to save assets:', e);
    }
  }, [assets]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save or update campaign
  const saveCampaign = (data: Partial<Campaign> & { title: string }): Campaign => {
    const now = new Date().toISOString();
    let saved: Campaign;

    if (data.id && campaigns.some((c) => c.id === data.id)) {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === data.id) {
            saved = {
              ...c,
              ...data,
              updatedAt: now,
            } as Campaign;
            return saved;
          }
          return c;
        })
      );
      return data as Campaign;
    } else {
      const newId = `camp-${Date.now()}`;
      saved = {
        id: newId,
        title: data.title,
        organization: data.organization || 'Himalayan Guardian Nepal',
        goal: data.goal || '',
        targetAudience: data.targetAudience || '',
        platform: data.platform || 'Instagram',
        contentType: data.contentType || 'Social Media Post',
        topic: data.topic || '',
        keyMessage: data.keyMessage || '',
        tone: data.tone || 'Professional',
        additionalInstructions: data.additionalInstructions || '',
        status: data.status || 'Development',
        concepts: data.concepts || [],
        selectedConceptId: data.selectedConceptId,
        headline: data.headline || '',
        caption: data.caption || '',
        creativeDirection: data.creativeDirection,
        cta: data.cta || '',
        hashtags: data.hashtags || [],
        createdAt: now,
        updatedAt: now,
        thumbnailTheme: {
          gradient: 'from-violet-600/20 via-purple-600/10 to-indigo-950/20',
          accent: '#7C3AED',
          icon: 'Sparkles',
          label: data.topic || 'Campaign'
        }
      };
      setCampaigns((prev) => [saved, ...prev]);
      return saved;
    }
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus, extra: Partial<Campaign> = {}) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            ...extra,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  const requestChanges = (id: string, feedback: string) => {
    updateCampaignStatus(id, 'Development', {
      reviewerFeedback: feedback,
    });
    showToast('Changes requested', 'info');
  };

  const approveCampaign = (id: string) => {
    const now = new Date().toISOString();
    updateCampaignStatus(id, 'Approved', {
      approvedAt: now,
    });
    showToast('Content approved', 'success');
  };

  const scheduleCampaign = (id: string, date: string, time: string, platform?: Platform) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'Scheduled',
            scheduledDate: date,
            scheduledTime: time,
            ...(platform ? { platform } : {}),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast('Post scheduled successfully', 'success');
  };

  const publishCampaign = (id: string) => {
    const now = new Date().toISOString();
    updateCampaignStatus(id, 'Published', {
      publishedAt: now,
    });
    showToast('Post published successfully', 'success');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast('Campaign removed', 'info');
  };

  const resetDemoData = () => {
    setCampaigns(INITIAL_CAMPAIGNS);
    setAssets(INITIAL_ASSETS);
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(INITIAL_ASSETS));
    showToast('Demo data reset to default', 'info');
  };

  const addAsset = (assetData: Omit<CreativeAsset, 'id' | 'createdAt'>) => {
    const newAsset: CreativeAsset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAssets((prev) => [newAsset, ...prev]);
    showToast('Asset added to Creative Library', 'success');
  };

  // Dynamic metrics computed from actual campaign status
  const metrics = useMemo(() => {
    let draft = 0;
    let review = 0;
    let approved = 0;
    let scheduled = 0;
    let published = 0;

    for (const c of campaigns) {
      if (c.status === 'Idea' || c.status === 'Development') {
        draft++;
      } else if (c.status === 'Review') {
        review++;
      } else if (c.status === 'Approved') {
        approved++;
      } else if (c.status === 'Scheduled') {
        scheduled++;
      } else if (c.status === 'Published') {
        published++;
      }
    }

    return {
      total: campaigns.length,
      draft,
      review,
      approved,
      scheduled,
      published,
    };
  }, [campaigns]);

  const pipelineCounts = useMemo<Record<CampaignStatus, number>>(() => {
    const counts: Record<CampaignStatus, number> = {
      Idea: 0,
      Development: 0,
      Review: 0,
      Approved: 0,
      Scheduled: 0,
      Published: 0,
    };
    for (const c of campaigns) {
      if (counts[c.status] !== undefined) {
        counts[c.status]++;
      }
    }
    return counts;
  }, [campaigns]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        assets,
        activeTab,
        setActiveTab,
        selectedCampaignId,
        setSelectedCampaignId,
        editingCampaignId,
        setEditingCampaignId,
        schedulingCampaignId,
        setSchedulingCampaignId,
        reviewingCampaignId,
        setReviewingCampaignId,
        saveCampaign,
        updateCampaignStatus,
        requestChanges,
        approveCampaign,
        scheduleCampaign,
        publishCampaign,
        deleteCampaign,
        resetDemoData,
        addAsset,
        metrics,
        pipelineCounts,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
};
