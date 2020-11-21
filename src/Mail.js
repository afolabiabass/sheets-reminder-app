const nodemailer = require('nodemailer');
const Twig = require('twig');
const { mail: config }= require('../config')

class Mail {
  constructor() {
    this.options = {};
    this.data = {};
    this.templatePath = '';
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: {
        user: config.username,
        pass: config.password
      }
    });
  }

  set from(email) {
    this.options.from = `Your Reminder <${email}>`;
  }

  set to(email) {
    if (this.options.to) {
      this.options.to.push(email);
    } else {
      this.options.to = [];
      this.options.to.push(email);
    }
  }

  set subject(subject) {
    this.options.subject = subject;
  }

  set template(path) {
    this.templatePath = path;
  }

  with(key, data) {
    this.data[key] = data;
    return this;
  }

  send() {
    Twig.renderFile(this.templatePath, this.data, function (error, rendered) {
      if (error) {
        return console.log(error)
      }
      this.options.html = rendered;
      this.transport.sendMail(this.options, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
    }.bind(this));

  }

}

module.exports = Mail;
