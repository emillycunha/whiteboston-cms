# **CMS WhiteBoston**

CMS WhiteBoston is a lightweight, open-source Content Management System (CMS) built specifically to empower Astro sites. Designed with scalability and simplicity in mind, CMS WhiteBoston integrates seamlessly with NuxtHub, a Cloudflare-powered platform, ensuring lightning-fast performance, low cost, and full-stack capabilities.

Whether you're building static or dynamic Astro sites, CMS WhiteBoston offers an easy-to-use and flexible backend for managing your content while scaling globally.

---

## **Features**

- Full-stack Nuxt.js application with server-side rendering (SSR) and API routes powered by Nitro.
- Dynamic content delivery using NuxtHub for seamless hosting and deployment.
- Cloudflare D1 database integration for content storage.
- Automatic deployments via GitHub integration with NuxtHub.
- Tailwind CSS for rapid UI development.
- Pinia state management with persisted state support.

---

## **Setup**

### **Requirements**

- Node.js >= 16.x
- NuxtHub account
- Cloudflare account
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

The project uses Cloudflare D1 for storing content data.

### **Create Tables**

To set up the database schema, execute the provided `schema.sql` file:

1. Review the `schema.sql` file included in the repository. Modify it if needed.

2. Import the tables into your D1 database:
   ```bash
   wrangler d1 execute cms-whiteboston --file=schema.sql
   ```

This script creates all required tables for the CMS.

### **Manage the Database**

- View tables:

  ```bash
  wrangler d1 execute cms-whiteboston --command "SELECT name FROM sqlite_master WHERE type='table';" --remote
  ```

- Run migrations:
  ```bash
  wrangler d1 migrations apply cms-whiteboston --remote
  ```

---

## **Development**

### **Run Locally**

Start the development server:

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) to view the site.

### **Access the API**

API endpoints are available under `/api`. For example:

- Fetch blogs: `GET /api/blogs`
- Fetch a blog by ID: `GET /api/blogs/:id`

---

## **Deployment**

### **Automatic Deployment via NuxtHub**

1. Connect your GitHub repository to NuxtHub.
2. Push your changes to the `main` branch.
3. NuxtHub will automatically build and deploy your project globally.

---

### **Environment Variables**

- `NUXT_HUB_PROJECT_KEY`=NuxtHub project key for automatic deployment.
- `CLOUDFLARE_ACCOUNT_ID`=Cloudflare D1 database credentials.
- `D1_DATABASE_NAME`=Cloudflare D1 database credentials.
- `D1_DATABASE_ID`=Cloudflare D1 database credentials.
- `API_KEY`= (optional) API key for securing endpoints.

---

## **Contributing**

Feel free to submit issues or pull requests for improvements and new features.

---

## **License**

This project is licensed under the [MIT License](LICENSE).
