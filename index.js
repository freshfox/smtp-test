#!/usr/bin/env node
const prompt = require('prompt');
const fs = require('fs');

const defaultFilePath = './inputs.json';
let defaults = {};

if (fs.existsSync(defaultFilePath)) {
	defaults = JSON.parse(fs.readFileSync(defaultFilePath));
}

prompt.start();

prompt.get([{
	name: 'server',
	description: 'SMTP Server',
	type: 'string',
	default: defaults.server,
	required: true
}, {
	name: 'port',
	description: 'Port',
	type: 'number',
	default: defaults.port,
	required: true
}, {
	name: 'username',
	description: 'Username',
	type: 'string',
	default: defaults.username,
	required: true
}, {
	name: 'sender',
	description: 'Sender',
	type: 'string',
	default: defaults.sender,
	required: true
}, {
	name: 'password',
	description: 'Password',
	type: 'string',
	hidden: true,
	default: '',
	required: true
}, {
	name: 'to',
	description: 'Send mail to',
	type: 'string',
	default: defaults.to,
	required: true
}], function (err, result) {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	let inputs = JSON.stringify(Object.assign({}, result, {
		password: null
	}));
	fs.writeFileSync(defaultFilePath, inputs);

	sendMail(result.server, result.port, result.username, result.sender, result.password, result.to);
});

function sendMail(server, port, username, sender, password, to) {
	const nodemailer = require('nodemailer');

	// create reusable transporter object using the default SMTP transport
	let config = {
		host: server,
		port: port,
		auth: {
			user: username,
			pass: password
		}
	};
	let transporter = nodemailer.createTransport(config);

	// setup email data with unicode symbols
	let mailOptions = {
		from: sender, // sender address
		to: to, // list of receivers
		subject: 'Test Mail ✔', // Subject line
		text: 'This is a test mail sent by smtp-test!',
	};

// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}
		console.log('Message %s sent: %s', info.messageId, info.response);
		process.exit();
	});
}