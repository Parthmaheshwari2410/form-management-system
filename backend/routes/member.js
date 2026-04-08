const express = require('express');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken, requireRole('member'));

router.get('/profile', async (req, res) => {
    try {
        const [[member]] = await db.execute(
            'SELECT m.*, a.name AS agent_name FROM members m LEFT JOIN agents a ON a.id = m.agent_id WHERE m.user_id = ?',
            [req.user.id]
        );
        if (!member) return res.status(404).json({ message: 'Profile not found' });
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/earnings', async (req, res) => {
    try {
        const [[member]] = await db.execute(
            'SELECT earnings FROM members WHERE user_id = ?', [req.user.id]
        );
        res.json({ earnings: member?.earnings || '' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;