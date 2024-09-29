import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: 'noreply@bhadaurialand.site', // Use your verified domain email
      to: email, // This can still be your Gmail for testing
      subject: 'Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    
    console.log('Email Response:', response);
    
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
