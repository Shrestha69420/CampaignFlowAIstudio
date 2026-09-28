export type CampaignStatus = 
  | 'Idea' 
  | 'Development' 
  | 'Review' 
  | 'Approved' 
  | 'Scheduled' 
  | 'Published';

export type Platform = 'Instagram' | 'Facebook' | 'LinkedIn';

export type ContentType = 
  | 'Social Media Post' 
  | 'Advertisement' 
  | 'Carousel' 
  | 'Educational Post' 
  | 'Campaign Announcement';

export interface ContentConcept {
  id: string;
  title: string;
  explanation: string;
  creativeAngle: string;
}

export interface CreativeDirection {
  visualConcept: string;
  photographyStyle: string;
  composition: string;
  mood: string;
  layoutDirection: string;
}

export interface Campaign {
  id: string;
  title: string;
  organization: string;
  goal: string;
  targetAudience: string;
  platform: Platform;
  contentType: ContentType;
  topic: string;
  keyMessage: string;
  tone: string;
  additionalInstructions?: string;
  status: CampaignStatus;
  concepts?: ContentConcept[];
  selectedConceptId?: string;
  headline?: string;
  caption?: string;
  creativeDirection?: CreativeDirection;
  cta?: string;
  hashtags?: string[];
  scheduledDate?: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  approvedAt?: string;
  publishedAt?: string;
  reviewerFeedback?: string;
  createdAt: string;
  updatedAt: string;
  thumbnailTheme?: {
    gradient: string;
    accent: string;
    icon: string;
    label: string;
  };
}

export type AssetType = 
  | 'Image' 
  | 'Video' 
  | 'Carousel' 
  | 'Advertisement' 
  | 'Story' 
  | 'Document'
  | 'Photography'
  | 'Infographic'
  | 'Graphic'
  | 'Template'
  | 'Video Still';

export type CreativeAssetType = AssetType;

export interface CreativeAsset {
  id: string;
  name: string;
  campaignId?: string;
  campaignTitle?: string;
  type: AssetType;
  dimensions: string;
  status: 'Approved' | 'In Review' | 'Draft' | 'Archived';
  usageStatus: 'In Use' | 'Ready' | 'Draft' | 'Archived';
  fileSize?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  thumbnailVisual?: {
    bg: string;
    accent: string;
    iconName: string;
    badge: string;
  };
}

export interface GenerateContentRequest {
  name: string;
  organization: string;
  goal: string;
  targetAudience: string;
  platform: Platform;
  contentType: ContentType;
  topic: string;
  keyMessage: string;
  tone: string;
  additionalInstructions?: string;
}

export interface GenerateContentResponse {
  concepts: ContentConcept[];
  headline: string;
  caption: string;
  creativeDirection: CreativeDirection;
  cta: string;
  hashtags: string[];
}
