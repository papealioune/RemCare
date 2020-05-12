/**==============================API initialisation Start==============================*/
const client = require('./messagecenter.helpers').client
const config = require('../config/config')
/**==============================Functions initialisation Start==============================*/
function sendMessageWhatsApp(to, message) {
  console.log("sending whatsapp message: " + to + " message: ", message)
  if (to == "+undefined") {
    return
  } else {
    client.messages
      .create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${to}`
      })
      .then(message => console.log(message.sid))
      .done();
  }
}

function sendMessage(to, message) {
  console.log("sending message: " + to + " message: ", message)
  if (to == "+undefined") {
    return
  } else {
    client.messages
      .create({
        body: message,
        from: '+16303184195',
        messagingServiceSid:config.messagingServiceSid ,
        to: `${to}`
      })
      .then(message => console.log(message.sid))
      .done();
  }
}
module.exports = {
  sendMessageWhatsApp,
  sendMessage
}