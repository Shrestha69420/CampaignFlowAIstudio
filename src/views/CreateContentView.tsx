import React, { useState, useEffect } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Platform, ContentType, ContentConcept, CreativeDirection, Campaign } from '../types';
import { DEMO_BRIEF } from '../data/sampleData';
import { SocialPreview } from '../components/SocialPreview';
import {
  Sparkles,
  FileDown,
  Save,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Compass,
  Building2,
  Eye,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export const CreateContentView: React.FC = () => {
  const {
    campaigns,
    saveCampaign,
    showToast,
    editingCampaignId,
    setEditingCampaignId,
    setActiveTab,
    setSelectedCampaignId,
  } = useCampaigns();

  // If editing an existing campaign, populate with that; otherwise default empty
  const existingCampaign = editingCampaignId
    ? campaigns.find((c) => c.id === editingCampaignId)
    : null;

  // Form state
  const [name, setName] = useState(existingCampaign?.title || '');
  const [organization, setOrganization] = useState(existingCampaign?.organization || 'Himalayan Guardian Nepal');
  const [goal, setGoal] = useState(existingCampaign?.goal || '');
  const [targetAudience, setTargetAudience] = useState(existingCampaign?.targetAudience || '');
  const [platform, setPlatform] = useState<Platform>(existingCampaign?.platform || 'Instagram');
  const [contentType, setContentType] = useState<ContentType>(existingCampaign?.contentType || 'Carousel');
  const [topic, setTopic] = useState(existingCampaign?.topic || '');
  const [keyMessage, setKeyMessage] = useState(existingCampaign?.keyMessage || '');
  const [tone, setTone] = useState(existingCampaign?.tone || 'Educational');
  const [customTone, setCustomTone] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState(existingCampaign?.additionalInstructions || '');

  // AI Generated output state
  const [concepts, setConcepts] = useState<ContentConcept[]>(existingCampaign?.concepts || []);
  const [selectedConceptId, setSelectedConceptId] = useState<string>(existingCampaign?.selectedConceptId || '');
  const [headline, setHeadline] = useState(existingCampaign?.headline || '');
  const [caption, setCaption] = useState(existingCampaign?.caption || '');
  const [creativeDirection, setCreativeDirection] = useState<CreativeDirection | null>(
    existingCampaign?.creativeDirection || null
  );
  const [cta, setCta] = useState(existingCampaign?.cta || '');
  const [hashtags, setHashtags] = useState<string[]>(existingCampaign?.hashtags || []);
  const [newHashtagInput, setNewHashtagInput] = useState('');

  // Generation UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>([]);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>(platform);

  // Sync preview platform with brief platform selection
  useEffect(() => {
    setPreviewPlatform(platform);
  }, [platform]);

  // Load Demo Brief handler
  const handleLoadDemoBrief = () => {
    setName(DEMO_BRIEF.name);
    setOrganization(DEMO_BRIEF.organization);
    setGoal(DEMO_BRIEF.goal);
    setTargetAudience(DEMO_BRIEF.targetAudience);
    setPlatform(DEMO_BRIEF.platform);
    setContentType(DEMO_BRIEF.contentType);
    setTopic(DEMO_BRIEF.topic);
    setKeyMessage(DEMO_BRIEF.keyMessage);
    setTone(DEMO_BRIEF.tone);
    setAdditionalInstructions(DEMO_BRIEF.additionalInstructions);
    setFormValidationErrors([]);
    showToast('Demo brief loaded', 'info');
  };

  // Generate Content via Server-side Gemini endpoint
  const handleGenerateContent = async () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push('Campaign Name is required.');
    if (!topic.trim()) errors.push('Topic is required.');
    if (!keyMessage.trim()) errors.push('Key Message is required.');

    if (errors.length > 0) {
      setFormValidationErrors(errors);
      return;
    }

    setFormValidationErrors([]);
    setGenerationError(null);
    setIsGenerating(true);

    try {
      const payload = {
        name,
        organization,
        goal,
        targetAudience,
        platform,
        contentType,
        topic,
        keyMessage,
        tone: tone === 'Custom' ? customTone : tone,
        additionalInstructions,
      };

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with content generator');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Populate structured state
      if (Array.isArray(data.concepts) && data.concepts.length > 0) {
        setConcepts(data.concepts);
        setSelectedConceptId(data.concepts[0].id);
      }
      if (data.headline) setHeadline(data.headline);
      if (data.caption) setCaption(data.caption);
      if (data.creativeDirection) setCreativeDirection(data.creativeDirection);
      if (data.cta) setCta(data.cta);
      if (Array.isArray(data.hashtags)) setHashtags(data.hashtags);

      showToast('Content generated with AI', 'success');
    } catch (err: any) {
      console.error('Error generating content:', err);
      setGenerationError("We couldn't generate content right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Hashtag management
  const handleAddHashtag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const tag = newHashtagInput.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(`#${tag}`)) {
      setHashtags([...hashtags, `#${tag}`]);
      setNewHashtagInput('');
    }
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  // Save Draft (Status: Development)
  const handleSaveDraft = () => {
    if (!name.trim()) {
      setFormValidationErrors(['Please provide a Campaign Name to save a draft.']);
      return;
    }

    const saved = saveCampaign({
      id: existingCampaign?.id,
      title: name,
      organization,
      goal,
      targetAudience,
      platform,
      contentType,
      topic,
      keyMessage,
      tone: tone === 'Custom' ? customTone : tone,
      additionalInstructions,
      status: 'Development',
      concepts,
      selectedConceptId,
      headline,
      caption,
      creativeDirection: creativeDirection || undefined,
      cta,
      hashtags,
    });

    showToast('Draft saved', 'success');
    setSelectedCampaignId(saved.id);
    setActiveTab('campaigns');
  };

  // Submit for Review (Status: Review)
  const handleSubmitForReview = () => {
    if (!name.trim()) {
      setFormValidationErrors(['Please provide a Campaign Name.']);
      return;
    }
    if (!caption.trim() && !headline.trim()) {
      setFormValidationErrors(['Please generate or write a headline and caption before submitting for human review.']);
      return;
    }

    const saved = saveCampaign({
      id: existingCampaign?.id,
      title: name,
      organization,
      goal,
      targetAudience,
      platform,
      contentType,
      topic,
      keyMessage,
      tone: tone === 'Custom' ? customTone : tone,
      additionalInstructions,
      status: 'Review',
      concepts,
      selectedConceptId,
      headline,
      caption,
      creativeDirection: creativeDirection || undefined,
      cta,
      hashtags,
    });

    showToast('Content submitted for review', 'success');
    setActiveTab('approvals');
  };

  const platforms: Platform[] = ['Instagram', 'Facebook', 'LinkedIn'];
  const contentTypes: ContentType[] = [
    'Social Media Post',
    'Advertisement',
    'Carousel',
    'Educational Post',
    'Campaign Announcement',
  ];
  const tones = [
    'Educational',
    'Professional',
    'Inspirational',
    'Friendly',
    'Authoritative',
    'Reassuring',
    'Custom',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Create Content
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Turn a marketing brief into review-ready campaign content.
          </p>
        </div>

        {/* Demo Helper Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadDemoBrief}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <FileDown size={14} className="text-[#7C3AED]" />
            <span>Load Demo Brief</span>
          </button>
        </div>
      </div>

      {/* Validation banner */}
      {formValidationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <AlertCircle size={14} className="text-amber-600" />
            <span>Please complete required brief fields:</span>
          </div>
          <ul className="list-disc list-inside pl-1 text-amber-800 space-y-0.5">
            {formValidationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Campaign Brief Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-base">Campaign Brief</h3>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Input Parameters
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Campaign Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Autumn Trekking Nepal 2026"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Organization
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Himalayan Guardian Nepal"
                  className="w-full pl-8 pr-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
                />
                <Building2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            {/* Platform Segmented Chips */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Target Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
                      platform === p
                        ? 'bg-[#F5F3FF] border-purple-300 text-[#7C3AED] font-semibold shadow-2xs'
                        : 'border-stone-200 bg-stone-50/70 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Type Select */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
              >
                {contentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Goal */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Campaign Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Increase awareness about safe autumn trekking in Nepal."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., International trekkers planning Nepal trips."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
              />
            </div>

            {/* Topic & Key Message */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Topic <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Autumn trekking safety"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Key Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={keyMessage}
                onChange={(e) => setKeyMessage(e.target.value)}
                placeholder="e.g., Prepare properly for altitude, changing weather, and remote trekking environments."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all resize-none"
              />
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tone of Voice
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      tone === t
                        ? 'bg-purple-100 text-purple-900 font-semibold border border-purple-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 border border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tone === 'Custom' && (
                <input
                  type="text"
                  value={customTone}
                  onChange={(e) => setCustomTone(e.target.value)}
                  placeholder="Enter custom tone (e.g., Direct, Urgent, Warm)..."
                  className="mt-2 w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                />
              )}
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Additional Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Specific guidance for the creative team or AI generator..."
                className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all resize-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Content Assistant & Editable Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Generator Control Box */}
          <div className="bg-gradient-to-r from-violet-50/70 via-purple-50/40 to-stone-50 rounded-xl border border-purple-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#7C3AED]" />
                <h3 className="font-bold text-stone-900 text-base">
                  AI Content Assistant
                </h3>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Turn your campaign brief into editable content ideas.
              </p>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateContent}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-purple-300 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>

          {/* AI Loading State */}
          {isGenerating && (
            <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-2xs text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto animate-pulse">
                <Sparkles size={24} />
              </div>
              <h4 className="font-bold text-stone-900 text-base">
                Generating your campaign content...
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Creating concepts, copy, and creative direction.
              </p>
              <div className="pt-2 flex justify-center">
                <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED] animate-indeterminate" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          )}

          {/* AI Error State */}
          {generationError && !isGenerating && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{generationError}</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateContent}
                className="font-semibold text-rose-700 hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* GENERATED CONCEPTS */}
          {concepts.length > 0 && !isGenerating && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Content Concepts
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Select the winning angle to guide your draft.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  3 Concepts Generated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {concepts.map((conc, idx) => {
                  const isSelected = selectedConceptId === conc.id;
                  return (
                    <div
                      key={conc.id || idx}
                      onClick={() => setSelectedConceptId(conc.id)}
                      className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#7C3AED] bg-purple-50/50 shadow-2xs ring-1 ring-[#7C3AED]'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono text-stone-400">
                            Concept 0{idx + 1}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-[#7C3AED] flex items-center gap-0.5">
                              <CheckCircle2 size={11} /> Selected
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-stone-900 text-xs leading-snug">
                          {conc.title}
                        </h5>
                        <p className="text-[11px] text-stone-600 mt-1 line-clamp-3 leading-relaxed">
                          {conc.explanation}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-stone-150 text-[10px] text-stone-500 italic">
                        Angle: {conc.creativeAngle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RECOMMENDED HEADLINE */}
          {(headline || concepts.length > 0) && !isGenerating && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-2">
                  <span>Recommended Headline</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-semibold uppercase tracking-wider">
                    AI Draft
                  </span>
                </label>
                <span className="text-[11px] text-stone-400">Editable</span>
              </div>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter headline..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-stone-950 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-stone-50/30 focus:bg-white transition-all"
              />
            </div>
          )}

          {/* DRAFT CAPTION */}
          {(caption || concepts.length > 0) && !isGenerating && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-2">
                  <span>Draft Caption</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-semibold uppercase tracking-wider">
                    AI Draft
                  </span>
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  {caption.length} characters
                </span>
              </div>
              <textarea
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write or edit caption..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-stone-50/30 focus:bg-white transition-all leading-relaxed"
              />
            </div>
          )}

          {/* CREATIVE DIRECTION */}
          {creativeDirection && !isGenerating && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass size={16} className="text-[#7C3AED]" />
                  <h4 className="font-bold text-stone-900 text-sm">
                    Creative Direction
                  </h4>
                </div>
                <span className="text-[11px] text-stone-400">Design Team Guidance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                  <span className="font-semibold text-stone-700 block mb-0.5">Visual Concept</span>
                  <p className="text-stone-600 leading-relaxed">{creativeDirection.visualConcept}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                  <span className="font-semibold text-stone-700 block mb-0.5">Photography / Imagery</span>
                  <p className="text-stone-600 leading-relaxed">{creativeDirection.photographyStyle}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                  <span className="font-semibold text-stone-700 block mb-0.5">Composition</span>
                  <p className="text-stone-600 leading-relaxed">{creativeDirection.composition}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-150">
                  <span className="font-semibold text-stone-700 block mb-0.5">Mood</span>
                  <p className="text-stone-600 leading-relaxed">{creativeDirection.mood}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-150 text-xs">
                <span className="font-semibold text-stone-700 block mb-0.5">Layout Direction</span>
                <p className="text-stone-600 leading-relaxed">{creativeDirection.layoutDirection}</p>
              </div>
            </div>
          )}

          {/* CTA AND HASHTAGS */}
          {(cta || hashtags.length > 0 || concepts.length > 0) && !isGenerating && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
              {/* CTA */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Suggested CTA
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g., Download the 2026 Trail Checklist in bio"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Suggested Hashtags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-mono border border-stone-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="text-stone-400 hover:text-stone-700"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHashtagInput}
                    onChange={(e) => setNewHashtagInput(e.target.value)}
                    onKeyDown={handleAddHashtag}
                    placeholder="Add custom hashtag..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHashtag}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SOCIAL CONTENT PREVIEW */}
          <div className="space-y-2">
            <SocialPreview
              title={name || 'Campaign Title'}
              organization={organization}
              headline={headline}
              caption={caption}
              cta={cta}
              hashtags={hashtags}
              platform={previewPlatform}
              contentType={contentType}
              onPlatformChange={(p) => setPreviewPlatform(p)}
              allowToggle={true}
            />
          </div>

          {/* WORKSPACE ACTIONS (Strictly Save Draft & Submit for Review) */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Human review is mandatory before scheduling or publishing.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Save size={15} />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitForReview}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Send size={15} />
                <span>Submit for Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
