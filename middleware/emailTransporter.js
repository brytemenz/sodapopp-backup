const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "Gmail",
    // port: 465,
    // secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'sodapopp40@gmail.com',
      pass: 'exufxeynnkcfdwqm'
    }
  });
  module.exports = transporter
