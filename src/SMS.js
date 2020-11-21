const { sms: options }= require('../config')
const AfricasTalking = require('africastalking')(options);

class SMS {
  constructor() {
    this.message = {};
  }

  set to(email) {
    if (this.message.to) {
      this.message.to.push(email);
    } else {
      this.message.to = [];
      this.message.to.push(email);
    }
  }

  set content(payload) {
    this.message.message = payload;
  }

  async send() {
    const sms = AfricasTalking.SMS;
    await sms.send(this.message)
      .then((response) => {
        if (response.SMSMessageData.Recipients.length > 0) {
          if (response.SMSMessageData.Recipients[0].status === 'Success') {
            console.log('Sms sent')
          }
        }
      })
      .catch((e) => {
        return console.log(e)
      });
  }
}

module.exports = SMS;
