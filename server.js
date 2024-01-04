const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const config = require('./config'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const { accountSid, authToken, phoneNumber } = config.twilio;
const client = twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send-sms', (req, res) => {
  const toNumber = req.body.Number;
  const messageBody = req.body.messageBody;

  client.messages.create({
    body: messageBody,
    from: phoneNumber,
    to: toNumber
  })
  .then(message => {
    console.log("SMS sent successfully:", message.sid);
    res.json({ success: true });
  })
  .catch(error => {
    console.error('Error sending SMS:', error.message);
    res.status(500).json({ error: 'Error sending SMS. Check the server logs for details.' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
