const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Log every incoming request so we can see what's hitting the server
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));

app.get('/', (req, res) => res.json({ status: 'Backend running' }));

// Catch-all — log unmatched routes
app.use((req, res) => {
  console.log('UNMATCHED ROUTE:', req.method, req.path);
  res.status(404).json({ msg: `Route not found: ${req.path}` });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));