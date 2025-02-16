type entity = {
	productId: number,
	name: string,
	producer: string,
	category: "vegetable" | "fruit" | "ingredients",
	unit: "kg",
	avgUnitWeightKg: 1,
	minQuantity: number,
	description: string,
} | {
	productId: number,
	name: string,
	producer: string,
	category: "vegetable" | "fruit" | "ingredients",
	unit: "g",
	avgUnitWeightKg: 0.001,
	minQuantity: number,
	description: string,
} | {
	productId: number,
	name: string,
	producer: string,
	category: "vegetable" | "fruit" | "ingredients",
	unit: "szt",
	avgUnitWeightKg: number,
	typicalUnitWeight?: `${number}-${number}${"kg" | "g"}`,
	description: string,
} | {
	productId: number,
	name: string,
	producer: string,
	category: "vegetable" | "fruit" | "ingredients",
	unit: "opak",
	avgUnitWeightKg: number,
	description: string,
}

const products: entity[] = [
	{
		productId: 1,
		name: "Marchew",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.065,
		typicalUnitWeight: "55-75g",
		description: "Marchew jest bogata w beta-karoten, który wspomaga zdrowie oczu. Jest również źródłem błonnika."
	},
	{
		productId: 2,
		name: "Jabłko",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.165,
		typicalUnitWeight: "150-180g",
		description: "Jabłka są bogate w witaminę C i błonnik. Pomagają w utrzymaniu zdrowia serca."
	},
	{
		productId: 3,
		name: "Morela",
		producer: "Agro skład",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.053,
		typicalUnitWeight: "45-60g",
		description: "Morele są źródłem witaminy A, która wspiera zdrowie skóry i oczu."
	},
	{
		productId: 4,
		name: "Awokado",
		producer: "Świeży Pan",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.180,
		typicalUnitWeight: "140-220g",
		description: "Awokado jest bogate w zdrowe tłuszcze i potas, co wspiera zdrowie serca."
	},
	{
		productId: 5,
		name: "Banan",
		producer: "AgroRolnik",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.135,
		typicalUnitWeight: "120-150g",
		description: "Banany są doskonałym źródłem potasu, który pomaga w regulacji ciśnienia krwi."
	},
	{
		productId: 6,
		name: "Burak",
		producer: "Polska Zieleń",
		unit: "kg",
		category: "vegetable",
		avgUnitWeightKg: 1,
		minQuantity: 1,
		description: "Buraki są bogate w żelazo i kwas foliowy, co wspiera zdrowie krwi."
	},
	{
		productId: 7,
		name: "Jeżyna",
		producer: "Agro skład",
		unit: "opak",
		category: "fruit",
		avgUnitWeightKg: 0.125,
		description: "Jeżyny są bogate w antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 8,
		name: "Brokuły",
		producer: "Świeży Pan",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.525,
		typicalUnitWeight: "500-550g",
		description: "Brokuły są bogate w witaminę C i błonnik, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 9,
		name: "Kapusta",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 4.000,
		typicalUnitWeight: "3.5-4.5kg",
		description: "Kapusta jest bogata w witaminę K, która wspiera zdrowie kości."
	},
	{
		productId: 10,
		name: "Kalafior",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 1.000,
		typicalUnitWeight: "0.9-1.1kg",
		description: "Kalafior jest bogaty w witaminę C i błonnik, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 11,
		name: "Wiśnie",
		producer: "Agro skład",
		unit: "g",
		category: "fruit",
		avgUnitWeightKg: 0.001,
		minQuantity: 50,
		description: "Wiśnie są bogate w antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 12,
		name: "Papryczka chili",
		producer: "Świeży Pan",
		unit: "opak",
		category: "vegetable",
		avgUnitWeightKg: 0.050,
		description: "Papryczki chili są bogate w kapsaicynę, która wspiera metabolizm."
	},
	{
		productId: 13,
		name: "Kukurydza",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.195,
		typicalUnitWeight: "180-210g",
		description: "Kukurydza jest bogata w błonnik i witaminy z grupy B, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 14,
		name: "Ogórek",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.225,
		typicalUnitWeight: "200-250g",
		description: "Ogórki są bogate w wodę i witaminę K, co wspiera zdrowie skóry."
	},
	{
		productId: 15,
		name: "Bakłażan",
		producer: "Agro skład",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.270,
		typicalUnitWeight: "240-300g",
		description: "Bakłażany są bogate w błonnik i antyoksydanty, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 16,
		name: "Czosnek",
		producer: "Świeży Pan",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.048,
		typicalUnitWeight: "45-50g",
		description: "Czosnek jest bogaty w związki siarki, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 17,
		name: "Imbir",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.048,
		typicalUnitWeight: "45-50g",
		description: "Imbir jest bogaty w związki przeciwzapalne, które wspierają zdrowie układu trawiennego."
	},
	{
		productId: 18,
		name: "Agrest",
		producer: "Polska Zieleń",
		unit: "g",
		category: "fruit",
		avgUnitWeightKg: 0.001,
		minQuantity: 100,
		description: "Agrest jest bogaty w witaminę C i błonnik, co wspiera zdrowie układu odpornościowego."
	},
	{
		productId: 19,
		name: "Grejpfrut",
		producer: "Agro skład",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.220,
		typicalUnitWeight: "200-240g",
		description: "Grejpfruty są bogate w witaminę C i błonnik, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 20,
		name: "Winogrono",
		producer: "Świeży Pan",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.500,
		typicalUnitWeight: "450-550g",
		description: "Winogrona są bogate w antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{

		productId: 21,
		name: "Fasolka szparagowa",
		producer: "AgroRolnik",
		unit: "g",
		category: "vegetable",
		minQuantity: 100,
		avgUnitWeightKg: 0.001,
		description: "Fasolka szparagowa jest bogata w błonnik i witaminy z grupy B, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 22,
		name: "Jalapeno",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.075,
		description: "Papryczki jalapeno są bogate w kapsaicynę, która wspiera metabolizm."
	},
	{
		productId: 23,
		name: "Kiwi",
		producer: "Agro skład",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.083,
		typicalUnitWeight: "75-90g",
		description: "Kiwi jest bogate w witaminę C i błonnik, co wspiera zdrowie układu odpornościowego."
	},
	{
		productId: 24,
		name: "Cytryna",
		producer: "Świeży Pan",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.120,
		typicalUnitWeight: "110-130g",
		description: "Cytryny są bogate w witaminę C, która wspiera zdrowie układu odpornościowego."
	},
	{
		productId: 25,
		name: "Sałata",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.350,
		typicalUnitWeight: "300-400g",
		description: "Sałata jest bogata w witaminę K, która wspiera zdrowie kości."
	},
	{
		productId: 26,
		name: "Cebula",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.135,
		typicalUnitWeight: "120-150g",
		description: "Cebula jest bogata w związki siarki, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 27,
		name: "Pomarańcza",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.300,
		typicalUnitWeight: "280-320g",
		description: "Pomarańcze są bogate w witaminę C, która wspiera zdrowie układu odpornościowego."
	},
	{
		productId: 28,
		name: "Papryka",
		producer: "Agro skład",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.165,
		typicalUnitWeight: "150-180g",
		description: "Papryka jest bogata w witaminę C i antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 29,
		name: "Pietruszka",
		producer: "Świeży Pan",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.075,
		typicalUnitWeight: "70-80g",
		description: "Pietruszka jest bogata w witaminę K, która wspiera zdrowie kości."
	},
	{
		productId: 30,
		name: "Groszek",
		producer: "AgroRolnik",
		unit: "g",
		category: "fruit",
		minQuantity: 100,
		avgUnitWeightKg: 0.001,
		description: "Groszek jest bogaty w białko i błonnik, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 31,
		name: "Ananas",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 1.350,
		typicalUnitWeight: "1.2-1.5kg",
		description: "Ananas jest bogaty w witaminę C i bromelainę, która wspiera zdrowie układu trawiennego."
	},
	{
		productId: 32,
		name: "Śliwka",
		producer: "Agro skład",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.050,
		typicalUnitWeight: "45-55g",
		description: "Śliwki są bogate w błonnik i witaminę C, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 33,
		name: "Ziemniak",
		producer: "Świeży Pan",
		unit: "kg",
		category: "vegetable",
		avgUnitWeightKg: 1,
		minQuantity: 2,
		description: "Ziemniaki są bogate w potas i witaminę C, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 34,
		name: "Rzodkiewka",
		producer: "AgroRolnik",
		unit: "g",
		category: "vegetable",
		minQuantity: 150,
		avgUnitWeightKg: 0.001,
		description: "Rzodkiewki są bogate w witaminę C i błonnik, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 35,
		name: "Malina",
		producer: "Polska Zieleń",
		unit: "opak",
		category: "fruit",
		avgUnitWeightKg: 0.125,
		description: "Maliny są bogate w antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 36,
		name: "Szpinak",
		producer: "Agro skład",
		unit: "g",
		category: "vegetable",
		avgUnitWeightKg: 0.001,
		minQuantity: 400,
		description: "Szpinak jest bogaty w żelazo i witaminę K, co wspiera zdrowie krwi."
	},
	{
		productId: 37,
		name: "Truskawka",
		producer: "Świeży Pan",
		unit: "g",
		category: "fruit",
		avgUnitWeightKg: 0.001,
		minQuantity: 250,
		description: "Truskawki są bogate w witaminę C i antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 38,
		name: "Pomidor",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.185,
		typicalUnitWeight: "170-200g",
		description: "Pomidory są bogate w likopen, który wspiera zdrowie serca."
	},
	{
		productId: 39,
		name: "Arbuz",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 2.250,
		typicalUnitWeight: "2-2.3kg",
		description: "Arbuzy są bogate w witaminę C i likopen, co wspiera zdrowie układu odpornościowego."
	},
	{
		productId: 40,
		name: "Żółta fasolka",
		producer: "Agro skład",
		unit: "g",
		category: "vegetable",
		avgUnitWeightKg: 0.001,
		minQuantity: 100,
		description: "Żółta fasolka jest bogata w białko i błonnik, co wspiera zdrowie układu trawiennego."
	},
	{
		productId: 41,
		name: "Bataty",
		producer: "Świeży Pan",
		unit: "kg",
		category: "vegetable",
		avgUnitWeightKg: 1,
		minQuantity: 1,
		description: "Bataty są bogate w błonnik i witaminę A, wspierają zdrowie skóry i oczu."
	},
	{
		productId: 42,
		name: "Cukinia",
		producer: "AgroRolnik",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.275,
		typicalUnitWeight: "250-300g",
		description: "Cukinia jest niskokaloryczna i bogata w witaminę C, wspiera zdrowie układu odpornościowego."
	},
	{
		productId: 43,
		name: "Borówka",
		producer: "Polska Zieleń",
		unit: "g",
		category: "fruit",
		avgUnitWeightKg: 0.001,
		minQuantity: 200,
		description: "Borówki są bogate w antyoksydanty, które wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 44,
		name: "Seler",
		producer: "Agro skład",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.350,
		typicalUnitWeight: "300-400g",
		description: "Seler jest niskokaloryczny i bogaty w błonnik, wspiera zdrowie układu trawiennego."
	},
	{
		productId: 45,
		name: "Mandarynki",
		producer: "Świeży Pan",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.073,
		typicalUnitWeight: "65-80g",
		description: "Mandarynki są bogate w witaminę C, wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 46,
		name: "Nektarynki",
		producer: "AgroRolnik",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.135,
		typicalUnitWeight: "120-150g",
		description: "Nektarynki są bogate w witaminę C i błonnik, wspierają zdrowie układu trawiennego."
	},
	{
		productId: 47,
		name: "Dynia piżmowa",
		producer: "Polska Zieleń",
		unit: "szt",
		category: "vegetable",
		avgUnitWeightKg: 0.520,
		typicalUnitWeight: "480-560g",
		description: "Dynia piżmowa jest bogata w witaminę A i błonnik, wspiera zdrowie oczu i układu trawiennego."
	},
	{
		productId: 48,
		name: "Brukselka",
		producer: "Agro skład",
		unit: "g",
		category: "vegetable",
		avgUnitWeightKg: 0.001,
		minQuantity: 100,
		description: "Brukselka jest bogata w witaminę K i błonnik, wspiera zdrowie kości i układu trawiennego."
	},
	{
		productId: 49,
		name: "Gruszka",
		producer: "Świeży Pan",
		unit: "szt",
		category: "fruit",
		avgUnitWeightKg: 0.188,
		typicalUnitWeight: "175-200g",
		description: "Gruszki są bogate w błonnik i witaminę C, wspierają zdrowie układu trawiennego."
	},
	{
		productId: 50,
		name: "Pieczarki",
		producer: "AgroRolnik",
		unit: "opak",
		category: "vegetable",
		avgUnitWeightKg: 0.500,
		description: "Pieczarki są bogate w witaminy z grupy B i antyoksydanty, wspierają zdrowie układu odpornościowego."
	},
	{
		productId: 51,
		name: "Mąka",
		producer: "EkoSposia",
		unit: "szt",
		category: "ingredients",
		avgUnitWeightKg: 0.500,
		description: "Ekologiczna mąka, idealna do wypieków, wspiera zrównoważone rolnictwo.",
	},
	{

		productId: 52,
		name: "Kakao",
		producer: "EkoSposia",
		unit: "szt",
		category: "ingredients",
		avgUnitWeightKg: 0.300,
		description: "Kakao z certyfikowanych plantacji, wspiera uczciwy handel i zrównoważony rozwój.",
	},
	{

		productId: 53,
		name: "Makaron",
		producer: "EkoSposia",
		unit: "szt",
		category: "ingredients",
		avgUnitWeightKg: 0.500,
		description: "Zdrowy makaron pełnoziarnisty, bogaty w błonnik, idealny do dań z warzywami.",
	},
	{

		productId: 54,
		name: "Bekon wegański",
		producer: "EkoSposia",
		unit: "opak",
		category: "ingredients",
		avgUnitWeightKg: 0.250,
		description: "Wegański bekon, pełen smaku, wytwarzany z fermentowanych ziaren soi - tempeh.",
	},
	{

		productId: 55,
		name: "Grzanki żytnie",
		producer: "EkoSposia",
		unit: "opak",
		category: "ingredients",
		avgUnitWeightKg: 0.120,
		description: "Grzanki żytnie, pieczone z ekologicznej mąki żytniej, idealne do zdrowych przekąsek.",
	},
	{

		productId: 56,
		name: "Chleb żytni",
		producer: "EkoSposia",
		unit: "szt",
		category: "ingredients",
		avgUnitWeightKg: 0.600,
		description: "Chleb żytni na zakwasie, pieczony z ekologicznej mąki, zawiera ziarna i otręby które sycą na dłużej.",
	},
	{
		productId: 57,
		name: "Bulion warzywny",
		producer: "EkoSposia",
		unit: "szt",
		category: "ingredients",
		avgUnitWeightKg: 1,
		description: "Naturalny bulion warzywny, bez sztucznych dodatków, idealny do zdrowych zup i potraw.",
	},
	// {

	// 	productId: 58,
	// 	name: "",
	// 	producer: "EkoSposia",
	// 	unit: "",
	// 	category: "ingredients",
	// 	avgUnitWeightKg: 0,
	// 	description: "",
	// },
	// {

	// 	productId: 59,
	// 	name: "",
	// 	producer: "EkoSposia",
	// 	unit: "",
	// 	category: "ingredients",
	// 	avgUnitWeightKg: 0,
	// 	description: "",
	// },
]

export default products
