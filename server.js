require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_EXPIRES_IN = '2h';
const MONGODB_URI = process.env.MONGODB_URI || '';

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

function issueToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: 'Missing Bearer token' });
  }

  try {
    const payload = jwt.verify(match[1], JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
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
    const token = issueToken(user);
    return res.status(201).json({ id: String(user._id), email: user.email, token });
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

  const token = issueToken(user);
  return res.json({ id: String(user._id), email: user.email, token });
});

app.get('/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

app.get('/users', authRequired, async (_req, res) => {
  const users = await User.find({}, { email: 1, createdAt: 1 }).sort({ createdAt: -1 });
  res.json({ users });
});

app.get('/users/count', authRequired, async (_req, res) => {
  const total = await User.countDocuments();
  res.json({ total });
});

app.put('/users/:id', authRequired, async (req, res) => {
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
    const token = issueToken(user);
    return res.json({ id: String(user._id), email: user.email, token });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) {
    return res.status(403).json({ error: 'You can only delete your own account' });
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (JWT_SECRET === 'dev-secret-change-me') {
    console.warn('Warning: using default JWT_SECRET. Set JWT_SECRET in env for production.');
  }
});
