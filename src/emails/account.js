const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "antspathis@gmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to the app, ${name} let me know how you get along with the app`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "antspathis@gmail.com",
    subject: "Sorry for leaving",
    text: `Sorry for going ${name}`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
