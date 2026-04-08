const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')),
});
const upload = multer({ storage });

router.use(verifyToken, requireRole('agent'));

// agent own profileid from users table 
const getAgentId = async (userId) => {
    const [[agent]] = await db.execute('SELECT id FROM agents WHERE user_id = ?', [userId]);
    return agent?.id;
};

// Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const agentId = await getAgentId(req.user.id);
        const [[{ memberCount }]] = await db.execute(
            'SELECT COUNT(*) AS memberCount FROM members WHERE agent_id = ?', [agentId]
        );
        res.json({ memberCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Member
router.post('/members', upload.fields([
    { name: 'aadhaar_doc' }, { name: 'pan_doc' }, { name: 'doc_712' }, { name: 'doc_8a' }
]), async (req, res) => {
    const { name, village, taluka, district, state, pincode, email, whatsapp, contact,
        field_area_meter, field_area_acre, field_area_gunta, field_8a_info } = req.body;
    try {
        const agentId = await getAgentId(req.user.id);
        let userId = null;
        if (contact) {
            // Default password conntect number
            const hash = await bcrypt.hash(contact, 10);
            const [uRes] = await db.execute(
                'INSERT INTO users (name, email, phone, password, role) VALUES (?,?,?,?,?)',
                [name, email || null, contact, hash, 'member']
            );
            userId = uRes.insertId;
        }
        const files = req.files || {};
        await db.execute(
            `INSERT INTO members (agent_id,user_id,name,village,taluka,district,state,pincode,email,whatsapp,contact,
        aadhaar_doc,pan_doc,doc_712,field_area_meter,field_area_acre,field_area_gunta,doc_8a,field_8a_info)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [agentId, userId, name, village, taluka, district, state, pincode, email, whatsapp, contact,
                files.aadhaar_doc?.[0]?.filename || null,
                files.pan_doc?.[0]?.filename || null,
                files.doc_712?.[0]?.filename || null,
                field_area_meter || null, field_area_acre || null, field_area_gunta || null,
                files.doc_8a?.[0]?.filename || null,
                field_8a_info || null]
        );
        res.json({ message: `Member added. Default password is their contact number: ${contact}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// My Members
router.get('/members', async (req, res) => {
    try {
        const agentId = await getAgentId(req.user.id);
        const [members] = await db.execute(
            'SELECT * FROM members WHERE agent_id = ? ORDER BY created_at DESC', [agentId]
        );
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload docs member 
router.patch('/members/:id/docs', upload.fields([
    { name: 'aadhaar_doc' }, { name: 'pan_doc' }, { name: 'doc_712' }, { name: 'doc_8a' }
]), async (req, res) => {
    try {
        const agentId = await getAgentId(req.user.id);
        const [[member]] = await db.execute(
            'SELECT * FROM members WHERE id = ? AND agent_id = ?', [req.params.id, agentId]
        );
        if (!member) return res.status(403).json({ message: 'Access denied' });

        const files = req.files || {};
        const updates = {};
        if (files.aadhaar_doc) updates.aadhaar_doc = files.aadhaar_doc[0].filename;
        if (files.pan_doc) updates.pan_doc = files.pan_doc[0].filename;
        if (files.doc_712) updates.doc_712 = files.doc_712[0].filename;
        if (files.doc_8a) updates.doc_8a = files.doc_8a[0].filename;

        if (Object.keys(updates).length) {
            const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
            await db.execute(`UPDATE members SET ${sets} WHERE id = ?`, [...Object.values(updates), req.params.id]);
        }
        res.json({ message: 'Documents updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;