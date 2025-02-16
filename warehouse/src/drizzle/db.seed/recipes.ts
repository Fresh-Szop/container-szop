import rt from "@/common/response-types.js"

const recipes: rt.Recipe[] = [
	{
		recipeId: 1,
		img: "image1.png",
		name: "Ciasto czekoladowe",
		category: "desserts",
		difficulty: 5,
		steps: [
			"Rozgrzej piekarnik do 175°C.",
			"Wymieszaj mąkę, cukier, kakao, proszek do pieczenia i sól.",
			"Dodaj jajka, mleko, olej i ekstrakt waniliowy. Ubijaj do uzyskania gładkiej masy.",
			"Wlej ciasto do natłuszczonej formy do pieczenia.",
			"Piec przez 30-35 minut.",
			"Ostudzone ciasto udekorować truskawkami.",
		],
		ingredients: [
			{
				name: "Mąka",
				productId: 51,
				quantity: "2 szklanki",
			},
			{
				name: "Cukier",
				productId: null,
				quantity: "1,5 szklanki",
			},
			{
				name: "Kakao",
				productId: 52,
				quantity: "0,75 szklanki",
			},
			{
				name: "Proszek do pieczenia",
				productId: null,
				quantity: "1 łyżeczka",
			},
			{
				name: "Sól",
				productId: null,
				quantity: "0.5 łyżeczki",
			},
			{
				name: "Jajka",
				productId: null,
				quantity: "2 sztuki",
			},
			{
				name: "Olej",
				productId: null,
				quantity: "1/3 szklanki",
			},
			{
				name: "Ekstrakt waniliowy",
				productId: null,
				quantity: "1 łyżeczka",
			},
			{
				name: "Truskawki",
				productId: 37,
				quantity: "400 g",
			},
		],
	},
	{
		recipeId: 2,
		img: "image2.png",
		name: "Makaron Carbonara",
		category: "meals",
		difficulty: 4,
		steps: [
			"Ugotuj makaron zgodnie z instrukcją na opakowaniu.",
			"Smaż bekon, aż będzie chrupiący.",
			"Wymieszaj jajka, ser i pieprz w misce.",
			"Połącz makaron, bekon i mieszankę jajeczną.",
			"Podawaj od razu.",
		],
		ingredients: [
			{
				name: "Makaron",
				productId: 53,
				quantity: "200g",
			},
			{
				name: "Bekon wegański",
				productId: 54,
				quantity: "100g",
			},
			{
				name: "Jajka",
				productId: null,
				quantity: "2",
			},
			{
				name: "Ser owczy",
				productId: null,
				quantity: "100 g",
			},
			{
				name: "Sól i pieprz",
				productId: null,
				quantity: "Do smaku",
			},
		],
	},
	{
		recipeId: 3,
		img: "image3.png",
		name: "Sałatka Cezar",
		category: "salads",
		difficulty: 2,
		steps: [
			"Posiekaj sałatę i umieść w misce.",
			"Dodaj grzanki i starty ser parmezan.",
			"Wymieszaj składniki sosu i polej sałatkę.",
			"Wymieszaj, aby połączyć.",
		],
		ingredients: [
			{
				name: "Sałata",
				productId: 25,
				quantity: "1 główka",
			},
			{
				name: "Grzanki",
				productId: 55,
				quantity: "1 szklanka",
			},
			{
				name: "Ser parmezan",
				productId: null,
				quantity: "50 g",
			},
			{
				name: "Oliwa z oliwek",
				productId: null,
				quantity: "50 ml",
			},
			{
				name: "Sok z cytryny",
				productId: 24,
				quantity: "2 łyżki",
			},
			{
				name: "Cukier",
				productId: null,
				quantity: "1 łyżka",
			},
			{
				name: "Sól",
				productId: null,
				quantity: "Szczypta",
			},
		],
	},
	{
		recipeId: 4,
		img: "image4.png",
		name: "Zupa pomidorowa",
		category: "soups",
		difficulty: 2,
		steps: [
			"Rozgrzej olej w garnku i podsmaż cebulę i czosnek.",
			"Dodaj pomidory i gotuj, aż będą miękkie.",
			"Zblenduj mieszankę na gładką masę.",
			"Dodaj bulion i gotuj na wolnym ogniu przez 20 minut.",
			"Dopraw solą i pieprzem.",
		],
		ingredients: [
			{
				name: "Olej rzepakowy",
				productId: null,
				quantity: "2 łyżki",
			},
			{
				name: "Cebula",
				productId: 26,
				quantity: "1 szklanka",
			},
			{
				name: "Czosnek",
				productId: 16,
				quantity: "2 ząbki",
			},
			{
				name: "Pomidory",
				productId: 38,
				quantity: "4 sztuki",
			},
			{
				name: "Bulion warzywny",
				productId: 57,
				quantity: "1 litr",
			},
			{
				name: "Sól i pieprz",
				productId: null,
				quantity: "Do smaku",
			},
		],
	},
	{
		recipeId: 5,
		img: "image5.png",
		name: "Grzanka z serem",
		category: "sides",
		difficulty: 2,
		steps: [
			"Posmaruj jedną stronę każdej kromki chleba masłem.",
			"Pomidora pokrój w cienkie plastry",
			"Umieść ser oraz pomidory między dwoma kromkami, stroną z masłem na zewnątrz.",
			"Grilluj na patelni, aż będą złociste.",
		],
		ingredients: [
			{
				name: "Chleb",
				productId: 56,
				quantity: "2 kromki",
			},
			{
				name: "Ser",
				productId: null,
				quantity: "2 plastry",
			},
			{
				name: "Masło",
				productId: null,
				quantity: "2 łyżki",
			},
			{
				name: "Pomidor",
				productId: 38,
				quantity: "Pół sztuki",
			},
		],
	},
	{
		recipeId: 6,
		img: "image6.png",
		name: "Kurczak curry",
		category: "meals",
		difficulty: 4,
		steps: [
			"Marynuj kurczaka w przyprawach.",
			"Gotuj cebulę, czosnek i imbir w garnku.",
			"Dodaj kurczaka i gotuj, aż się zarumieni.",
			"Dodaj pomidory i gotuj na wolnym ogniu, aż kurczak będzie gotowy.",
			"Podawaj z ryżem.",
		],
		ingredients: [
			{
				name: "Kurczak",
				productId: null,
				quantity: "500g",
			},
			{
				name: "Cebula",
				productId: 26,
				quantity: "1 szklanka",
			},
			{
				name: "Czosnek",
				productId: 16,
				quantity: "",
			},
			{
				name: "Imbir",
				productId: 17,
				quantity: "1/4 kłącza",
			},
			{
				name: "Pomidory",
				productId: 38,
				quantity: "2 szklanki",
			},
			{
				name: "Sól",
				productId: null,
				quantity: "Do smaku",
			},
		],
	},
	{
		recipeId: 7,
		img: "image7.png",
		name: "Naleśniki z owocami",
		category: "desserts",
		difficulty: 2,
		steps: [
			"Wymieszaj mąkę, cukier, proszek do pieczenia i sól.",
			"Dodaj mleko, jajka i roztopione masło. Mieszaj do uzyskania gładkiej masy.",
			"Wlej ciasto na gorącą patelnię.",
			"Gotuj, aż pojawią się bąbelki, następnie przewróć i gotuj, aż będą złociste.",
			"Podawaj z owocami oraz syropem klonowym",
		],
		ingredients: [
			{
				name: "Mąka",
				productId: 51,
				quantity: "1 szklanka",
			},
			{
				name: "Cukier",
				productId: null,
				quantity: "4 łyżki",
			},
			{
				name: "Jajka",
				productId: null,
				quantity: "2 sztuki",
			},
			{
				name: "Proszek do pieczenia",
				productId: null,
				quantity: "1 łyżeczka",
			},
			{
				name: "Sól",
				productId: null,
				quantity: "0.5 łyżeczki",
			},
			{
				name: "Mleko",
				productId: null,
				quantity: "1 szklanka",
			},
			{
				name: "Jajka",
				productId: null,
				quantity: "2 sztuki",
			},
			{
				name: "Masło",
				productId: null,
				quantity: "75 g",
			},
			{
				name: "Borówki",
				productId: 43,
				quantity: "200 g",
			},
			{
				name: "Truskawki",
				productId: 37,
				quantity: "300 g",
			},
		],
	},
	{
		recipeId: 8,
		img: "image8.png",
		name: "Gulasz wołowy",
		category: "meals",
		difficulty: 3,
		steps: [
			"Zrumień wołowinę w garnku.",
			"Dodaj cebulę, marchew i ziemniaki.",
			"Wlej bulion i gotuj na wolnym ogniu, aż wołowina będzie miękka.",
			"Dopraw solą i pieprzem.",
		],
		ingredients: [
			{
				name: "Wołowina",
				productId: null,
				quantity: "500g",
			},
			{
				name: "Cebula",
				productId: 26,
				quantity: "1 sztuka",
			},
			{
				name: "Marchew",
				productId: 1,
				quantity: "2 sztuki",
			},
			{
				name: "Ziemniaki",
				productId: 33,
				quantity: "400 g",
			},
			{
				name: "Bulion warzywny",
				productId: 57,
				quantity: "400 ml",
			},
			{
				name: "Sól i pieprz",
				productId: null,
				quantity: "Do smaku",
			},
		],
	},
	{
		recipeId: 9,
		img: "image9.png",
		name: "Sałatka owocowa",
		category: "salads",
		difficulty: 1,
		steps: [
			"Posiekaj różne owoce i umieść w misce.",
			"Dodaj sok z cytryny.",
			"Wymieszaj, aby połączyć.",
		],
		ingredients: [
			{
				name: "Kiwi",
				productId: 23,
				quantity: "1 sztuka",
			},
			{
				name: "Truskawki",
				productId: 37,
				quantity: "300 g",
			},
			{
				name: "Maliny",
				productId: 35,
				quantity: "200 g",
			},
			{
				name: "Borówki",
				productId: 43,
				quantity: "200 g",
			},
			{
				name: "Ananas",
				productId: 31,
				quantity: "Pół owocu",
			},
			{
				name: "Mango",
				productId: null,
				quantity: "1 sztuka",
			},
			{
				name: "Sok z cytryny",
				productId: 24,
				quantity: "2 łyżki",
			},
		],
	},
]

export default recipes
