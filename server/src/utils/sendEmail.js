import { Resend } from "resend"

let resend

export const sendOtpEmail = async (to, name, otp) => {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY)
    }

    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Your OTP for Password Reset - Clarious",
        html: `
            <!DOCTYPE html>
            <html>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                                <tr>
                                    <td style="padding: 32px; border-bottom: 1px solid #eeeeee;">
                                        <h2 style="margin: 0; color: #333333;">Clarious</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 32px;">
                                        <p style="margin: 0 0 16px; color: #555555; font-size: 15px;">Hi ${name},</p>
                                        <p style="margin: 0 0 24px; color: #555555; font-size: 15px;">
                                            Use the following One-Time Password (OTP) to reset your password. This OTP is valid for <strong>10 minutes</strong>.
                                        </p>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 16px 0 24px;">
                                                    <div style="display: inline-block; background-color: #f0f1f5; border-radius: 8px; padding: 16px 40px;">
                                                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 12px; color: #111111;">${otp}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 0 0 8px; color: #555555; font-size: 15px;">
                                            If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #eeeeee;">
                                        <p style="margin: 0; color: #999999; font-size: 12px;">&copy; ${new Date().getFullYear()} Clarious. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    })
}
