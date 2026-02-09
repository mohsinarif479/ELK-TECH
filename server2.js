require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-change-me';
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.use(express.static('public'));

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set. Server will fail to connect.');
}

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function sessionAuthRequired(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await User.create({ email, passwordHash });
    req.session.user = { id: String(user._id), email: user.email };
    return res.status(201).json({ id: String(user._id), email: user.email });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.user = { id: String(user._id), email: user.email };
  return res.json({ id: String(user._id), email: user.email });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

app.get('/me', sessionAuthRequired, (req, res) => {
  res.json({ user: req.user });
});

app.get('/users', sessionAuthRequired, async (_req, res) => {
  const users = await User.find({}, { email: 1, createdAt: 1 }).sort({ createdAt: -1 });
  res.json({ users });
});

app.get('/users/count', sessionAuthRequired, async (_req, res) => {
  const total = await User.countDocuments();
  res.json({ total });
});

app.put('/users/:id', sessionAuthRequired, async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body || {};

  if (req.user.id !== id) {
    return res.status(403).json({ error: 'You can only update your own account' });
  }

  const updates = {};
  if (email !== undefined) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    updates.email = email;
  }
  if (password !== undefined) {
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    updates.passwordHash = await bcrypt.hash(password, 12);
  }

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.session.user = { id: String(user._id), email: user.email };
    return res.json({ id: String(user._id), email: user.email });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', sessionAuthRequired, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) {
    return res.status(403).json({ error: 'You can only delete your own account' });
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`Session server running on http://localhost:${PORT}`);
  if (SESSION_SECRET === 'dev-session-secret-change-me') {
    console.warn('Warning: using default SESSION_SECRET. Set SESSION_SECRET in env for production.');
  }
});
