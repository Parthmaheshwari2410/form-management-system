const bcrypt = require('bcrypt');
const db = require('./db');

async function initDB() {
    const dbName = process.env.DB_NAME || 'form_management';

    await db.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);


    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(100) NOT NULL,
      email        VARCHAR(100) UNIQUE,
      phone        VARCHAR(15)  UNIQUE,
      password     VARCHAR(255) NOT NULL DEFAULT '',
      role         ENUM('admin','agent','member') NOT NULL DEFAULT 'member',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Adding phone column if table already exists
    try {
        await db.execute(`ALTER TABLE users ADD COLUMN phone VARCHAR(15) UNIQUE`);
    } catch {
        //error
    }

    await db.execute(`
    CREATE TABLE IF NOT EXISTS agents (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      name        VARCHAR(100),
      dob         DATE,
      village     VARCHAR(100),
      taluka      VARCHAR(100),
      district    VARCHAR(100),
      state       VARCHAR(100),
      email       VARCHAR(100),
      contact     VARCHAR(15),
      aadhaar_doc VARCHAR(255),
      pan_doc     VARCHAR(255),
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS members (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      agent_id         INT NOT NULL,
      user_id          INT,
      name             VARCHAR(100),
      village          VARCHAR(100),
      taluka           VARCHAR(100),
      district         VARCHAR(100),
      state            VARCHAR(100),
      pincode          VARCHAR(10),
      email            VARCHAR(100),
      whatsapp         VARCHAR(15),
      contact          VARCHAR(15),
      aadhaar_doc      VARCHAR(255),
      pan_doc          VARCHAR(255),
      doc_712          VARCHAR(255),
      field_area_meter DECIMAL(10,2),
      field_area_acre  DECIMAL(10,2),
      field_area_gunta DECIMAL(10,2),
      doc_8a           VARCHAR(255),
      field_8a_info    TEXT,
      earnings         TEXT,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE SET NULL
    )
  `);



    // default admin 
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@system.com';
    const [[existing]] = await db.execute(
        'SELECT id FROM users WHERE email = ?', [adminEmail]
    );

    if (!existing) {
        const hash = await bcrypt.hash('password', 10);
        await db.execute(
            'INSERT INTO users (name, email, phone, password, role) VALUES (?,?,?,?,?)',
            ['Super Admin', adminEmail, null, hash, 'admin']
        );

    } else {
        console.log(` Admin already created`);
    }
}

module.exports = initDB;