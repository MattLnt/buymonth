import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Fiderio <noreply@skillio.be>',
      to,
      subject,
      html,
    })
    console.log('Email sent:', JSON.stringify(result))
  } catch (error) {
    console.error('Email error:', error.message)
  }
}