const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const tagRoutes = require('./routes/tagRoutes');
const generateToken = require('./config/jwt').generateToken;
require('dotenv').config();

const app = express();
connectDB();
generateToken({
    _id: "6835b5bc602ce06340085865",
    role: "super_admin"
});

console.log(generateToken({
    _id: "6835b5bc602ce06340085865",
    role: "super_admin"
}));

app.use(cors({
    origin: ["https://lead-management-31rl.onrender.com"],
    credentials: true
  }))
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tags', tagRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));