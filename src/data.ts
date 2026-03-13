import { Product, Order } from './types';

export const CATEGORIES = [
  { name: "All Products", count: 128 },
  { name: "Software Activation", count: 42 },
  { name: "Game Cards", count: 35 },
  { name: "Memberships", count: 28 },
  { name: "Social Accounts", count: 15 },
  { name: "Dev Tools", count: 8 }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NordVPN Ultra Premium',
    description: 'The pinnacle of digital privacy. 6000+ servers with military-grade encryption.',
    price: 199.00,
    category: 'Software Activation',
    stock: 128,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    rating: 4.9,
    label: 'EDITOR\'S CHOICE',
    deliveryType: 'auto',
    accessLevel: 'guest'
  },
  {
    id: '2',
    name: 'Steam Global $100',
    description: 'Instant digital delivery. Unlock thousands of titles worldwide.',
    price: 680.00,
    category: 'Game Cards',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    deliveryType: 'auto',
    accessLevel: 'guest'
  },
  {
    id: '3',
    name: 'ChatGPT Plus Enterprise',
    description: 'Unleash the full power of GPT-4 with priority access and advanced tools.',
    price: 158.00,
    category: 'Memberships',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 5.0,
    label: 'MOST POPULAR',
    deliveryType: 'manual',
    accessLevel: 'member'
  },
  {
    id: '4',
    name: 'JetBrains Master Suite',
    description: 'The complete collection of professional IDEs for elite developers.',
    price: 88.00,
    category: 'Dev Tools',
    stock: 89,
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    deliveryType: 'auto',
    accessLevel: 'guest'
  },
  {
    id: '5',
    name: 'Netflix 4K UHD Private',
    description: 'Exclusive 4K streaming experience. Private profile, zero interruptions.',
    price: 25.00,
    category: 'Memberships',
    stock: 230,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    deliveryType: 'manual',
    accessLevel: 'guest'
  },
  {
    id: '6',
    name: 'Adobe Creative Cloud',
    description: 'The industry standard for creative professionals. 20+ apps included.',
    price: 299.00,
    category: 'Software Activation',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    deliveryType: 'manual',
    accessLevel: 'member'
  },
  {
    id: '7',
    name: 'Spotify Premium Family',
    description: 'Ad-free music for the whole family. High-fidelity sound quality.',
    price: 15.00,
    category: 'Memberships',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    deliveryType: 'auto',
    accessLevel: 'guest'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8842',
    date: '2026-03-05T14:20:00Z',
    total: 357.00,
    status: 'completed',
    statusDescription: 'All digital keys have been successfully delivered to your vault.',
    estimatedDelivery: '2026-03-05T14:21:00Z',
    items: [
      { id: '1', name: 'NordVPN Ultra Premium', price: 199.00, quantity: 1, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
      { id: '3', name: 'ChatGPT Plus Enterprise', price: 158.00, quantity: 1, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' }
    ],
    timeline: [
      { date: '2026-03-05T14:20:00Z', status: 'Order Placed', note: 'Transaction initiated via secure gateway.' },
      { date: '2026-03-05T14:20:30Z', status: 'Processing', note: 'Verifying digital assets and generating unique keys.' },
      { date: '2026-03-05T14:21:00Z', status: 'Completed', note: 'Keys delivered to the customer archive.' }
    ]
  },
  {
    id: 'ORD-2026-9120',
    date: '2026-02-28T09:15:00Z',
    total: 88.00,
    status: 'completed',
    statusDescription: 'Archive entry finalized. Professional suite activated.',
    estimatedDelivery: '2026-02-28T09:16:00Z',
    items: [
      { id: '4', name: 'JetBrains Master Suite', price: 88.00, quantity: 1, image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80' }
    ],
    timeline: [
      { date: '2026-02-28T09:15:00Z', status: 'Order Placed', note: 'Acquisition started.' },
      { date: '2026-02-28T09:16:00Z', status: 'Completed', note: 'Master Suite keys issued.' }
    ]
  }
];

export const NEWS_ARTICLES = [
  {
    id: '1',
    title: 'Nova Collective Spring 2026 Collection',
    date: '2026-03-10',
    excerpt: 'Explore our latest collection of digital art and software tools, crafted for creative professionals pursuing excellence.',
    content: `
      <p>Nova Collective is proud to announce the launch of its Spring 2026 Collection. This season, we focus on combining cutting-edge technology with timeless design aesthetics to provide unprecedented tools and assets for creatives in the digital age.</p>
      <p>From brand new digital art licenses to optimized professional software activation keys, the Spring Collection covers all our most popular categories. Our team spent months collaborating with top developers and artists worldwide to ensure every item meets Nova Collective's rigorous standards.</p>
      <h3>Core Highlights</h3>
      <ul>
        <li><strong>Exclusive Art Assets:</strong> Limited edition works created in collaboration with internationally renowned digital artists.</li>
        <li><strong>Enhanced Security Tools:</strong> Security software optimized for the latest network environments of 2026.</li>
        <li><strong>Member Exclusive Benefits:</strong> Nova Collective members will enjoy priority purchasing rights and exclusive discounts.</li>
      </ul>
      <p>We believe that digital assets are not just tools, but the foundation of personal expression and professional achievement. Welcome to our boutique to explore the full charm of the Spring Collection.</p>
    `,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Brand News',
    author: {
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    }
  },
  {
    id: '2',
    title: 'Digital Asset Security: How to Protect Your Collection',
    date: '2026-03-05',
    excerpt: 'In the digital age, security is paramount. Learn the best practices for protecting your digital licenses and private keys.',
    content: `
      <p>As the value of digital assets continues to rise, security has become a top priority for every collector and professional. At Nova Collective, we not only provide high-quality assets but are also committed to helping you protect them.</p>
      <p>Here are some key steps to protect your digital collection:</p>
      <h3>1. Use Hardware Security Modules</h3>
      <p>For extremely valuable digital licenses and private keys, offline storage is the most effective defense against online threats. Consider using a certified Hardware Security Module (HSM) to manage your core assets.</p>
      <h3>2. Enable Multi-Factor Authentication (MFA)</h3>
      <p>Never rely solely on a password. Enable MFA on all relevant platforms, especially those involving high-value transactions or sensitive information.</p>
      <h3>3. Regularly Audit Your Assets</h3>
      <p>Regularly check your digital asset inventory to ensure all licenses are up-to-date and you have full control over all access rights. Nova Collective's order tracking system can help you easily accomplish this process.</p>
      <p>Security is an ongoing process, not a one-time task. Stay vigilant, utilize the latest security technologies, and keep your digital collection safe for years to come.</p>
    `,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: 'Security Guide',
    author: {
      name: 'Marcus Thorne',
      role: 'Security Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    }
  },
  {
    id: '3',
    title: 'Interview: Digital Artist Leo Chen',
    date: '2026-02-28',
    excerpt: 'Gain insight into the creative process of one of the most influential artists behind Nova Collective.',
    content: `
      <p>Leo Chen is one of the most watched names in contemporary digital art. His work is known for its profound philosophical reflection and exquisite technical expression. Today, we have the honor of inviting Leo to talk about his creative inspiration and his views on the future of digital art.</p>
      <p>"For me, the digital medium offers a degree of freedom unmatched by traditional media," Leo said in his Shanghai studio. "It allows me to explore the infinite possibilities of light, shadow, and geometry in real-time."</p>
      <h3>On Inspiration</h3>
      <p>Leo's work often stems from observing the microscopic structures of the natural world. He translates these organic forms into complex digital algorithms, creating visual landscapes that are both strange and familiar.</p>
      <h3>On Nova Collective</h3>
      <p>"Nova Collective provides a very pure platform for artists," Leo stated. "Here, the quality of the work is always the first priority. This pursuit of excellence coincides with my creative philosophy."</p>
      <p>Leo's latest series is now available exclusively at Nova Collective. Through these works, you can catch a glimpse of the future world through the eyes of this visual master.</p>
    `,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    category: 'Interview',
    author: {
      name: 'Elena Rossi',
      role: 'Art Critic',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    }
  }
];
