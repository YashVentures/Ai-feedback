import { transporter } from '@/lib/mailer';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: `"True Feedback" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'True Feedback – Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="margin-bottom: 8px;">Hello, ${username}!</h2>
          <p style="color: #374151;">Use the code below to verify your email address. It expires in 1 hour.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 24px 0; color: #111827;">
            ${verifyCode}
          </div>
          <p style="color: #6b7280; font-size: 13px;">If you did not sign up for True Feedback, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
