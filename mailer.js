import nodemailer from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

export const mailer = nodemailer.createTransport({
	port: process.env.SENDER_PORT,
	host: process.env.SENDER_HOST,
	auth: {
		user: process.env.SENDER_MAIL,
		pass: process.env.SENDER_PASS,
	},
	secure: true,
});

const finishCallback = (error, info, reject, resolve) =>
	error ? reject(error) : resolve({ status: true, info });

export const sendMail = (mailData, type = "html") => {
	return new Promise((resolve, reject) => {
		const headersMail = {
			from: mailData.from
				? mailData.from
				: {
						address: process.env.SENDER_MAIL,
						name: process.env.SENDER_NAME,
				  },
			to: mailData.to,
			subject: mailData.subject,
		};
		switch (type) {
			case "html":
				mailer.sendMail(
					{
						...headersMail,
						html: mailData.content,
						attachments: mailData.attachments,
					},
					(err, info) => finishCallback(err, info, reject, resolve)
				);
				break;
			case "hbs":
				mailer.use(
					"compile",
					hbs({
						viewEngine: {
							extname: ".hbs",
							viewPath: path.join(__dirname, "../views/emails/"),
							layoutsDir: path.join(__dirname, "../views/emails/layouts"),
							defaultLayout: false,
							partialsDir: path.join(__dirname, "../views/emails/partials/"),
						},
						extName: ".hbs",
						viewPath: path.join(__dirname, "../views/emails"),
					})
				);
				mailer.sendMail(
					{
						...headersMail,
						template: mailData.template,
						context: { ...mailData.context },
						attachments: mailData.attachments,
					},
					(err, info) => finishCallback(err, info, reject, resolve)
				);
				break;
			default:
				reject(new Error("invalidOption"));
				break;
		}
	});
};
