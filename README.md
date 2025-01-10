# **CMS WhiteBoston**

CMS WhiteBoston is a lightweight, open-source Content Management System (CMS) built specifically to empower Astro sites. Designed with scalability and simplicity in mind, CMS WhiteBoston integrates seamlessly with modern platforms, ensuring lightning-fast performance, low cost, and full-stack capabilities.

Whether you're building static or dynamic Astro sites, CMS WhiteBoston offers an easy-to-use and flexible backend for managing your content while scaling globally.

---

## **Features and Tech Stack**

- **Nuxt.js**: Framework for building Vue.js applications.
- **Supabase**: Authentication and database management.
- **Tailwind CSS**: Rapid UI development.
- **Pinia**: State management with persisted state support.
- **Netlify**: Hosting and continuous deployment.

---

## **Setup**

### **Requirements**

- Node.js >= 16.x
- Supabase account
- Netlify account
- GitHub account

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/emillycunha/cms-whiteboston.git
   cd cms-whiteboston
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the `.env` file and update with your environment variables:

   ```bash
   cp .env.example .env
   ```

4. Add your environment variables to Netlify:
   - Go to your site settings in Netlify.
   - Navigate to "Environment Variables".
   - Add the following keys with your values:
     - `NUXT_SUPABASE_URL`
     - `NUXT_SUPABASE_ANON_KEY`

---

## **Database**

The project uses **Supabase** to store and manage CMS content data.

### How to Set Up the Database

1. **Create Tables:**

   - Open the `schema.sql` file included in the repository.
   - Copy the SQL commands from the file.
   - Paste and execute the commands in the SQL editor of your Supabase project.

   This script creates the following tables:

   - `users`
   - `collections`
   - `fields`
   - `content`
   - `organizations`
   - `organization_members`
   - `tickets`

2. **Enable RLS and Apply Policies:**

   - Enable RLS for tables requiring restricted access:

     ```sql
     ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
     ALTER TABLE users ENABLE ROW LEVEL SECURITY;
     ```

   - Add example policies as shown below to secure access based on `organization_id` or `auth.uid()`.

3. **Testing the Database:**
   - Verify that users can only access data tied to their organization or ID using the provided RLS policies.

This ensures that unauthorized access is mitigated and that data integrity remains robust.

---

## Row-Level Security (RLS) Policies

For added security, implement Row-Level Security (RLS) policies. These policies restrict data access based on user authentication or other criteria.

### Example Policy for Organization ID

To allow access to rows based on a user's membership in an organization:

```sql
-- Policy for collections table
CREATE POLICY "Allow access to organization collections"
ON collections
FOR SELECT, INSERT, UPDATE, DELETE
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

-- Enable RLS for the collections table
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
```

### Example Policy for User ID

To restrict access to rows that match the authenticated user's ID:

```sql
-- Policy for users table
CREATE POLICY "Allow access to own user data"
ON users
FOR SELECT, UPDATE
USING (id = auth.uid());

-- Enable RLS for the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

---

## **Development**

### **Run Locally**

Start the development server:

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## **Build**

To create a production build:

```bash
npm run build
```

---

## **Deployment**

### **Automatic Deployment**

1. Connect your GitHub repository to Netlify.
2. Push your changes to the `main` branch.
3. Netlify will automatically build and deploy your project globally.

### **Environment Variables**

Make sure to add your environment variables to Netlify as described in the setup section.

- NUXT_SUPABASE_URL=your_supabase_url
- NUXT_SUPABASE_ANON_KEY=your_supabase_anon_key

---

## **Contributing**

Feel free to fork this repository and submit a pull request with any improvements or fixes. Please ensure all changes are thoroughly tested before submitting.

---

## **License**

This project is licensed under the [MIT License](LICENSE).
