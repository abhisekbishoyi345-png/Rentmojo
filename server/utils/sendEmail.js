const SibApiV3Sdk = require("sib-api-v3-sdk");

const sendEmail = async ({ to, subject, html, attachment }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        email: process.env.EMAIL_USER,
        name: "RentMojo",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    if (attachment) {
      const fs = require("fs");
      const file = fs.readFileSync(attachment.path).toString("base64");

      sendSmtpEmail.attachment = [
        {
          content: file,
          name: attachment.filename,
        },
      ];
    }

    const response = await tranEmailApi.sendTransacEmail(sendSmtpEmail);

    console.log("EMAIL SENT SUCCESSFULLY ✅", response.messageId);

    return true;
  } catch (err) {
    console.log("BREVO API ERROR ❌", err.response?.text || err.message);
    return false;
  }
};

module.exports = sendEmail;