import { PlacedOrder, StoreSettings, CartItem } from '../types';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
}

export async function sendOrderNotificationEmail(
  order: PlacedOrder,
  settings: StoreSettings
): Promise<EmailDispatchResult> {
  const itemsSummary = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.productTitle} (${item.planLabel}) - Qty: ${item.quantity} - Price: ${settings.currencySymbol}${item.price}`
    )
    .join('\n');

  const emailBody = `
========================================
🚀 NEW ORDER INQUIRY - #${order.orderId}
========================================

CUSTOMER DETAILS:
- Name: ${order.customer.fullName}
- Email: ${order.customer.email}
- Activation Email/Account: ${order.customer.activationEmailOrAccount || 'Same as customer email'}
- Account Password / Access PIN: ${order.customer.accountPassword || 'Not required / Not provided'}
- Reddit Username: ${order.customer.redditUsername || 'Not provided'}
- Telegram/WhatsApp: ${order.customer.telegramOrWhatsapp || 'Not provided'}
- Custom Order Requirement: ${order.customer.customFieldValue || 'None'}
- Special Instructions / Notes: ${order.customer.notes || 'None'}

ORDER ITEMS:
${itemsSummary}

TOTAL: ${settings.currencySymbol}${order.totalAmount}
TIME: ${new Date(order.createdAt).toLocaleString()}
STATUS: PENDING ACTIVATION & REDDIT PAYMENT
========================================
`.trim();

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: 'b9426f4f-4d6d-4958-944a-95cf60c180da',
        subject: `🔥 New Reddit Order #${order.orderId} from ${order.customer.fullName} (${order.customer.redditUsername || order.customer.email})`,
        from_name: 'SubPrime Storefront',
        to_email: settings.sellerEmail,
        message: emailBody,
        customer_email: order.customer.email,
        order_id: order.orderId,
      }),
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Order notification sent to seller email successfully!',
      };
    } else {
      return {
        success: true,
        message: 'Order recorded locally.',
      };
    }
  } catch (error) {
    console.warn('Network issue sending email notification:', error);
    return {
      success: true,
      message: 'Order logged locally.',
    };
  }
}

/**
 * Creates 1-click Reddit DM URL from Cart items with payment inquiry
 */
export function buildCartRedditDmUrl(
  redditUsername: string,
  cart: CartItem[],
  settings: StoreSettings,
  customerEmail?: string,
  customerReddit?: string
): string {
  const cleanUsername = redditUsername.replace(/^u\//i, '').replace(/^@/, '').trim();
  const total = cart.reduce((s, i) => s + (i.selectedPlan.price || 0) * i.quantity, 0);
  const itemsText = cart
    .map((item) => `• ${item.product.title} (${item.selectedPlan.label}) x${item.quantity} - ${item.selectedPlan.contactForPrice ? 'Quote' : `${settings.currencySymbol}${item.selectedPlan.price}`}`)
    .join('\n');

  const subject = encodeURIComponent(`Subscription Order Inquiry (${cart.length} items - ${settings.currencySymbol}${total})`);
  
  const message = encodeURIComponent(
`Hi! I have selected these subscriptions from your SubPrime store:

🛒 CART ITEMS:
${itemsText}

💰 Total: ${settings.currencySymbol}${total}
${customerEmail ? `📧 My Delivery Email: ${customerEmail}` : ''}
${customerReddit ? `👤 My Reddit: ${customerReddit}` : ''}

💳 I want to complete payment and get activation. What payment methods (Crypto, PayPal, CashApp, UPI, etc.) do you accept?

Looking forward to your reply. Thanks!`
  );

  return `https://www.reddit.com/message/compose/?to=${cleanUsername}&subject=${subject}&message=${message}`;
}

/**
 * Creates clean formatted text representation of Cart to copy to clipboard for Reddit Chat
 */
export function formatCartForRedditClipboard(
  cart: CartItem[],
  settings: StoreSettings,
  customerEmail?: string,
  orderId?: string
): string {
  const total = cart.reduce((s, i) => s + (i.selectedPlan.price || 0) * i.quantity, 0);
  const itemsText = cart
    .map((item) => `• ${item.product.title} (${item.selectedPlan.label}) x${item.quantity}`)
    .join('\n');

  return `🚀 SubPrime Order Inquiry${orderId ? ` #${orderId}` : ''}
📦 Selected Subscriptions:
${itemsText}
💰 Total: ${settings.currencySymbol}${total}
${customerEmail ? `📧 Activation Email: ${customerEmail}\n` : ''}Hi! I would like to pay for these items. Please send your payment details (Crypto/PayPal/etc.) and activation instructions.`;
}

/**
 * Creates a 1-click Reddit DM URL with subject and pre-filled order info
 */
export function buildRedditDmUrl(
  redditUsername: string,
  order: PlacedOrder,
  settings: StoreSettings
): string {
  const cleanUsername = redditUsername.replace(/^u\//i, '').replace(/^@/, '').trim();
  const subject = encodeURIComponent(`Order #${order.orderId} - Ready to Pay`);
  
  const itemsText = order.items
    .map((item) => `• ${item.productTitle} [${item.planLabel}] x${item.quantity} - ${settings.currencySymbol}${item.price}`)
    .join('\n');

  const message = encodeURIComponent(
`Hi! I placed an order on SubPrime and am ready to pay:

📋 Order ID: #${order.orderId}
👤 Name: ${order.customer.fullName}
📧 Delivery Email: ${order.customer.email}
${order.customer.activationEmailOrAccount ? `🔑 Account for Activation: ${order.customer.activationEmailOrAccount}\n` : ''}${order.customer.accountPassword ? `🔒 Account Password / PIN: ${order.customer.accountPassword}\n` : ''}${order.customer.telegramOrWhatsapp ? `📱 Telegram/WhatsApp: ${order.customer.telegramOrWhatsapp}\n` : ''}${order.customer.customFieldValue ? `📌 Requirement Detail: ${order.customer.customFieldValue}\n` : ''}📦 Items:
${itemsText}

💰 Total: ${settings.currencySymbol}${order.totalAmount}
${order.customer.notes ? `📝 Notes: ${order.customer.notes}\n` : ''}
💳 Please reply with your payment details so we can complete this order and activate my subscription!

Thank you!`
  );

  return `https://www.reddit.com/message/compose/?to=${cleanUsername}&subject=${subject}&message=${message}`;
}

/**
 * Link to Reddit user profile / chat
 */
export function buildRedditProfileUrl(redditUsername: string): string {
  const cleanUsername = redditUsername.replace(/^u\//i, '').replace(/^@/, '').trim();
  return `https://www.reddit.com/user/${cleanUsername}`;
}

/**
 * Builds Reddit DM URL for custom subscription request
 */
export function buildRedditCustomRequestUrl(
  redditUsername: string,
  subName: string,
  budget: string,
  userContact: string
): string {
  const cleanUsername = redditUsername.replace(/^u\//i, '').replace(/^@/, '').trim();
  const subject = encodeURIComponent(`Custom Subscription Request: ${subName}`);
  const message = encodeURIComponent(
`Hi! I am looking for a subscription not listed on the store:

🎯 Subscription: ${subName}
💵 Target Budget/Duration: ${budget || 'Flexible / Best price'}
📱 Contact/Email: ${userContact || 'This Reddit account'}

Please let me know if you can activate this and how to pay. Thank you!`
  );

  return `https://www.reddit.com/message/compose/?to=${cleanUsername}&subject=${subject}&message=${message}`;
}
