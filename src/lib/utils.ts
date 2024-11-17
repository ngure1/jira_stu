const nodemailer = require("nodemailer");

export async function sendInvitationEmail(
	email: string,
	invitationLink: string
) {
	// Configure your email transport (using Nodemailer as an example)
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	// Define the email options
	const mailOptions = {
		from: process.env.EMAIL_USERNAME,
		to: email,
		subject: "You're Invited to Join a Project!",
		text: `You've been invited to join a project. Click here to accept the invitation: ${invitationLink}`,
		html: `<p>You've been invited to join a project.</p><p>Click <a href="${invitationLink}">here</a> to accept the invitation.</p>`,
	};

	// Send the email
	await transporter.sendMail(mailOptions);
}
