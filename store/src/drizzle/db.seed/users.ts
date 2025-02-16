type entity = {
	userId: string,
	email: string,
	firstName: string,
	lastName: string,
	picture: string,
}

const names = [
	["Bob", "Johnson"],
	["Charlie", "Williams"],
	["Daisy", "Brown"],
	["Eve", "Jones"],
	["Frank", "Miller"],
	["Grace", "Davis"],
	["Henry", "Garcia"],
	["Ivy", "Rodriguez"],
	["Jack", "Martinez"],
] satisfies [string, string][]

const users: entity[] = names.map(([firstName, lastName], i) => ({
	userId: `$__${i + 1}`,
	email: `${firstName}.${lastName}@example.com`,
	firstName,
	lastName,
	picture: `https://i.pravatar.cc/250?u=${firstName}.${lastName}@example.com`
}))
export default users
