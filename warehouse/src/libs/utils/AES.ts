import crypto from "node:crypto"

const algorithm = "aes-256-ctr"
const secretKey = () => crypto.createHash("sha256")
	.update(process.env.ENCRYPTION_SECRET!)
	.digest()

export function encrypt(text: string) {
	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv(algorithm, secretKey(), iv)
	const encrypted = Buffer.concat([
		cipher.update(text),
		cipher.final(),
	])
	return `${iv.toString("hex")}:${encrypted.toString("hex")}`
}

export function decrypt(code: string) {
	const [iv, encrypted] = code.split(":")
	const decipher = crypto.createCipheriv(algorithm, secretKey(), Buffer.from(iv, "hex"))
	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(encrypted, "hex")),
		decipher.final()
	])
	return decrypted.toString()
}

export default {
	encrypt,
	decrypt,
}
