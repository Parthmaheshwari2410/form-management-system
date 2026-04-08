const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    },
});
const upload = multer({ storage });

router.use(verifyToken, requireRole('admin'));

// Dashboard page 
router.get('/dashboard', async (req, res) => {
    try {
        const [[{ agentCount }]] = await db.execute('SELECT COUNT(*) AS agentCount FROM agents');
        const [[{ memberCount }]] = await db.execute('SELECT COUNT(*) AS memberCount FROM members');
        const [recentAgents] = await db.execute('SELECT name, created_at FROM agents ORDER BY created_at DESC LIMIT 5');
        const [recentMembers] = await db.execute('SELECT name, created_at FROM members ORDER BY created_at DESC LIMIT 5');
        return res.json({ agentCount, memberCount, recentAgents, recentMembers });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Add Agent
router.post('/agents', upload.fields([{ name: 'aadhaar_doc' }, { name: 'pan_doc' }]), async (req, res) => {
    const { name, dob, village, taluka, district, state, email, contact } = req.body;
    try {
        if (!contact) {
            return res.status(400).json({ message: 'Contact number is required' });
        }


        const [existing] = await db.execute(
            'SELECT id FROM users WHERE phone = ?', [contact]
        );
        if (existing.length) {
            return res.status(400).json({ message: 'Contact number already registered' });
        }

        const hash = await bcrypt.hash(contact, 10);
        const [userResult] = await db.execute(
            'INSERT INTO users (name, email, phone, password, role) VALUES (?,?,?,?,?)',
            [name, email || null, contact, hash, 'agent']
        );
        const userId = userResult.insertId;
        const aadhaar = req.files?.aadhaar_doc?.[0]?.filename || null;
        const pan = req.files?.pan_doc?.[0]?.filename || null;
        await db.execute(
            'INSERT INTO agents (user_id,name,dob,village,taluka,district,state,email,contact,aadhaar_doc,pan_doc) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [userId, name, dob || null, village, taluka, district, state, email || null, contact, aadhaar, pan]
        );
        return res.json({ message: `Agent added. Default password is their contact number: ${contact}` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get all agents
router.get('/agents', async (req, res) => {
    try {
        const [agents] = await db.execute(`
      SELECT a.*, COUNT(m.id) AS memberCount
      FROM agents a LEFT JOIN members m ON m.agent_id = a.id
      GROUP BY a.id ORDER BY a.created_at DESC
    `);
        return res.json(agents);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get single agent
router.get('/agents/:id', async (req, res) => {
    try {
        const [[agent]] = await db.execute('SELECT * FROM agents WHERE id = ?', [req.params.id]);
        if (!agent) return res.status(404).json({ message: 'Agent not found' });
        const [members] = await db.execute('SELECT * FROM members WHERE agent_id = ?', [req.params.id]);
        return res.json({ agent, members });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Add Member by admin
router.post('/members', upload.fields([
    { name: 'aadhaar_doc' }, { name: 'pan_doc' }, { name: 'doc_712' }, { name: 'doc_8a' }
]), async (req, res) => {
    const {
        agent_id, name, village, taluka, district, state, pincode,
        email, whatsapp, contact,
        field_area_meter, field_area_acre, field_area_gunta, field_8a_info
    } = req.body;
    try {
        if (!contact) {
            return res.status(400).json({ message: 'Contact number is required' });
        }


        const [existing] = await db.execute(
            'SELECT id FROM users WHERE phone = ?', [contact]
        );
        if (existing.length) {
            return res.status(400).json({ message: 'Contact number already registered' });
        }

        let userId = null;
        const hash = await bcrypt.hash(contact, 10);
        const [uRes] = await db.execute(
            'INSERT INTO users (name, email, phone, password, role) VALUES (?,?,?,?,?)',
            [name, email || null, contact, hash, 'member']
        );
        userId = uRes.insertId;

        const files = req.files || {};
        await db.execute(
            `INSERT INTO members (agent_id,user_id,name,village,taluka,district,state,pincode,email,whatsapp,contact,
        aadhaar_doc,pan_doc,doc_712,field_area_meter,field_area_acre,field_area_gunta,doc_8a,field_8a_info)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                agent_id, userId, name, village, taluka, district, state, pincode,
                email || null, whatsapp || null, contact,
                files.aadhaar_doc?.[0]?.filename || null,
                files.pan_doc?.[0]?.filename || null,
                files.doc_712?.[0]?.filename || null,
                field_area_meter || null, field_area_acre || null, field_area_gunta || null,
                files.doc_8a?.[0]?.filename || null,
                field_8a_info || null
            ]
        );
        return res.json({ message: `Member added. Default password is their contact number: ${contact}` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

//  all members
router.get('/members', async (req, res) => {
    try {
        const [members] = await db.execute(`
      SELECT m.*, a.name AS agent_name FROM members m
      LEFT JOIN agents a ON a.id = m.agent_id ORDER BY m.created_at DESC
    `);
        return res.json(members);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

//  single member
router.get('/members/:id', async (req, res) => {
    try {
        const [[member]] = await db.execute(
            'SELECT m.*, a.name AS agent_name FROM members m LEFT JOIN agents a ON a.id = m.agent_id WHERE m.id = ?',
            [req.params.id]
        );
        if (!member) return res.status(404).json({ message: 'Member not found' });
        return res.json(member);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Update earnings
router.patch('/members/:id/earnings', async (req, res) => {
    try {
        await db.execute(
            'UPDATE members SET earnings = ? WHERE id = ?',
            [req.body.earnings, req.params.id]
        );
        return res.json({ message: 'Earnings updated' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;