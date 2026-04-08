const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendLoginAlert } = require('../config/mailer');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    // login accepts phone number or email
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE phone = ? OR email = ?',
            [login, login]
        );

        if (!rows.length) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        if (user.role === 'member' || user.role === 'agent') {
            sendLoginAlert({
                name: user.name,
                email: user.email,
                role: user.role,
            }).catch(err => console.error('Mail send failed:', err.message));
        }

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;