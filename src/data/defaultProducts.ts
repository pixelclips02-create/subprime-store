import { CategoryInfo, Product, StoreSettings, CheckoutSettings } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All Subscriptions', icon: 'Grid', description: 'Explore all premium subscriptions & deals' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', description: 'Netflix, YouTube, Spotify & Crunchyroll streaming' },
  { id: 'ai_dev', name: 'AI & Developer', icon: 'Cpu', description: 'ChatGPT, Grok, Bolt, Lovable, n8n, Wispr & ElevenLabs' },
  { id: 'education_creative', name: 'Education & Creative', icon: 'GraduationCap', description: 'Coursera, Canva Edu, Adobe CC, Figma, CapCut & edX' },
  { id: 'career_productivity', name: 'Career & Business', icon: 'Briefcase', description: 'LinkedIn Career & Business, Microsoft 365 Personal' },
  { id: 'vpn', name: 'VPN Services', icon: 'Shield', description: 'High-speed secure VPNs for privacy and streaming' },
];

export const DEFAULT_CHECKOUT_SETTINGS: CheckoutSettings = {
  fullName: {
    enabled: true,
    required: true,
    label: 'Full Name',
    placeholder: 'John Doe',
    helperText: 'For your invoice and customer order record'
  },
  deliveryEmail: {
    enabled: true,
    required: true,
    label: 'Delivery Email Address',
    placeholder: 'john@example.com',
    helperText: 'Where digital invoice and delivery details are sent'
  },
  activationEmail: {
    enabled: true,
    required: false,
    label: 'Account Email / ID for Activation',
    placeholder: 'e.g. Canva, Coursera, or YouTube account email',
    helperText: 'Provide if different from your delivery email'
  },
  accountPassword: {
    enabled: true,
    required: false,
    label: 'Existing Account Password / Access PIN',
    placeholder: 'Account password (if activation requires logging in)',
    helperText: 'Required if you want us to log into your account to activate/upgrade'
  },
  redditUsername: {
    enabled: true,
    required: false,
    label: 'Reddit Username',
    placeholder: 'u/YourUsername',
    helperText: 'For 1-click Reddit DM communication and payment'
  },
  telegramOrWhatsapp: {
    enabled: true,
    required: false,
    label: 'Telegram or WhatsApp',
    placeholder: '@handle or phone number with country code',
    helperText: 'Alternative direct contact handle'
  },
  paymentNotes: {
    enabled: true,
    required: false,
    label: 'Preferred Payment Method / Notes',
    placeholder: 'e.g. Crypto (USDT/SOL/BTC), PayPal, CashApp, UPI',
    helperText: 'Preferred payment currency and any instructions'
  },
  customField: {
    enabled: false,
    required: false,
    label: 'Additional Order Requirement',
    placeholder: 'Enter additional required detail...',
    helperText: 'Extra detail requested by store owner'
  },
  checkoutNoticeText: 'Direct Reddit Payment Flow: Enter your details below. When you confirm, we will notify the seller and immediately open a Reddit DM with your items pre-filled so you can pay and get activated right on Reddit!'
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SubPrime Digital',
  sellerEmail: 'orders@yourdomain.com', // Developer can update live
  redditUsername: 'Embarrassed_Page8733',
  redditSubreddit: 'u/Embarrassed_Page8733',
  currencySymbol: '$',
  contactEmail: 'support@yourdomain.com',
  customRequestsEnabled: true,
  announcementText: '🚀 Genuine Activations • Official Links • Activation On Your Email Available • Fast Delivery',
  developerPin: '022005',
  checkoutSettings: DEFAULT_CHECKOUT_SETTINGS
};

export const DEFAULT_PRODUCTS: Product[] = [
  // AI & DEV - ChatGPT (Demonstrating Out of Stock as requested by user!)
  {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus / OpenAI Team',
    subtitle: 'GPT-4o, Canvas, DALL-E & Advanced Voice',
    category: 'ai_dev',
    description: 'Official ChatGPT Plus access with full access to GPT-4o, reasoning models, custom GPTs, code execution, and high-speed priority servers.',
    features: [
      'Access to GPT-4o, GPT-4 and Canvas',
      'High-speed response time with zero queues',
      'DALL-E 3 image generation included',
      'Advanced data analysis & file uploads',
      'Activation on your own email / Private'
    ],
    plans: [
      { id: 'chatgpt-1m', label: '1 Month Plan', price: 16, originalPrice: 20 },
      { id: 'chatgpt-3m', label: '3 Months Plan', price: 45, originalPrice: 60 }
    ],
    inStock: false, // OUT OF STOCK by default to showcase the feature!
    badge: 'Popular AI',
    rating: 4.9,
    reviewCount: 382,
    activationType: 'email',
    activationDetails: 'Activation on your own email or private account credential',
    iconName: 'Bot',
    tags: ['ai', 'chatgpt', 'openai', 'gpt4', 'writing']
  },

  // ENTERTAINMENT - YouTube Premium
  {
    id: 'youtube-premium',
    title: 'YouTube Premium',
    subtitle: '12 Months Official Activation Link',
    category: 'entertainment',
    description: 'Official YouTube Premium 12-Month individual activation link. Enjoy ad-free video, background play, and full access to YouTube Music Premium.',
    features: [
      'Direct Individual Activation',
      'Official Activation Link delivered instantly',
      'No Family Invite Required',
      'No Password Needed — safe & 100% private',
      'Full YouTube Music Premium included'
    ],
    plans: [
      { id: 'yt-12m', label: '12 Months Plan', price: 38, originalPrice: 140 }
    ],
    inStock: true,
    badge: "Amazon's Choice",
    rating: 5.0,
    reviewCount: 524,
    activationType: 'link',
    activationDetails: 'Direct official activation link sent to your email / Reddit DM. No password needed.',
    iconName: 'Youtube',
    tags: ['youtube', 'streaming', 'music', 'ad-free', 'entertainment'],
    checkoutConfig: {
      useCustomRules: true,
      passwordRequirement: 'hidden',
      activationEmailRequirement: 'optional',
      activationEmailLabel: 'YouTube Google Account Email',
      customFieldRequirement: 'hidden',
      checkoutNotice: 'Official YouTube activation link will be delivered directly. No account password required.'
    }
  },

  // ENTERTAINMENT - Netflix
  {
    id: 'netflix-premium',
    title: 'Netflix Premium 4K UHD',
    subtitle: 'Private Account • No Sharing',
    category: 'entertainment',
    description: 'Ultra HD 4K Netflix streaming. Completely private account with your own personalized profiles, watch history, and download capabilities.',
    features: [
      'Private Account (No sharing / no screen limits)',
      'Ultra HD 4K + HDR streaming quality',
      'Download shows for offline viewing on all devices',
      'Full warranty & instant replacement support'
    ],
    plans: [
      { id: 'netflix-1m', label: '1 Month', price: 13, originalPrice: 23 },
      { id: 'netflix-12m', label: '12 Months (Best Value)', price: 115, originalPrice: 240 }
    ],
    inStock: true,
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 468,
    activationType: 'account',
    activationDetails: 'Private account credentials delivered with 100% warranty.',
    iconName: 'Film',
    tags: ['netflix', 'movies', 'series', '4k', 'entertainment'],
    checkoutConfig: {
      useCustomRules: true,
      passwordRequirement: 'required',
      passwordLabel: 'Netflix Account Password / PIN',
      passwordHelperText: 'Required if you want us to log in and apply the 12-Month UHD upgrade',
      activationEmailRequirement: 'required',
      activationEmailLabel: 'Netflix Account Email',
      customFieldRequirement: 'optional',
      customFieldLabel: 'Profile Name to Upgrade',
      customFieldPlaceholder: 'e.g. Profile 1',
      checkoutNotice: '⚠️ Important: Please ensure 2FA is temporarily turned off or be ready to send the verification code on Reddit DM.'
    }
  },

  // ENTERTAINMENT - Spotify Premium
  {
    id: 'spotify-premium',
    title: 'Spotify Premium Individual',
    subtitle: 'Ad-free high-fidelity music streaming',
    category: 'entertainment',
    description: 'Unlimited ad-free music, podcasts, offline downloads, and lossless audio streaming across all your smartphones, desktop, and smart speakers.',
    features: [
      'Listen to music ad-free without limits',
      'Download songs for offline listening',
      'High fidelity 320kbps audio quality',
      'Play any track with unlimited skips'
    ],
    plans: [
      { id: 'spotify-yearly', label: 'Full Access Plan', price: 30, originalPrice: 120 }
    ],
    inStock: true,
    badge: 'Hot Deal',
    rating: 4.8,
    reviewCount: 295,
    activationType: 'email',
    activationDetails: 'Direct upgrade / activation on your existing account or fresh private profile.',
    iconName: 'Music',
    tags: ['spotify', 'music', 'audio', 'streaming', 'podcasts']
  },

  // ENTERTAINMENT - Crunchyroll Mega Fan
  {
    id: 'crunchyroll-mega',
    title: 'Crunchyroll Mega Fan',
    subtitle: 'Ad-free Anime with offline viewing & 4 streams',
    category: 'entertainment',
    description: 'Stream thousands of anime episodes and simulcasts straight from Japan in 1080p HD, with zero ads and multi-device streaming.',
    features: [
      'No ads on entire Crunchyroll catalog',
      'Simulcast episodes 1 hour after Japan airing',
      'Stream on 4 concurrent devices',
      'Offline viewing enabled'
    ],
    plans: [
      { id: 'crunchyroll-plan', label: '12 Months Mega Fan', price: 28, originalPrice: 80 }
    ],
    inStock: true,
    badge: 'Anime Fan Choice',
    rating: 4.8,
    reviewCount: 167,
    activationType: 'account',
    activationDetails: 'Private account or activation link delivered upon order.',
    iconName: 'Tv',
    tags: ['crunchyroll', 'anime', 'manga', 'streaming']
  },

  // CAREER - LinkedIn Premium Career
  {
    id: 'linkedin-career',
    title: 'LinkedIn Premium Career',
    subtitle: '3 Months / Yearly Activation Link',
    category: 'career_productivity',
    description: 'Accelerate your job search. See who viewed your profile, message recruiters with InMail credits, access LinkedIn Learning, and get competitive applicant insights.',
    features: [
      'Official Activation Link delivered directly',
      '5 InMail messages per month to reach any hiring manager',
      'See who viewed your profile in the last 365 days',
      'Full access to 20,000+ LinkedIn Learning courses',
      'Applicant insights & salary comparisons'
    ],
    plans: [
      { id: 'linkedin-career-yr', label: 'Yearly Activation Link', price: 65, originalPrice: 240 }
    ],
    inStock: true,
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 312,
    activationType: 'link',
    activationDetails: 'Official LinkedIn redemption link applied directly to your own LinkedIn profile.',
    iconName: 'Linkedin',
    tags: ['linkedin', 'career', 'job', 'inmail', 'networking']
  },

  // CAREER - LinkedIn Premium Business
  {
    id: 'linkedin-business',
    title: 'LinkedIn Premium Business',
    subtitle: '12 Months Activation Link',
    category: 'career_productivity',
    description: 'Grow your business network and client pipeline. Get 15 InMails per month, unlimited people browsing, deep company insights, and lead search tools.',
    features: [
      '12 Months Official Activation Link',
      '15 InMail credits every month',
      'Unlimited people search & profile browsing',
      'Comprehensive company insights & employee headcount growth',
      'Activation applied directly to your account'
    ],
    plans: [
      { id: 'linkedin-business-yr', label: '12 Months Plan', price: 80, originalPrice: 480 }
    ],
    inStock: true,
    badge: 'Top Tier Business',
    rating: 5.0,
    reviewCount: 220,
    activationType: 'link',
    activationDetails: 'Official 12-month LinkedIn Business voucher link directly to your existing account.',
    iconName: 'Briefcase',
    tags: ['linkedin', 'business', 'leads', 'inmail', 'sales']
  },

  // CAREER - Microsoft 365 Personal
  {
    id: 'microsoft-365',
    title: 'Microsoft 365 Personal',
    subtitle: 'Private Account with 1TB OneDrive Cloud',
    category: 'career_productivity',
    description: 'Full Microsoft Office suite (Word, Excel, PowerPoint, Outlook, OneNote) plus 1 TB secure OneDrive cloud storage for 5 devices simultaneously.',
    features: [
      'Private Account with full ownership',
      'Premium Word, Excel, PowerPoint, Outlook',
      '1 TB OneDrive secure cloud storage',
      'Install on up to 5 PCs/Macs, tablets & phones simultaneously',
      'Advanced security against malware & phishing'
    ],
    plans: [
      { id: 'ms365-personal', label: 'Personal License', price: 20, originalPrice: 70 }
    ],
    inStock: true,
    badge: "Amazon's Choice",
    rating: 4.9,
    reviewCount: 410,
    activationType: 'account',
    activationDetails: 'Private account credentials with full password change rights.',
    iconName: 'FileText',
    tags: ['microsoft', 'office', 'word', 'excel', 'onedrive', 'productivity']
  },

  // EDUCATION - Coursera
  {
    id: 'coursera-plus',
    title: 'Coursera Plus',
    subtitle: 'Activation on Your Own Email',
    category: 'education_creative',
    description: 'Unlimited access to 7,000+ world-class courses, hands-on projects, and job-ready certificates from Google, IBM, Meta, Yale, and Stanford.',
    features: [
      'Activation directly on your personal email',
      'Earn accredited Professional Certificates & Specializations',
      'Learn at your own pace with unlimited course enrollment',
      'Hands-on interactive projects and graded assignments'
    ],
    plans: [
      { id: 'coursera-yr', label: '1 Year Plan', price: 35, originalPrice: 399 }
    ],
    inStock: true,
    badge: 'Popular Edu',
    rating: 4.9,
    reviewCount: 264,
    activationType: 'email',
    activationDetails: 'Direct invite/upgrade on your personal Coursera email address.',
    iconName: 'GraduationCap',
    tags: ['coursera', 'learning', 'certificates', 'degrees', 'education']
  },

  // EDUCATION - edX Enterprise
  {
    id: 'edx-enterprise',
    title: 'edX Enterprise',
    subtitle: 'Harvard, MIT & top university learning',
    category: 'education_creative',
    description: 'Access premier courses and verified certifications from the world’s leading universities including Harvard, MIT, and Oxford.',
    features: [
      'University-level instruction from top faculty',
      'Verified certificates upon completion',
      'STEM, Data Science, AI, and Business pathways'
    ],
    plans: [
      { id: 'edx-full', label: 'Enterprise Access', price: 10, originalPrice: 99 }
    ],
    inStock: true,
    badge: 'Value Pick',
    rating: 4.7,
    reviewCount: 142,
    activationType: 'email',
    activationDetails: 'Enterprise invitation or account setup on your email.',
    iconName: 'BookOpen',
    tags: ['edx', 'courses', 'mit', 'harvard', 'education']
  },

  // DESIGN - Canva Edu Pro
  {
    id: 'canva-edu-pro',
    title: 'Canva Edu Pro',
    subtitle: 'Brand Kit + Magic AI Features Included',
    category: 'education_creative',
    description: 'Unlock 100M+ premium stock photos, graphics, videos, audio tracks, brand kits, background remover, and all Magic Studio AI tools.',
    features: [
      'Brand Kit Included (Custom fonts, colors, logos)',
      'Magic Studio AI Features included (AI Magic Resize, Eraser, Expand)',
      '100M+ premium templates, photos, and graphic assets',
      '1-Click Background Remover for photos and videos',
      'Activation on your own email'
    ],
    plans: [
      { id: 'canva-yr', label: '1 Year Access', price: 10, originalPrice: 120 }
    ],
    inStock: true,
    badge: 'Top Seller',
    rating: 5.0,
    reviewCount: 680,
    activationType: 'email',
    activationDetails: 'Direct invitation to your existing personal Canva email.',
    iconName: 'Palette',
    tags: ['canva', 'design', 'graphics', 'ai', 'brandkit', 'creative']
  },

  // DESIGN - Figma Pro EDU
  {
    id: 'figma-pro-edu',
    title: 'Figma Pro EDU',
    subtitle: 'Details Changeable • Unlimited Files & Version History',
    category: 'education_creative',
    description: 'Industry-standard UI/UX collaborative design tool with unlimited Figma and FigJam files, unlimited version history, and shared team libraries.',
    features: [
      'Details Changeable — 100% control of the account',
      'Unlimited Figma files & FigJam whiteboards',
      'Unlimited version history & cloud rollbacks',
      'Shared team component libraries and design tokens'
    ],
    plans: [
      { id: 'figma-yr', label: '1 Year Plan', price: 25, originalPrice: 144 }
    ],
    inStock: true,
    badge: "Designer's Choice",
    rating: 4.9,
    reviewCount: 189,
    activationType: 'account',
    activationDetails: 'Account credentials with customizable email and password.',
    iconName: 'Layout',
    tags: ['figma', 'ui', 'ux', 'design', 'prototyping']
  },

  // DESIGN - Adobe Creative Cloud Pro
  {
    id: 'adobe-creative-cloud',
    title: 'Adobe Creative Cloud Pro',
    subtitle: 'Photoshop, Premiere, Illustrator, After Effects + 100GB Cloud',
    category: 'education_creative',
    description: 'All 20+ Adobe creative applications including Photoshop, Illustrator, Premiere Pro, InDesign, Acrobat Pro, and Adobe Firefly generative AI.',
    features: [
      '20+ desktop and mobile creative apps',
      'Adobe Firefly Generative AI credits included',
      '100 GB cloud storage and Adobe Fonts access',
      'Direct activation on your Adobe ID'
    ],
    plans: [
      { id: 'adobe-plan', label: 'Full Suite Plan', price: 75, originalPrice: 660 }
    ],
    inStock: true,
    badge: 'Professional Tier',
    rating: 4.8,
    reviewCount: 310,
    activationType: 'email',
    activationDetails: 'Activated on your own Adobe email account or dedicated profile.',
    iconName: 'Image',
    tags: ['adobe', 'photoshop', 'premiere', 'creative', 'design', 'video']
  },

  // DESIGN - CapCut Pro
  {
    id: 'capcut-pro',
    title: 'CapCut Pro',
    subtitle: 'AI Video Editing, Auto Captions & Premium Effects',
    category: 'education_creative',
    description: 'Unlock all premium CapCut video tools: automatic subtitle generation, 4K 60fps export, AI vocal isolation, video upscaling, and exclusive transitions.',
    features: [
      'Export in 4K resolution at 60 FPS without watermark',
      'AI Auto Captions & multi-language translation',
      'Smart Background Removal and motion tracking',
      'Exclusive pro effects, filters, and audio library'
    ],
    plans: [
      { id: 'capcut-plan', label: 'Custom VIP Plan', price: 0, contactForPrice: true, notes: 'Contact for pricing & plan options' }
    ],
    inStock: true,
    badge: 'Trending Video',
    rating: 4.8,
    reviewCount: 245,
    activationType: 'account',
    activationDetails: 'Contact via Reddit or order form for custom pricing & instant activation.',
    iconName: 'Video',
    tags: ['capcut', 'video', 'editing', 'tiktok', 'reels', 'youtube']
  },

  // AI & DEV - n8n
  {
    id: 'n8n-workflow',
    title: 'n8n Workflow Automation',
    subtitle: 'Fair-code workflow automation for developers',
    category: 'ai_dev',
    description: 'Connect any app, API, or AI model. Build autonomous agents, automated lead engines, and webhooks with full code and visual control.',
    features: [
      'Advanced multi-step workflow automation',
      'Native AI node integration (LangChain, OpenAI, Claude)',
      'Custom JavaScript & Python execution',
      'Unlimited trigger executions and webhooks'
    ],
    plans: [
      { id: 'n8n-yr', label: '1 Year Plan', price: 70, originalPrice: 240 }
    ],
    inStock: true,
    badge: 'Dev Favorite',
    rating: 4.9,
    reviewCount: 114,
    activationType: 'link',
    activationDetails: 'License activation key or cloud workspace provision.',
    iconName: 'Workflow',
    tags: ['n8n', 'automation', 'developer', 'api', 'workflows']
  },

  // AI & DEV - Bolt Pro
  {
    id: 'bolt-pro',
    title: 'Bolt Pro (Bolt.new)',
    subtitle: 'Full-Stack In-Browser AI App Development',
    category: 'ai_dev',
    description: 'Prompt, build, run, and deploy full-stack web applications entirely in your browser powered by cutting-edge LLMs and WebContainers.',
    features: [
      'High-tier monthly AI generation tokens',
      'In-browser Node.js runtime and live terminal',
      'One-click deployment to Netlify and GitHub sync',
      'Run Next.js, Vite, React, Svelte & backend servers'
    ],
    plans: [
      { id: 'bolt-yr', label: '1 Year Plan', price: 80, originalPrice: 240 }
    ],
    inStock: true,
    badge: 'AI Coding',
    rating: 4.9,
    reviewCount: 198,
    activationType: 'account',
    activationDetails: 'Direct subscription activation on your account or fresh profile.',
    iconName: 'Code',
    tags: ['bolt', 'coding', 'ai', 'developer', 'fullstack']
  },

  // AI & DEV - Lovable
  {
    id: 'lovable-dev',
    title: 'Lovable Pro',
    subtitle: 'The AI Engineer that builds full web apps',
    category: 'ai_dev',
    description: 'Transform natural language into production-ready web apps with Supabase database backends, authentication, and GitHub integration.',
    features: [
      'Pro tier generation credits',
      'Direct Supabase database & Auth integrations',
      'GitHub repository sync and continuous deployment',
      'Fast AI refactoring and responsive design tooling'
    ],
    plans: [
      { id: 'lovable-yr', label: '1 Year Plan', price: 110, originalPrice: 300 }
    ],
    inStock: true,
    badge: 'Hot AI Tool',
    rating: 4.9,
    reviewCount: 165,
    activationType: 'account',
    activationDetails: 'Upgraded workspace / activation link for your email.',
    iconName: 'Sparkles',
    tags: ['lovable', 'ai', 'builder', 'developer', 'react']
  },

  // AI & DEV - Super Grok
  {
    id: 'super-grok',
    title: 'Super Grok (xAI)',
    subtitle: 'Unfiltered intelligence with real-time X data',
    category: 'ai_dev',
    description: 'Direct access to xAI’s flagship model with real-time news search, image generation, code analysis, and witty reasoning.',
    features: [
      'Real-time access to breaking information and news',
      'Uncensored and truthful conversational AI',
      'Built-in image generation and visual reasoning',
      'High context window for long documents'
    ],
    plans: [
      { id: 'grok-3m', label: '3 Months Plan', price: 27, originalPrice: 48 },
      { id: 'grok-12m', label: 'Yearly Plan (DM for pricing)', price: 75, originalPrice: 160 }
    ],
    inStock: true,
    badge: 'Fast Growing',
    rating: 4.8,
    reviewCount: 184,
    activationType: 'account',
    activationDetails: 'Direct upgrade / credentials with immediate access.',
    iconName: 'Zap',
    tags: ['grok', 'xai', 'elon', 'ai', 'search']
  },

  // AI & DEV - ElevenLabs
  {
    id: 'elevenlabs-pro',
    title: 'ElevenLabs Voice AI',
    subtitle: 'Activation on Your Email • Contact for pricing',
    category: 'ai_dev',
    description: 'The most realistic AI voice generator and text-to-speech platform in 29+ languages with custom voice cloning and audio dubbing.',
    features: [
      'Activation directly on your personal email',
      'Ultra-realistic human emotion and pacing',
      'Instant voice cloning & speech-to-speech',
      'Commercial license for YouTube, audiobooks & podcasts'
    ],
    plans: [
      { id: 'elevenlabs-plan', label: 'Email Activation Plan', price: 0, contactForPrice: true, notes: 'Activation on your email — Contact for pricing' }
    ],
    inStock: true,
    badge: 'Best Audio AI',
    rating: 5.0,
    reviewCount: 312,
    activationType: 'email',
    activationDetails: 'Direct email activation with private commercial usage rights.',
    iconName: 'Mic',
    tags: ['elevenlabs', 'voice', 'audio', 'tts', 'cloning', 'ai']
  },

  // AI & DEV - Wispr Flow
  {
    id: 'wispr-flow',
    title: 'Wispr Flow',
    subtitle: 'Activation on your account • 3x Faster Voice Dictation',
    category: 'ai_dev',
    description: 'Talk naturally and let Wispr Flow format, punctuate, and adapt your speech into polished text inside any app on your Mac or Windows.',
    features: [
      'Activation applied directly to your personal account',
      'Speaks in 100+ languages with auto translation',
      'Removes filler words like "um" and "uh" automatically',
      'Works seamlessly across Slack, Notion, VS Code, and Docs'
    ],
    plans: [
      { id: 'wispr-plan', label: 'Lifetime / Annual Access', price: 60, originalPrice: 140 }
    ],
    inStock: true,
    badge: 'Productivity Pick',
    rating: 4.9,
    reviewCount: 97,
    activationType: 'account',
    activationDetails: 'Activation applied to your own existing account.',
    iconName: 'Volume2',
    tags: ['wispr', 'flow', 'dictation', 'voice', 'typing', 'ai']
  },

  // AI & DEV - Perplexity Pro
  {
    id: 'perplexity-pro',
    title: 'Perplexity Pro',
    subtitle: 'Next-Generation AI Search with Claude 3.5 & GPT-4o',
    category: 'ai_dev',
    description: 'Experience cited, hallucination-free research with unlimited Pro Search queries, file uploads, image generation, and multi-model toggles.',
    features: [
      'Switch between Claude 3.5 Sonnet, GPT-4o & Sonar models',
      'Unlimited Pro Searches with step-by-step reasoning',
      'Direct web citations for every answer',
      'Upload PDFs and datasets for comprehensive synthesis'
    ],
    plans: [
      { id: 'perplexity-12m', label: '1 Year Pro Access', price: 45, originalPrice: 200 }
    ],
    inStock: true,
    badge: "Amazon's Choice",
    rating: 5.0,
    reviewCount: 432,
    activationType: 'link',
    activationDetails: 'Official promo activation link or direct account upgrade.',
    iconName: 'Search',
    tags: ['perplexity', 'search', 'claude', 'gpt4o', 'ai', 'research']
  },

  // VPN SERVICES - All Types of VPNs Available
  {
    id: 'vpn-nord',
    title: 'NordVPN / All Premium VPNs',
    subtitle: 'NordVPN, ExpressVPN, Surfshark, CyberGhost',
    category: 'vpn',
    description: 'Military-grade encryption, ultra-fast speeds, and global servers in 100+ countries. Stream Netflix, sports, and torrent safely with a strict no-logs policy.',
    features: [
      'All major VPN brands available (Nord, Express, Surfshark)',
      'High-speed 10Gbps servers optimized for 4K streaming',
      'Strict audited No-Logs policy',
      'Support for Windows, Mac, Android, iOS, and FireStick'
    ],
    plans: [
      { id: 'vpn-nord-1yr', label: 'NordVPN (1 Year)', price: 25, originalPrice: 60 },
      { id: 'vpn-express-1yr', label: 'ExpressVPN (1 Year)', price: 35, originalPrice: 99 },
      { id: 'vpn-surfshark-1yr', label: 'Surfshark Unlimited (1 Year)', price: 22, originalPrice: 55 },
      { id: 'vpn-custom', label: 'Custom VPN Brand (DM on Reddit)', price: 0, contactForPrice: true, notes: 'Specify your desired VPN in order notes' }
    ],
    inStock: true,
    badge: 'Privacy Shield',
    rating: 4.9,
    reviewCount: 512,
    activationType: 'account',
    activationDetails: 'Private account credentials or activation code provided instantly.',
    iconName: 'ShieldCheck',
    tags: ['vpn', 'nordvpn', 'expressvpn', 'surfshark', 'privacy', 'security']
  }
];
