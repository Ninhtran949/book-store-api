const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET all Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET  User by ID
router.get('/id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get user by phonenumber
router.get('/phone/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const user = await User.findOne({ phoneNumber: phoneNumber });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// route /login để tạo cả accessToken và refreshToken. Lưu trữ refresh token trong cơ sở dữ liệu hoặc bộ nhớ tạm.
const refreshTokens = []; // Lưu trữ refresh token trong bộ nhớ (chỉ dùng thử nghiệm)

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm kiếm người dùng trong cơ sở dữ liệu theo `id` hoặc `phoneNumber`
    const user = await User.findOne({ 
      $or: [{ id: username }, { phoneNumber: username }] 
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // So sánh mật khẩu đã hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Tạo access token và refresh token
    const accessToken = jwt.sign({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, name: user.name }, process.env.REFRESH_TOKEN_SECRET);

    refreshTokens.push(refreshToken); // Lưu refresh token vào bộ nhớ (cần thay thế bằng cơ sở dữ liệu)

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// endpoint /token để lấy refresh token, xác minh và cấp mới access token.
router.post('/token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = jwt.sign({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  });
});

router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;

  const index = refreshTokens.indexOf(refreshToken);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  }

  res.json({ message: 'Logged out successfully' });
});

// CREATE a new User
router.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  const user = new User({
    address: req.body.address,
    id: req.body.id,
    name: req.body.name,
    password: hashedPassword,
    phoneNumber: req.body.phoneNumber,
    strUriAvatar: req.body.strUriAvatar || ''
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a User by ID
router.patch('/id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.password !== undefined) user.password = req.body.password;
    if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber;
    if (req.body.strUriAvatar !== undefined) user.strUriAvatar = req.body.strUriAvatar;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a User by ID
router.delete('/id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;