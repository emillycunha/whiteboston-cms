-- Table: blogs
CREATE TABLE public.blogs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    status TEXT DEFAULT 'published',
    category TEXT,
    tags TEXT,
    slug TEXT NOT NULL,
    image TEXT NOT NULL
);

-- Table: contacts
CREATE TABLE public.contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    company TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    owner_id INTEGER NOT NULL,
    org_id INTEGER REFERENCES public.organization(id) ON DELETE SET NULL
);

-- Table: leads
CREATE TABLE public.leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    interest TEXT,
    assigned_to INTEGER,
    owner_id INTEGER NOT NULL,
    org_id INTEGER REFERENCES public.organization(id) ON DELETE SET NULL,
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: tasks
CREATE TABLE public.tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    owner_id INTEGER NOT NULL,
    org_id INTEGER REFERENCES public.organization(id) ON DELETE SET NULL,
    due_date TIMESTAMP,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority TEXT DEFAULT 'normal'
);

-- Table: users
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    auth_user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'Editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    org_id INTEGER REFERENCES public.organization(id) ON DELETE SET NULL,
    CONSTRAINT fk_auth_user FOREIGN KEY (auth_user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Table: tickets
CREATE TABLE public.tickets (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER, 
    assigned_to INTEGER, 
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'normal', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    organization TEXT
);

-- Table: organization
CREATE TABLE public.organization (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    web_domain TEXT
);