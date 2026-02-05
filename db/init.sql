-- Enable Foreign Keys
PRAGMA foreign_keys = ON;

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    nic TEXT NOT NULL UNIQUE,  -- Validated in API/Frontend
    dob TEXT NOT NULL,
    phone TEXT NOT NULL,       -- Validated for 10 digits
    address TEXT,
    civil_status TEXT NOT NULL CHECK(civil_status IN ('Married', 'Unmarried')),
    spouse_name TEXT,          -- Only if Married
    spouse_nic TEXT,
    spouse_dob TEXT,
    joined_date TEXT NOT NULL,
    membership_no TEXT UNIQUE,
    zone TEXT,
    is_life_member BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Positions Held Table (Many-to-One)
CREATE TABLE IF NOT EXISTS positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    year_appointed INTEGER NOT NULL,
    year_resigned INTEGER,
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Past Benefits (Death Benefits History)
CREATE TABLE IF NOT EXISTS past_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    deceased_name TEXT NOT NULL,
    relationship TEXT NOT NULL, -- Parent, Spouse, Child, etc.
    year_death INTEGER,
    amount REAL,
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Nominees (Future Beneficiaries)
CREATE TABLE IF NOT EXISTS nominees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    address TEXT,
    share_percentage REAL DEFAULT 0,
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Other Benefits (Non-Death) - Optional based on requirements, adding just in case
CREATE TABLE IF NOT EXISTS other_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    year_received INTEGER,
    amount REAL,
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);
