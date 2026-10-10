import nodemailer from "nodemailer";

const transporter = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

export async function sendMilestoneNotification(entry) {
  if (!transporter) {
    console.warn("Milestone email skipped: SMTP is not configured");
    return false;
  }

  await transporter.sendMail({
    from: process.env.NOTIFICATION_FROM || process.env.SMTP_USER,
    to: entry.ownerEmail,
    subject: `Your short link reached ${entry.milestone} clicks`,
    text: `Your short URL ${entry.shortID} has reached ${entry.clickCount} clicks.`,
  });
  return true;
}
