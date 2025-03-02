/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    private TOKEN = "9d368713523310ef79590efb474a0bdd";

    constructor(){
        this.transporter = nodemailer.createTransport(
            MailtrapTransport({
                token: this.TOKEN
            })
        );
    }
   
    async dispatchEmail(to: string, subject: string, text: string, html?:string): Promise<void>{
        const mail = {
            from : "hello@demomailtrap.com",
            to,
            subject,
            text
        }

        try {
            await this.transporter.sendMail(mail);
            console.log('email is working');
            
        } catch (error) {
            console.log(error, 'in sending emails');
        }
    }

    async dispatchVerificationEmail(fullName: string, to?: string,  html?:string): Promise<void>{
        const mail = {
            from : { address: "hello@demomailtrap.com", name: "Email Verification Test" },
            to: ["abdulwahababbas300@gmail.com"],
            template_uuid: "1bf468f3-ed4a-4a51-98a8-c1f435e12e1a",
            template_variables: {
                "name": fullName
            }
        }

        try {
            await this.transporter.sendMail(mail);
            console.log('email is working');
            
        } catch (error) {
            console.log(error, 'in sending emails');
        }
    }
}
// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class MailService {
//     private readonly klaviyoApiKey = 'pk_5dcce9c78ab6b179e919dc254111e0c12b'; // Replace with your Klaviyo private API key
//     private readonly klaviyoUrl = 'https://a.klaviyo.com/api/v1/email/send'; // Klaviyo email API endpoint

//     async dispatchEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
//         const payload = {
//             to: [{ email: to }],
//             from_email: "Tim@grambutler.com", // Use a verified Klaviyo sender email
//             subject: subject,
//             text: text,
//             html: html || text, 
//         };

//         try {
//             const response = await axios.post(this.klaviyoUrl, payload, {
//                 headers: {
//                     'Authorization': `${this.klaviyoApiKey}`,
//                     'Content-Type': 'application/json',
//                 }
//             });

//             console.log('Email sent successfully:', response.data);
//         } catch (error) {
//             console.error('Error sending email:', error.response?.data || error.message);
//         }
//     }
// }

// import axios from 'axios';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UserService {
//   private klaviyoApiKey = 'YOUR_KLAVIYO_PRIVATE_API_KEY'; // Store this in an environment variable

//   async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
//     const payload = {
//       to: [{ email: to }], // Array of recipients
//       from_email: 'your-email@example.com', // Your verified sender email
//       from_name: 'Your Business Name', // Sender name
//       subject: subject,
//       content: [
//         {
//           type: 'text/plain',
//           value: text, // Plain text content
//         },
//         {
//           type: 'text/html',
//           value: html || text, // HTML content
//         },
//       ],
//     };

//     try {
//       const response = await axios.post('https://a.klaviyo.com/api/emails/send', payload, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
//         },
//       });

//       console.log('Email sent successfully:', response.data);
//     } catch (error) {
//       console.error('Error sending email:', error.response?.data || error.message);
//     }
//   }

//   async registerUser(email: string, name: string): Promise<void> {
//     console.log(`User ${name} with email ${email} created!`);

//     // Send welcome email
//     await this.sendEmail(email, 'Welcome!', 'Thank you for signing up!');
//   }
// }



