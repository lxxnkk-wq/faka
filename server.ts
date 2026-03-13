import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Configuration ---
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';

// --- Mock Data (Moved to Server for Security) ---
const users: any[] = []; // In-memory user store for demo

const MOCK_ORDERS = [
  // ... (same as before)
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Vite dev
  }));

  // 2. CORS
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // 3. Parsing
  app.use(express.json());
  app.use(cookieParser());

  // 4. Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // Stricter for auth
    message: { error: 'Too many auth attempts. Please try again later.' }
  });

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // --- Auth Routes ---

  app.post('/api/auth/signup', authLimiter, async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), email, password: hashedPassword, name };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  });

  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.patch('/api/auth/profile', authenticateToken, (req: any, res) => {
    const { name } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    
    users[userIndex].name = name;
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  });

  // --- API Routes ---

  app.post('/api/order-lookup', apiLimiter, (req, res) => {
    const { orderId, email, password } = req.body;

    // Basic Validation
    if (!orderId || (!email && !password)) {
      return res.status(400).json({ error: 'Order ID and Email/Password are required.' });
    }

    // Simulate DB Lookup
    const foundOrder = MOCK_ORDERS.find(o => o.id === orderId);
    
    // In a real app, you'd check hashed passwords in DB
    const isValidEmail = email === 'guest@example.com';
    const isValidPassword = password === '123456';

    if (foundOrder && (isValidEmail || isValidPassword)) {
      res.json(foundOrder);
    } else {
      res.status(404).json({ error: 'No order found with these credentials.' });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
