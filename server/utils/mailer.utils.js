import nodemailer from "nodemailer"
import { htmlToText } from "html-to-text";
const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: "crmvedic40@gmail.com",
      pass: "lqnsbcstddoihxzy", 
    },tls : {
        rejectUnauthorized : false
    }
})



export async function sendForgotPasswordEmail(data) {
    try {
      
      const info = await transporter.sendMail({
        from: '"Vedic" <crmvedic40@gmail.com>', 
        to: data.email, 
        subject: "Password Reset", 
            html:`<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP for Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .header {
                    background-color: #28a745; /* Green header */
                    color: white;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                }
                .container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #333333;
                    font-size: 22px;
                }
                p {
                    font-size: 16px;
                    color: #555555;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #28a745; /* Green button */
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .button:hover {
                    background-color: #218838; /* Darker green on hover */
                }
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    color: #888888;
                    text-align: center;
                }
            </style>
            </head>
            <body>
            <div class="header">
            OTP for Password Reset
            </div>
            <div class="container">
                <h1>Hello,</h1>
                <p>We received a request to reset the password for your account on <strong>Vedic's Website</strong>. Please use the OTP (One-Time Password) below to reset your password:</p>
                <h2 style="color: #28a745;">${data.otp}</h2>
                <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                <p>Thanks,</p>
                <p>The Vedic's Website Team</p>
                <div class="footer">
                    <p>If you did not request this, please contact our support team immediately.</p>
                </div>
            </div>
            </body>
            </html>
            
    `
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
    console.error("Error sending email:", error);
    return false;
    }}

    export async function sendResetPasswordEmail(data) {
        try {
        
        const info = await transporter.sendMail({
            from: '"Vedic" <crmvedic40@gmail.com>', 
            to: data.email, 
            subject: "Password Reset Successfully.", 
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Successful</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .header {
                    background-color: #28a745; /* Green header */
                    color: white;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                }
                .container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #333333;
                    font-size: 22px;
                }
                p {
                    font-size: 16px;
                    color: #555555;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    color: #888888;
                    text-align: center;
                }
            </style>
            </head>
            <body>
            <div class="header">
               Password Reset Successful
            </div>
            <div class="container">
                <h1>Hello,</h1>
                <p>Your password for your account on <strong>Vedic's Website</strong> has been successfully reset. You can now use your new password to log in.</p>
                <p>If you did not request this password change, please contact our support team immediately to secure your account.</p>
                <p>Thanks,</p>
                <p>The Vedic's Website Team</p>
                <div class="footer">
                    <p>If you have any concerns, please reach out to our support team.</p>
                </div>
            </div>
            </body>
            </html>
            `
            
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
   console.error("Error sending email:", error);
   return false;
 }}

 export async function sendApplicationConfirmationEmail(customer) {
    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
                border-radius: 10px;
            }
            .header { 
                background-color: #6a11cb; 
                color: white; 
                text-align: center; 
                padding: 20px; 
                border-radius: 10px 10px 0 0;
            }
            .content { 
                background: white; 
                padding: 20px; 
                border-radius: 0 0 10px 10px;
            }
            .application-id {
                background-color: #f1f1f1;
                padding: 10px;
                text-align: center;
                font-size: 1.2em;
                font-weight: bold;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Application Confirmation</h1>
            </div>
            <div class="content">
                <p>Dear ${customer.customerName},</p>
                <p>Your application for Vedic Name Selection has been successfully submitted!</p>
                
                <div class="application-id">
                    Application ID: ${customer.customerID}
                </div>

                <p>We will process your request and get back to you soon.</p>
                <p>Thank you for choosing our Vedic Name Selection Service.</p>

                <p>Best Regards,<br>Vedic Name Selection Team</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: 'Vedic Name Selection - Application Confirmation',
        html: emailTemplate,
        text: htmlToText(emailTemplate)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}
