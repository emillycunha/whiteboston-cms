-- =========================================================
-- SQL File to Set Up a Dynamic Schema in Supabase
-- For an open-source project to manage collections, content, users, and organizations.
-- =========================================================
-- Purpose: Provide a flexible system for managing collections and content, 
--          with multi-tenancy support for organizations.
-- Requirements: 
-- 1. Add this SQL file to Supabase to create the necessary tables.
-- 2. Enable Row-Level Security (RLS) on each table after creation.
-- =========================================================

-- ============================
-- USERS TABLE
-- Stores all users, linked to Supabase auth.users
-- ============================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase's built-in auth.users table
    name TEXT NOT NULL, 
    preferences JSONB DEFAULT '{}'::JSONB, -- JSONB column to store user settings (e.g., dark mode, notifications)
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- ORGANIZATIONS TABLE
-- Stores organizations (multi-tenancy support)
-- ============================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique ID for each organization
    name TEXT NOT NULL, -- Organization name
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Links to the owner (user)
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- ORGANIZATION MEMBERS TABLE
-- Links users to organizations, with role-based access
-- ============================
CREATE TABLE organization_members (
    id SERIAL PRIMARY KEY, -- Unique ID for each membership
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Linked to the organization
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Linked to the user
    role TEXT NOT NULL DEFAULT 'member', -- Role in the organization (e.g., admin, editor, member)
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- COLLECTIONS TABLE
-- Stores dynamic collections (e.g., Blogs, Tasks, Leads)
-- ============================
CREATE TABLE collections (
    id SERIAL PRIMARY KEY, -- Unique ID for each collection
    name TEXT NOT NULL, -- Collection name (e.g., Blog, Tasks)
    slug TEXT UNIQUE NOT NULL, -- URL-safe identifier for the collection
    description TEXT, -- Optional description of the collection
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Linked to the organization
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- FIELDS TABLE
-- Defines the schema (fields) for each collection
-- ============================
CREATE TABLE fields (
    id SERIAL PRIMARY KEY, -- Unique ID for each field
    collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE, -- Linked to the collection
    name TEXT NOT NULL, -- Field name (e.g., title, status)
    type TEXT NOT NULL, -- Field type (e.g., text, number, boolean, date)
    is_required BOOLEAN DEFAULT FALSE, -- Whether the field is required
    default_value TEXT DEFAULT NULL, -- Optional default value
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- CONTENT TABLE
-- Stores dynamic content for all collections
-- ============================
CREATE TABLE content (
    id SERIAL PRIMARY KEY, -- Unique ID for each content item
    collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE, -- Linked to the collection
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Linked to the organization
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Linked to the user who created this content
    data JSONB NOT NULL, -- Dynamic content data stored in JSONB format
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- NOTES:
-- 1. Enable RLS (Row-Level Security) on all tables to secure data.
--    Example: ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- 2. Define policies to restrict access to rows based on user roles and organization memberships.
-- 3. Add GIN indexes on the data column in the content table for faster JSONB queries.
--    Example: CREATE INDEX content_data_gin ON content USING gin(data);
-- ============================

-- ============================
-- SAMPLE RLS POLICY (Optional)
-- Enable and define RLS for one of the tables (e.g., content)
-- Uncomment the lines below and customize as needed:
-- ============================
-- ALTER TABLE content ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow access to user content" 
-- ON content 
-- FOR SELECT USING (
--     auth.uid() IN (
--         SELECT user_id FROM organization_members 
--         WHERE organization_id = content.organization_id
--     )
-- );
-- ============================

-- Done! 🎉
-- Add this SQL file to your Supabase project and start building!