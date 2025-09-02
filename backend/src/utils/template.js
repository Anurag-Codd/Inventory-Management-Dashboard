export const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f6f9fc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f9fc; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color:#4f46e5; padding:20px;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">Inventory Management</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin:0 0 15px;">
                  We received a request to reset your password for your <strong>Inventory Management Admin</strong> account.
                </p>
                <p style="margin:0 0 15px;">Please use the following One-Time Password (OTP) to reset your password:</p>
                
                <!-- OTP Box -->
                <div style="text-align:center; margin:30px 0;">
                  <span style="display:inline-block; background:#4f46e5; color:#ffffff; font-size:28px; font-weight:bold; letter-spacing:4px; padding:15px 30px; border-radius:8px;">
                    {OTP}
                  </span>
                </div>

                <p style="margin:0 0 15px;">This OTP is valid for <strong>30 minutes</strong>. Please do not share it with anyone.</p>
                <p style="margin:0;">If you didn’t request a password reset, you can safely ignore this email.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f0f2f5; padding:20px; font-size:14px; color:#555555;">
                <p style="margin:0;">© 2025 Inventory Management Admin. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
