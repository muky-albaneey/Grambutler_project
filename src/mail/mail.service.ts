/* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//     private transporter: nodemailer.Transporter;

//     constructor(){

//         this.transporter = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//               user: "c848dd42d3c9f4",
//               pass: "fe45f8091abbc5"
//             }
//           });

//     }

//     async dispatchEmail(to: string, subject: string, text: string, html?:string): Promise<void>{
//         const mail = {
//             from : "mukyalbani1@ggmail.com",
//             to,
//             subject,
//             text
//         }

//         try {
//             await this.transporter.sendMail(mail);
//             console.log('email is working');
            
//         } catch (error) {
//             console.log(error, 'in sending emails');
//         }
//     }
// }
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MailService {
    private readonly klaviyoApiKey = 'your_klaviyo_private_api_key'; // Replace with your Klaviyo private API key
    private readonly klaviyoUrl = 'https://a.klaviyo.com/api/v1/email/send'; // Klaviyo email API endpoint

    async dispatchEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const payload = {
            to: [{ email: to }],
            from_email: "your-email@example.com", // Use a verified Klaviyo sender email
            subject: subject,
            text: text,
            html: html || text, // Default to text if HTML isn't provided
        };

        try {
            const response = await axios.post(this.klaviyoUrl, payload, {
                headers: {
                    'Authorization': `Klaviyo-API-Key ${this.klaviyoApiKey}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Email sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending email:', error.response?.data || error.message);
        }
    }
}
