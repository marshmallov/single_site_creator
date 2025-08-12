
![Dashboard Screenshot](/public/images/ss1.png)


# 🖥️ Editable Single Page Website with Admin Dashboard

A **Next.js 15.3.2** application featuring:
- **Editable single-page content**
- **Admin authentication**
- **Dashboard to manage content**
- Built with **new Next.js routing systems** and **API routes**

---

## 🚀 Features
- **Public View** – Visitors see the main website page.
- **Admin Login** – Secure authentication to access the dashboard.
- **Admin Dashboard** – Edit text, images, and sections in real-time.
- **Responsive Design** – Works on desktop, tablet, and mobile.
- **SEO-friendly** – Uses Next.js optimizations for speed and discoverability.
- **Visitors** – Saves the visitors data in visitors.json and the file can be downloaded from admin dashboard.

---

## 📦 Tech Stack
- **Frontend**: [Next.js 15.3.2](https://nextjs.org/) + React
- **Styling**: Tailwind CSS 
- **Auth**: NextAuth.js 
- **Deployment**: Vercel / Any Node.js hosting


## Getting Started

First, install npm:

```bash
npm install
#or
npm i 
```

Second, run the development server:

```bash
npm run dev
```

Third you need to add your data(login , pasword) in .env file 
ADMIN_USERNAME=yourLogin
ADMIN_PASSWORD=yourPassword
NEXTAUTH_SECRET="-----Your Secret-----"

GMAIL_USER=yourmail@gmail.com
GMAIL_APP_PASSWORD=your app pasword 

Open [http://localhost:3000] with your browser to see the result.

You can login to admindashboard by [http://localhost:3000/adminLogin]


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
