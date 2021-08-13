import crypto from "crypto";

const algorithm = process.env.CRYPTO_ALGORITHM || "aes-256-cbc";
const key = process.env.CRYPTO_KEY || "crypto.randomBytes(32)sdfsdfsdfs";
const iv = crypto.randomBytes(16);

export const encrypt = text => {
	let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export const decrypt = text => {
	let iv = Buffer.from(text.iv, "hex");
	let encryptedText = Buffer.from(text.encryptedData, "hex");
	let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};
