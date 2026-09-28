import { Campaign, CreativeAsset } from '../types';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Autumn Trekking Nepal 2026',
    organization: 'Himalayan Guardian Nepal',
    goal: 'Increase awareness about safe autumn trekking conditions, permits, and acclimatization in Nepal.',
    targetAudience: 'International trekkers and adventure enthusiasts planning Nepal expeditions in autumn.',
    platform: 'Instagram',
    contentType: 'Carousel',
    topic: 'Autumn trekking safety & preparation',
    keyMessage: 'Prepare properly for altitude, changing weather conditions, and remote trekking environments.',
    tone: 'Educational',
    additionalInstructions: 'Focus on Annapurna and Everest base camp routes with clear step-by-step guidance.',
    status: 'Scheduled',
    scheduledDate: '2026-09-15',
    scheduledTime: '10:00',
    selectedConceptId: 'c1-1',
    concepts: [
      {
        id: 'c1-1',
        title: 'The Autumn Trail Blueprint: 5 Golden Rules',
        explanation: 'A visual multi-slide breakdown of packing, acclimatization paces, and weather tracking.',
        creativeAngle: 'Pragmatic, empowering mountain safety insights backed by veteran Himalayan guides.'
      },
      {
        id: 'c1-2',
        title: 'Breathe Easy, Trek Farther: Acclimatization Science',
        explanation: 'Explains the biological pacing required between 2,500m and 5,000m elevations.',
        creativeAngle: 'High-contrast informative infographic graphics with real altitude benchmarks.'
      },
      {
        id: 'c1-3',
        title: 'Hidden Variables of Autumn Weather in the Himalayas',
        explanation: 'Highlights morning clear skies versus late-afternoon pass crossings.',
        creativeAngle: 'Cinematic mountain weather photography contrasting serenity with preparation.'
      }
    ],
    headline: 'Your 2026 Autumn Nepal Trek Starts with Preparation, Not Just Packets.',
    caption: 'Clear skies. Crisp Himalayan air. Autumn is the pinnacle season for trekking in Nepal — but high altitude demands deliberate preparation.\n\nSwipe through our 5-part field guide covering:\n1. Acclimatization staging (climb high, sleep low)\n2. Layering systems for sharp day-to-night temperature shifts\n3. Critical communication & satellite check-ins\n4. Hydration and caloric intake benchmarks\n5. Local porter and guide safety coordination\n\nSave this checklist before you step onto the trail. Tap the link in our bio for the free expedition safety manual.',
    creativeDirection: {
      visualConcept: 'Multi-slide warm editorial carousel with high-contrast alpine typography and topographic contour accents.',
      photographyStyle: 'Crisp authentic golden-hour photography of high-altitude trails, trekkers in technical gear, and mist-kissed ridges.',
      composition: 'Slide 1 features a hero mountain vista with clean typography overlay; interior slides use clean numbered cards.',
      mood: 'Inspiring, authoritative, respectful of the mountains, and reassuring.',
      layoutDirection: 'Square 1080x1080 format with consistent margins, subtle altitude indicators, and brand-neutral violet accents.'
    },
    cta: 'Save this guide and download the full 2026 Autumn Checklist in bio.',
    hashtags: ['#NepalTrekking', '#Himalayas2026', '#TrailSafety', '#MountainPreparation', '#AdventureTravel', '#TrekResponsibly'],
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-09-07T11:30:00Z',
    thumbnailTheme: {
      gradient: 'from-amber-600/20 via-violet-600/10 to-indigo-900/20',
      accent: '#7C3AED',
      icon: 'Compass',
      label: 'Autumn Series'
    }
  },
  {
    id: 'camp-2',
    title: 'Nepal Trekking Insurance Awareness',
    organization: 'Himalayan Guardian Nepal',
    goal: 'Educate international travelers on vital insurance clauses for high-altitude rescue and medical evacuation.',
    targetAudience: 'Solo backpackers, guided tour groups, and travel agencies booking Himalayan departures.',
    platform: 'Facebook',
    contentType: 'Advertisement',
    topic: 'Travel insurance & evacuation policy requirements',
    keyMessage: 'Standard travel insurance often caps out at 3,000m. Verify altitude and medical helicopter coverage before departure.',
    tone: 'Authoritative',
    status: 'Review',
    concepts: [
      {
        id: 'c2-1',
        title: 'The 3,000m Insurance Blind Spot',
        explanation: 'Direct cautionary campaign addressing fine print exclusions in standard policies.',
        creativeAngle: 'Clear contrast between generic vacation insurance and specialized mountain medical coverage.'
      },
      {
        id: 'c2-2',
        title: 'Pre-Trip Verification in 3 Simple Steps',
        explanation: 'Actionable policy check: Altitude cap, helicopter dispatch, and direct hospital billing.',
        creativeAngle: 'Checklist-driven ad creative designed to stop social scrolling with vital advisory data.'
      },
      {
        id: 'c2-3',
        title: 'Peace of Mind for Your Loved Ones',
        explanation: 'Focus on family reassurance and emergency protocol readiness in Nepal.',
        creativeAngle: 'Warm, thoughtful narrative centered around traveler security and responsible tourism.'
      }
    ],
    selectedConceptId: 'c2-1',
    headline: 'Does Your Travel Policy Stop at 3,000 Meters? Check Before You Fly.',
    caption: 'Most travel insurance covers lost luggage and delayed flights — but over 65% of standard travel plans exclude medical helicopter evacuation above 3,000 meters.\n\nBefore you pack your crampons or head out on the Annapurna Circuit or Langtang Valley, confirm these 3 non-negotiables with your insurance provider:\n\n1. Explicit high-altitude medical coverage up to 6,000m\n2. Direct-billing emergency helicopter evacuation\n3. Zero cash-upfront rescue guarantees\n\nRead our comprehensive traveler insurance verification handbook.',
    creativeDirection: {
      visualConcept: 'Split composition showing elevation benchmark line versus standard insurance limitations.',
      photographyStyle: 'Clean editorial photo of a remote mountain valley paired with sharp graphic data overlays.',
      composition: 'Bold primary headline anchored on the left; clear 3-bullet advisory box on the right.',
      mood: 'Credible, serious, professional, and protective.',
      layoutDirection: 'Landscape 1200x628 Facebook sponsored card with clear CTA button and trust badge.'
    },
    cta: 'Download the Free Policy Verification Checklist',
    hashtags: ['#TravelSafety', '#NepalTravel', '#TrekkingInsurance', '#HighAltitude', '#SafeTravels'],
    createdAt: '2026-09-04T14:15:00Z',
    updatedAt: '2026-09-08T16:00:00Z',
    thumbnailTheme: {
      gradient: 'from-blue-600/20 via-indigo-600/10 to-slate-900/20',
      accent: '#2563EB',
      icon: 'ShieldCheck',
      label: 'Policy Brief'
    }
  },
  {
    id: 'camp-3',
    title: 'High Altitude Trekking Safety',
    organization: 'Himalayan Guardian Nepal',
    goal: 'Establish thought leadership on responsible high-altitude expedition management and guide ethics.',
    targetAudience: 'Adventure tour operators, sustainable tourism leaders, outdoor industry executives, and expedition planners.',
    platform: 'LinkedIn',
    contentType: 'Educational Post',
    topic: 'Expedition safety protocols & guide welfare',
    keyMessage: 'True safety in high-altitude tourism begins with professional expedition standards and respectful guide care.',
    tone: 'Professional',
    status: 'Published',
    publishedAt: '2026-09-05T14:30:00Z',
    scheduledDate: '2026-09-05',
    scheduledTime: '14:30',
    selectedConceptId: 'c3-1',
    concepts: [
      {
        id: 'c3-1',
        title: 'The Sustainable Expedition Standard',
        explanation: 'Professional perspective on safety ratios, communication devices, and ethical porter weight limits.',
        creativeAngle: 'Industry thought-leadership highlighting operational excellence in the Himalayas.'
      }
    ],
    headline: 'High-Altitude Safety Isn\'t Just Gear — It\'s Protocol, Training, and Human Respect.',
    caption: 'Every year, thousands of trekkers venture into Nepal\'s high mountain passes. While modern satellite communicators and lightweight technical gear have transformed expeditions, the foundational pillar of safety remains operational protocols.\n\nIndustry insights for outdoor operators:\n- Mandatory rest-day staging at 3,500m and 4,200m prevents 85% of acute mountain sickness complications.\n- Real-time satellite communication must be integrated at both guide level and base coordination.\n- Guide and porter safety standards are directly correlated with trekker expedition safety.\n\nHow is your organization elevating safety standards for the upcoming season? Let\'s discuss in the comments below.',
    creativeDirection: {
      visualConcept: 'Executive editorial graphic with refined monochromatic mountain photography and deep violet data accents.',
      photographyStyle: 'Black and white aerial photograph of Himalayan ridgeline with warm natural sunlight.',
      composition: 'Top 60% dedicated to striking imagery; bottom 40% cleanly formatted corporate briefing text.',
      mood: 'Executive, visionary, trustworthy, and grounded.',
      layoutDirection: '1200x627 LinkedIn document card with company mark and structured white spacing.'
    },
    cta: 'Connect with our safety director and review the standard',
    hashtags: ['#SustainableTourism', '#MountainSafety', '#OutdoorLeadership', '#NepalTourism', '#ExpeditionManagement'],
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-09-05T14:30:00Z',
    thumbnailTheme: {
      gradient: 'from-emerald-600/20 via-teal-600/10 to-slate-900/20',
      accent: '#059669',
      icon: 'Award',
      label: 'Industry Standard'
    }
  },
  {
    id: 'camp-4',
    title: 'Comprehensive Tourism Guard Awareness',
    organization: 'Himalayan Guardian Nepal',
    goal: 'Introduce the role of tourism security liaisons and regional safety checkpoints in remote valleys.',
    targetAudience: 'Independent travelers, cultural tourists, and first-time visitors to Nepal.',
    platform: 'Instagram',
    contentType: 'Social Media Post',
    topic: 'Remote safety check-ins and emergency points',
    keyMessage: 'Know where to register your trekking route and how local community checkpoints keep you secure.',
    tone: 'Reassuring',
    status: 'Development',
    selectedConceptId: 'c4-1',
    concepts: [
      {
        id: 'c4-1',
        title: 'Your Guardians Along the Trail',
        explanation: 'Friendly overview of TIMS checkpoints, tourist police booths, and medical posts across popular routes.',
        creativeAngle: 'Human-centered, approachable introduction to the community network protecting trekkers.'
      }
    ],
    headline: 'You Are Never Alone in the Himalayas: Understanding Regional Trail Checkpoints',
    caption: 'From Lukla to Manang, Nepal\'s mountain routes are supported by dedicated community trail liaisons and safety checkpoints.\n\nHere is how the network works:\n- Free check-ins ensure your expedition itinerary is actively tracked across high passes.\n- Certified emergency contact stations have direct radio links to regional response hubs.\n- Local tea-house communities form an interconnected web of support.\n\nKeep your permit handy and always log your arrival at every station.',
    creativeDirection: {
      visualConcept: 'Warm photography of a mountain village checkpoint with welcoming local signage.',
      photographyStyle: 'Natural daylight documentary style, warm earth tones, authentic smiles.',
      composition: 'Subject in mid-ground with Himalayan peaks framing the background.',
      mood: 'Comforting, friendly, communal, and warm.',
      layoutDirection: 'Portrait 1080x1350 for maximum mobile visual impact with clean card captioning.'
    },
    cta: 'Learn more about trail checkpoints at our website',
    hashtags: ['#NepalCommunity', '#SafeTravel', '#TrailGuardians', '#ExploreNepal', '#TrekSafety'],
    createdAt: '2026-09-06T08:00:00Z',
    updatedAt: '2026-09-09T13:45:00Z',
    thumbnailTheme: {
      gradient: 'from-violet-600/20 via-purple-600/10 to-rose-900/20',
      accent: '#7C3AED',
      icon: 'MapPin',
      label: 'Community Focus'
    }
  },
  {
    id: 'camp-5',
    title: 'Nepal Is Still Calling',
    organization: 'Himalayan Guardian Nepal',
    goal: 'Inspire responsible autumn travel with an emphasis on sustainable tourism and local economies.',
    targetAudience: 'Experienced travelers who love cultural immersion and wilderness adventures.',
    platform: 'Instagram',
    contentType: 'Advertisement',
    topic: 'Cultural heritage & autumn wilderness journeys',
    keyMessage: 'Rediscover the unmatched majesty of the Himalayas while traveling responsibly.',
    tone: 'Inspirational',
    status: 'Approved',
    approvedAt: '2026-09-09T15:20:00Z',
    selectedConceptId: 'c5-1',
    concepts: [
      {
        id: 'c5-1',
        title: 'Beyond the Summit: The Spirit of Nepal',
        explanation: 'A poetic celebration of prayer flags, misty dawn valleys, and mountain hospitality.',
        creativeAngle: 'Evocative storytelling that connects emotional travel desire with ethical tourism.'
      }
    ],
    headline: 'Where Ancient Trails Meet Open Skies: Autumn in the Himalayas.',
    caption: 'The peaks stand unchanged, but the journey changes everyone who walks beneath them.\n\nThis autumn, experience Nepal with fresh eyes. From quiet monastic trails in Mustang to high glacial passes beneath Ama Dablam, every step supports local communities, sustainable conservation, and time-honored traditions.\n\nPlan your journey with verified local guides and travel with confidence.',
    creativeDirection: {
      visualConcept: 'Golden sunrise illuminating a prayer-flag draped stupa with snowcapped giants behind.',
      photographyStyle: 'Rich golden morning light, warm colors, deep atmospheric depth.',
      composition: 'Golden ratio composition with prayer flags leading the eye toward the mountain crest.',
      mood: 'Transcendent, awe-inspiring, serene, and inviting.',
      layoutDirection: 'Full-bleed 1080x1350 with elegant centered typography and subtle dark gradient footer.'
    },
    cta: 'Explore Verified Autumn Itineraries',
    hashtags: ['#NepalCalling', '#InspirationalTravel', '#Himalayas', '#MustangValley', '#ResponsibleTravel'],
    createdAt: '2026-09-03T11:20:00Z',
    updatedAt: '2026-09-09T15:20:00Z',
    thumbnailTheme: {
      gradient: 'from-rose-600/20 via-orange-600/10 to-amber-900/20',
      accent: '#E11D48',
      icon: 'Sun',
      label: 'Inspiration'
    }
  },
  {
    id: 'camp-6',
    title: 'Trekking Preparation Checklist',
    organization: 'Himalayan Guardian Nepal',
    goal: 'Provide a downloadable 30-day checklist for trekkers preparing for moderate to difficult trails.',
    targetAudience: 'Prospective travelers preparing their gear and fitness routine 1 to 2 months prior to travel.',
    platform: 'Facebook',
    contentType: 'Educational Post',
    topic: 'Physical conditioning and gear checklist',
    keyMessage: 'Cardiovascular endurance, leg strength, and broken-in boots make all the difference on the trail.',
    tone: 'Friendly',
    status: 'Idea',
    concepts: [
      {
        id: 'c6-1',
        title: 'The 30-Day Trail Fitness Ramp-Up',
        explanation: 'Four weekly benchmarks focusing on stair climbing, weighted pack walks, and mobility.',
        creativeAngle: 'Practical, encouraging fitness routine anyone can do at home or local parks.'
      }
    ],
    headline: 'Your 30-Day Trail Readiness Plan: Step by Step to the Himalayas',
    caption: 'Getting ready for your dream trek in Nepal? The secret to enjoying every mile isn\'t expensive gear — it\'s consistent preparation in the month before you fly.\n\nKey weekly steps:\n- Week 1: Break in your boots on daily walks\n- Week 2: Add stair intervals and core stabilization\n- Week 3: Practice with a 6kg daypack\n- Week 4: Rest, hydrate, and finalize your medical kit\n\nSave this post and comment "TRAIL" for our full printable packing PDF.',
    creativeDirection: {
      visualConcept: 'A clean flat-lay layout of broken-in hiking boots, trekking poles, and a pocket notebook.',
      photographyStyle: 'Top-down natural lighting with wooden rustic surface and clean shadows.',
      composition: 'Organized minimalist grid layout with checklist icons and clear numbers.',
      mood: 'Organized, approachable, motivating, and clean.',
      layoutDirection: 'Landscape 1200x628 Facebook social post with numbered checklist points.'
    },
    cta: 'Comment TRAIL to get the full PDF checklist',
    hashtags: ['#TrekPrep', '#HikingFitness', '#TrailChecklist', '#NepalTrip', '#GetReadyToHike'],
    createdAt: '2026-09-09T10:00:00Z',
    updatedAt: '2026-09-09T10:00:00Z',
    thumbnailTheme: {
      gradient: 'from-cyan-600/20 via-teal-600/10 to-slate-900/20',
      accent: '#0891B2',
      icon: 'CheckSquare',
      label: 'Prep Checklist'
    }
  }
];

export const INITIAL_ASSETS: CreativeAsset[] = [
  {
    id: 'ast-1',
    name: 'Autumn-Trail-Acclimatization-Infographic.png',
    campaignId: 'camp-1',
    campaignTitle: 'Autumn Trekking Nepal 2026',
    type: 'Carousel',
    dimensions: '1080 × 1080 px',
    status: 'Approved',
    usageStatus: 'In Use',
    createdAt: '2026-09-06',
    thumbnailVisual: {
      bg: 'bg-violet-950',
      accent: '#8B5CF6',
      iconName: 'Layers',
      badge: '5 Slides'
    }
  },
  {
    id: 'ast-2',
    name: 'Alpine-Golden-Hour-Pass-Crossing.jpg',
    campaignId: 'camp-1',
    campaignTitle: 'Autumn Trekking Nepal 2026',
    type: 'Image',
    dimensions: '1080 × 1350 px',
    status: 'Approved',
    usageStatus: 'In Use',
    createdAt: '2026-09-05',
    thumbnailVisual: {
      bg: 'bg-amber-950',
      accent: '#F59E0B',
      iconName: 'Image',
      badge: 'Hero Image'
    }
  },
  {
    id: 'ast-3',
    name: 'Insurance-Altitude-Cap-Comparison.png',
    campaignId: 'camp-2',
    campaignTitle: 'Nepal Trekking Insurance Awareness',
    type: 'Advertisement',
    dimensions: '1200 × 628 px',
    status: 'In Review',
    usageStatus: 'Ready',
    createdAt: '2026-09-08',
    thumbnailVisual: {
      bg: 'bg-blue-950',
      accent: '#3B82F6',
      iconName: 'ShieldAlert',
      badge: 'Ad Creative'
    }
  },
  {
    id: 'ast-4',
    name: 'High-Altitude-Safety-Standard-Brief.pdf',
    campaignId: 'camp-3',
    campaignTitle: 'High Altitude Trekking Safety',
    type: 'Document',
    dimensions: 'A4 Document (8 Pages)',
    status: 'Approved',
    usageStatus: 'In Use',
    createdAt: '2026-09-03',
    thumbnailVisual: {
      bg: 'bg-emerald-950',
      accent: '#10B981',
      iconName: 'FileText',
      badge: 'PDF Guide'
    }
  },
  {
    id: 'ast-5',
    name: 'Mustang-Stupa-Sunrise-Prayerflags.jpg',
    campaignId: 'camp-5',
    campaignTitle: 'Nepal Is Still Calling',
    type: 'Image',
    dimensions: '1080 × 1350 px',
    status: 'Approved',
    usageStatus: 'Ready',
    createdAt: '2026-09-07',
    thumbnailVisual: {
      bg: 'bg-rose-950',
      accent: '#F43F5E',
      iconName: 'SunMedium',
      badge: 'Key Visual'
    }
  },
  {
    id: 'ast-6',
    name: 'Trail-Prep-30Day-Graphic.png',
    campaignId: 'camp-6',
    campaignTitle: 'Trekking Preparation Checklist',
    type: 'Story',
    dimensions: '1080 × 1920 px',
    status: 'Draft',
    usageStatus: 'Draft',
    createdAt: '2026-09-09',
    thumbnailVisual: {
      bg: 'bg-cyan-950',
      accent: '#06B6D4',
      iconName: 'Smartphone',
      badge: 'Story Cut'
    }
  }
];

export const DEMO_BRIEF = {
  name: 'Autumn Trekking Nepal 2026',
  organization: 'Himalayan Guardian Nepal',
  goal: 'Increase awareness about safe autumn trekking in Nepal.',
  targetAudience: 'International trekkers planning Nepal trips.',
  platform: 'Instagram' as const,
  contentType: 'Carousel' as const,
  topic: 'Autumn trekking safety',
  keyMessage: 'Prepare properly for altitude, changing weather, and remote trekking environments.',
  tone: 'Educational',
  additionalInstructions: 'Emphasize acclimatization schedules, weather readiness at passes, and emergency protocol registration.'
};
