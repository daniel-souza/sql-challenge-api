import nodemailer from 'nodemailer';
import { google } from 'googleapis';

class Mailer {
    async sendMail(userDoc, token) {

        const user = process.env.CLIENT_USER;
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;
        const refreshToken = process.env.REFRESH_TOKEN;
        const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
        oAuth2Client.setCredentials({ refresh_token: refreshToken })

        try {
            const accessToken = await oAuth2Client.getAccessToken()

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user,
                    clientId,
                    clientSecret,
                    refreshToken,
                    accessToken
                }
            });
            const info = await transporter.sendMail({
                from: `Daniel Souza <${user}>`,
                to: userDoc.email,
                replyTo: "dssouzadan@gmail.com",
                subject: "SQL Challenges: Account validation",
                html: `<p><b>Welcome ${userDoc.name},</b></p>`
                    + `<p>It is a pleasure to register you in our platform.</p>`
                    + `<p>To validate your account, please, <a href="http://${process.env.API_HOST}/signup/activation?token=${token}">click here</a>.</p>`
                    + `<p>Cheers,<br/>Daniel Souza</p>`
            });
            return { success: info }
        } catch (err) {
            return { fail: err }
        }
    }
}

export default new Mailer();