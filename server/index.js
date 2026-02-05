import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Initialize Settings Table
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  INSERT OR IGNORE INTO settings (key, value) VALUES ('life_member_period', '20');
`);

// API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/settings', (req, res) => {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get('life_member_period');
    res.json({ life_member_period: row ? row.value : '20' });
});

app.post('/api/settings', (req, res) => {
    const { life_member_period } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run('life_member_period', life_member_period.toString());
    res.json({ success: true, life_member_period });
});

app.get('/api/members', (req, res) => {
    const members = db.prepare(`
    SELECT id, full_name, nic, phone, civil_status, membership_no, joined_date, is_life_member
    FROM members
    ORDER BY id DESC
  `).all();
    res.json(members);
});

app.post('/api/members', (req, res) => {
    const { bio, membership, positions, pastBenefits, otherBenefits, nominees, lifeMember } = req.body;

    const insertMember = db.prepare(`
    INSERT INTO members (
      full_name, nic, dob, phone, address, civil_status,
      spouse_name, spouse_nic, spouse_dob,
      joined_date, membership_no, zone,
      is_life_member, life_member_eligibility_date
    ) VALUES (
      @name, @nic, @dob, @phone, @address, @civilStatus,
      @spouseName, @spouseNic, @spouseDob,
      @joinedDate, @membershipNo, @zone,
      @isLifeMember, @lifeMemberDate
    )
  `);

    const insertPosition = db.prepare(`
    INSERT INTO positions (member_id, title, year_appointed, year_resigned)
    VALUES (@memberId, @title, @yearAppointed, @yearResigned)
  `);

    const insertPastBenefit = db.prepare(`
    INSERT INTO past_benefits (member_id, deceased_name, relationship, year_death, amount)
    VALUES (@memberId, @deceasedName, @relationship, @yearDeath, @amount)
  `);

    const insertOtherBenefit = db.prepare(`
    INSERT INTO other_benefits (member_id, description, year_received, amount)
    VALUES (@memberId, @description, @year, @amount)
  `);

    const insertNominee = db.prepare(`
    INSERT INTO nominees (member_id, name, relationship, address)
    VALUES (@memberId, @name, @relationship, @address)
  `);

    const createMemberTransaction = db.transaction((data) => {
        const result = insertMember.run({
            name: data.bio.name,
            nic: data.bio.nic,
            dob: data.bio.dob,
            phone: data.bio.phone,
            address: data.bio.address,
            civilStatus: data.bio.civilStatus,
            spouseName: data.bio.spouse?.name || null,
            spouseNic: data.bio.spouse?.nic || null,
            spouseDob: data.bio.spouse?.dob || null,
            joinedDate: data.membership.joinedDate,
            membershipNo: data.membership.membershipNo,
            zone: data.membership.zone,
            isLifeMember: data.lifeMember.isLifeMember ? 1 : 0,
            lifeMemberDate: data.lifeMember.eligibilityDate || null
        });

        const memberId = result.lastInsertRowid;

        for (const pos of data.positions) {
            insertPosition.run({ memberId, title: pos.title, yearAppointed: pos.yearAppointed, yearResigned: pos.yearResigned || null });
        }
        for (const ben of data.pastBenefits) {
            insertPastBenefit.run({ memberId, deceasedName: ben.deceasedName, relationship: ben.relationship, yearDeath: ben.yearDeath, amount: ben.amount });
        }
        for (const ben of data.otherBenefits) {
            insertOtherBenefit.run({ memberId, description: ben.description, year: ben.year, amount: ben.amount });
        }
        for (const nom of data.nominees) {
            insertNominee.run({ memberId, name: nom.name, relationship: nom.relationship, address: nom.address });
        }
        return memberId;
    });

    try {
        const newMemberId = createMemberTransaction(req.body);
        res.json({ success: true, memberId: newMemberId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Fallback for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});