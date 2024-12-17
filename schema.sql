-- Table: blogs
-- Stores blog posts with metadata
CREATE TABLE blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    published_at TEXT,
    status TEXT DEFAULT 'published',
    category TEXT,
    tags TEXT,
    slug TEXT NOT NULL,
    image TEXT NOT NULL
);

-- Table: contacts
-- Stores customer or client contact information
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    company TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    user_id INTEGER NOT NULL
);

-- Table: leads
-- Stores potential leads for sales or engagement
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    interest TEXT,
    assigned_to INTEGER,
    user_id INTEGER NOT NULL,
    notes TEXT,
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table: tasks
-- Stores tasks or to-do items
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER, 
    user_id INTEGER NOT NULL,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    priority TEXT DEFAULT 'normal' 
);

-- Table: users
-- Stores user accounts
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user', 
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    organization TEXT
);

-- Table: tickets
-- Stores support tickets for customer issues
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER, 
    assigned_to INTEGER, 
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'normal', 
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT,
    organization TEXT
);

-- Indexes for optimization
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Enable foreign key support (only documented; not strictly enforced in D1)
PRAGMA foreign_keys = ON;
