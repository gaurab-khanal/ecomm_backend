const nodemailer = require("nodemailer");

const mailHelper = async (options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const message = {
        from: 'khanalgaurab98@gmail.com', // sender address
        to: options.to, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        
      }
      
        // send mail with defined transport object
        await transporter.sendMail(message);

}
module.exports = mailHelper;