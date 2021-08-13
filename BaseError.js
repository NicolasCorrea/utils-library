import moment from "moment";
import path from "path";
import { createStream } from "rotating-file-stream";

export class BaseError extends Error {
	constructor(codeError, details = { __dirname: "", descriptionMessage: "" }) {
		super(codeError);
		Object.setPrototypeOf(this, new.target.prototype);
		this.codeError = codeError;
		this.timestamp = moment().toISOString();
		this.descriptionMessage = details.descriptionMessage || "";
		this.filename = details.__dirname || "";
		Error.captureStackTrace(this);
		this.appendLog();
	}

	appendLog() {
		const directoryPath = path.join(__dirname, "../../logs");
		const codeErrorLogStream = createStream("code-errors.log", {
			size: "15K",
			interval: "1d",
			path: directoryPath,
			compress: "gzip",
		});
		const logToAppend = `${this.codeError} ${this.timestamp} "${
			this.descriptionMessage
		}" ${this.filename} trace: "${this.stack.replace(/(\n)( {4})+/g, " ")}"\n`;
		codeErrorLogStream.write(logToAppend);
		codeErrorLogStream.end();
	}
}
