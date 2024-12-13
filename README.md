# **CMS WhiteBoston**

CMS WhiteBoston is a lightweight, open-source Content Management System (CMS) built specifically to empower Astro sites. Designed with scalability and simplicity in mind, CMS WhiteBoston integrates seamlessly with NuxtHub, a Cloudflare-powered platform, ensuring lightning-fast performance, low cost, and full-stack capabilities.

Whether you're building static or dynamic Astro sites, CMS WhiteBoston offers an easy-to-use and flexible backend for managing your content while scaling globally.

---

## **Features**

- Full-stack Nuxt.js application with server-side rendering (SSR).
- APIs for dynamic content delivery, powered by NuxtHub.
- Cloudflare D1 database integration for content storage.
- Automatic deployments via GitHub integration with NuxtHub.

---

## **Setup**

### **Requirements**

- Node.js >= 16.x
- NuxtHub account
- Cloudflare account
- Wrangler CLI (optional, for local testing)

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

1. Push your changes to the `main` branch.
2. NuxtHub will automatically build and deploy your project globally.

---

## **Database**

The project uses Cloudflare D1 for storing blog data.

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

## **Contributing**

Feel free to submit issues or pull requests for improvements and new features.

---

## **License**

This project is licensed under the [MIT License](LICENSE).
