export type CategoryId = 
  | 'all' 
  | 'entertainment' 
  | 'ai_dev' 
  | 'education_creative' 
  | 'career_productivity' 
  | 'vpn';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export interface PlanOption {
  id: string;
  label: string; // e.g. "1 Month", "12 Months", "3 Months", "Yearly"
  price: number; // in USD
  originalPrice?: number;
  contactForPrice?: boolean;
  notes?: string;
}

export type FieldRequirementLevel = 'required' | 'optional' | 'hidden';

export interface ProductCheckoutConfig {
  useCustomRules: boolean;
  passwordRequirement: FieldRequirementLevel;
  passwordLabel?: string;
  passwordHelperText?: string;
  activationEmailRequirement: FieldRequirementLevel;
  activationEmailLabel?: string;
  activationEmailPlaceholder?: string;
  customFieldRequirement: FieldRequirementLevel;
  customFieldLabel?: string;
  customFieldPlaceholder?: string;
  checkoutNotice?: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  category: CategoryId;
  description: string;
  features: string[];
  plans: PlanOption[];
  inStock: boolean; // Developer toggleable!
  badge?: string; // e.g. "Best Seller", "Amazon's Choice", "Hot Deal"
  rating: number; // e.g. 4.9
  reviewCount: number; // e.g. 280
  activationType: 'email' | 'link' | 'account' | 'credentials';
  activationDetails: string;
  iconName: string;
  tags: string[];
  checkoutConfig?: ProductCheckoutConfig;
}

export interface CartItem {
  cartItemId: string; // unique id combining product id and plan id
  product: Product;
  selectedPlan: PlanOption;
  quantity: number;
}

export interface CheckoutFieldConfig {
  enabled: boolean;
  required: boolean;
  label: string;
  placeholder?: string;
  helperText?: string;
}

export interface CheckoutSettings {
  fullName: CheckoutFieldConfig;
  deliveryEmail: CheckoutFieldConfig;
  activationEmail: CheckoutFieldConfig;
  accountPassword: CheckoutFieldConfig;
  redditUsername: CheckoutFieldConfig;
  telegramOrWhatsapp: CheckoutFieldConfig;
  paymentNotes: CheckoutFieldConfig;
  customField: CheckoutFieldConfig;
  checkoutNoticeText?: string;
}

export interface CustomerOrderDetails {
  fullName: string;
  email: string;
  redditUsername?: string;
  telegramOrWhatsapp?: string;
  activationEmailOrAccount?: string;
  accountPassword?: string;
  notes?: string;
  customFieldValue?: string;
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  customer: CustomerOrderDetails;
  items: {
    productId: string;
    productTitle: string;
    planLabel: string;
    price: number;
    quantity: number;
    activationDetails: string;
  }[];
  totalAmount: number;
  status: 'PENDING_ACTIVATION' | 'COMPLETED';
}

export interface StoreSettings {
  storeName: string;
  sellerEmail: string;
  redditUsername: string; // e.g. "DigitalSubsPro" or link
  redditSubreddit?: string;
  currencySymbol: string;
  contactEmail: string;
  customRequestsEnabled: boolean;
  announcementText: string;
  developerPin: string;
  checkoutSettings?: CheckoutSettings;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}
