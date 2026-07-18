const express = require('express');
const session = require('express-session');
const { mockUser } = require('./src/data/mockData');

const courseRoutes = require('./src/routes/courseRoutes');
const gamificationRoutes = require('./src/routes/gamificationRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'kids-coding-secret', resave: false, saveUninitialized: true}));

//Auto-init session with mock user - replace this block with real auth when DB is ready
app.use((req, res, next) => {
    if (!req.session.user) req.session.user = { ...mockUser };
    next();
});

app.use('/api/courses', courseRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/media', mediaRoutes);
app.get('/api/user', (req, res) => res.json({ user: req.session.user }));

app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));

module.exports = app;