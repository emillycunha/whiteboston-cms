# **CMS WhiteBoston**

CMS WhiteBoston is a lightweight, open-source Content Management System (CMS) built specifically to empower Astro sites. Designed with scalability and simplicity in mind, CMS WhiteBoston integrates seamlessly with NuxtHub, a Cloudflare-powered platform, ensuring lightning-fast performance, low cost, and full-stack capabilities.

Whether you're building static or dynamic Astro sites, CMS WhiteBoston offers an easy-to-use and flexible backend for managing your content while scaling globally.

---

## **Features**

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

---

## **Database**

The project uses Supbase for storing content data.

### **Create Tables**

To set up the database schema, execute the provided `schema.sql` file:

1. Review the `schema.sql` file included in the repository. Modify it if needed.

2. Run SQL querie in Supbase.

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

## **Deployment**

### **Automatic Deployment via NuxtHub**

1. Connect your GitHub repository to Netlify.
2. Push your changes to the `main` branch.
3. Netlify will automatically build and deploy your project globally.

---

### **Environment Variables**

NUXT_SUPABASE_URL=your_supabase_url
NUXT_SUPABASE_ANON_KEY=your_supabase_anon_key

---

## **Contributing**

Feel free to submit issues or pull requests for improvements and new features.

---

## **License**

This project is licensed under the [MIT License](LICENSE).
