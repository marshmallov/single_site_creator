import nodemailer from 'nodemailer';

export async function POST(req) {
  const formData = await req.formData();

  const name = formData.get('name');
  const surname = formData.get('surname');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: email,
      to: 'mar.s.job@outlook.com', // You can also use process.env.RECEIVER_EMAIL
      subject: `New Contact Message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Surname:</strong> ${surname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ message: "Something went wrong." }), { status: 500 });
  }
}
