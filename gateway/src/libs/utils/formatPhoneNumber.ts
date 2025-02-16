const nfe = new Error("Invalid phone number!")

const mobileNumbers = [
	"45",
	"50", "51", "53", "57",
	"60", "66", "69",
	"72", "73", "78", "79",
	"88"
]
const VoIPNumbers = ["39"]
const fixedLineNumbers = [
	"12", "13", "14", "15", "16", "17", "18",
	"22", "23", "24", "25", "29",
	"32", "33", "34",
	"41", "42", "43", "44", "46", "48",
	"52", "54", "55", "56", "58", "59",
	"61", "62", "63", "65", "67", "68",
	"71", "74", "75", "76", "77",
	"81", "82", "83", "84", "85", "86", "87", "89",
	"91", "94", "95"
]
const ministryNumbers = ["26", "47"]

export const allowedPhonePrefixes = [
	mobileNumbers,
	VoIPNumbers,
	fixedLineNumbers,
	ministryNumbers,
].flat()

function formatPhoneNumber(phoneNumber: string): string {
	if (!/^\d{9}$/.test(phoneNumber)) {
		throw nfe
	}

	const lol = fixedLineNumbers.includes(phoneNumber.substring(0, 2))

	switch (true) {
		case mobileNumbers.includes(phoneNumber.substring(0, 2)):
		case VoIPNumbers.includes(phoneNumber.substring(0, 2)):
			var parts = [
				phoneNumber.substring(0, 2),
				phoneNumber.substring(2, 5),
				phoneNumber.substring(5, 9)
			]
			break

		case fixedLineNumbers.includes(phoneNumber.substring(0, 2)):
		case ministryNumbers.includes(phoneNumber.substring(0, 2)):
			var parts = [
				phoneNumber.substring(0, 2),
				phoneNumber.substring(2, 5),
				phoneNumber.substring(5, 7),
				phoneNumber.substring(7, 9)
			]
			break

		default:
			throw nfe
	}

	return parts.join(' ')
}
export default formatPhoneNumber
