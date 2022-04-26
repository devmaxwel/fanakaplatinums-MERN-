import sendGrid from "@sendgrid/mail";

export class sendGridEmail {
  static async sendResetPasswordEmail(email, token, id) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: `${email}`,
      from: `${process.env.VERIFIED_SENDER}`, // Change to your verified sender
      subject: "RESET YOUR PASSWORD",
      text: `Follow this link to reset your password: ${process.env.BASE_URL}/${id}/${token}`,
    };
    return sendGrid
      .send(msg)
      .then(() => {
        console.log(`password rest link has been sent to: ${email}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  

}
