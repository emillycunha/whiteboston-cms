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

The project uses Supabase for storing content data.

### **Create Tables**

To set up the database schema:

1. Open the `schema.sql` file included in the repository.
2. Copy the SQL commands from the file.
3. Paste and run the commands in the SQL editor of your Supabase project.

This script creates all required tables for the CMS.

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

NUXT_SUPABASE_URL=your_supabase_url
NUXT_SUPABASE_ANON_KEY=your_supabase_anon_key

---

## **Contributing**

Feel free to fork this repository and submit a pull request with any improvements or fixes. Please ensure all changes are thoroughly tested before submitting.

---

## **License**

This project is licensed under the [MIT License](LICENSE).
