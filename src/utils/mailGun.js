// const mailGun = require('mailgun-js');
// const dotenv = require('dotenv');

// dotenv.config({
//     path: '../../configs/config.env'
// })

// const sendMail = mailGun(
//     {
//         apiKey:process.env.MAILGUN_API_KEY,
//         domain:process.env.MAILGUN_DOMAIN
//     }
// )

// module.exports = sendMail;

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: 'key-6fcbe8ffaae80e4549a1cf3c1250b746', domain: 'https://api.mailgun.net/v3/sandbox473c6f4883d8431785828eaff7aaab42.mailgun.org'});

const data = {
	from: 'Excited User <me@gmail.com>',
	to: 'sammyview81@gmail.com',
	subject: 'Hello',
	text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});