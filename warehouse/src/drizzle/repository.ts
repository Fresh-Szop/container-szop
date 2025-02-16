import bt from "@/common/base-types.js"
import rt from "@/common/response-types.js"
import db, { recipes } from "@/drizzle/db.js"
import t from "@/drizzle/schema-helper.js"
import O from "@/libs/utils/Objects.js"
import { and, asc, count, countDistinct, desc, eq, gte, inArray, isNotNull, isNull, lte, not, sql } from "drizzle-orm"

type PageRequest = {
	pageRequest: {
		page: number,
		pageSize: number,
	}
}


type Order = "asc" | "desc"

const orderBy = <
	T extends { [key: string]: any },
	F extends keyof T
>(
	iter: T[],
	field: F,
	order: Order,
) => iter.toSorted((a, b) => {
	const fa = a[field]
	const fb = b[field]

	if (fa === null && fb === null) return 0
	if (fa === null) return order === "asc" ? 1 : -1
	if (fb === null) return order === "asc" ? -1 : 1
	if (typeof fa !== typeof fb) throw TypeError(
		`Type mismatch: ${typeof fa} and ${typeof fb} of property ${String(field)}`
	)
	if (typeof fa === "number" && typeof fb === "number")
		return order === "asc" ? fa - fb : fb - fa
	else if (typeof fa === "string" && typeof fb === "string")
		return order === "asc" ? fa.localeCompare(fb) : fb.localeCompare(fa)
	else throw TypeError(
		`Cannot sort on type: ${typeof fa} and ${typeof fb} of property ${String(field)}`
	)
})

type ProductsOrdering = `${"availability" | "name" | "price"}-${"asc" | "desc"}`

function productsOrder(order: ProductsOrdering) {
	switch (order) {
		case "availability-asc":
			return asc(t.ProductAvailability.availableUnits)
		case "availability-desc":
			return desc(t.ProductAvailability.availableUnits)
		case "name-asc":
			return asc(t.Products.name)
		case "name-desc":
			return desc(t.Products.name)
		case "price-asc":
			return asc(sql`coalesce(${t.ProductPrices.discountedPrice}, ${t.ProductPrices.basePrice})`)
		case "price-desc":
			return desc(sql`coalesce(${t.ProductPrices.discountedPrice}, ${t.ProductPrices.basePrice})`)
	}
}

type ProductsRequest = {
	filters: {
		isSeason?: boolean,
		category?: "vegetable" | "fruit" | "ingredients",
		discount?: boolean,
		minPrice?: number,
		maxPrice?: number,
	},
	order: ProductsOrdering,
	month: bt.months,
}

const Products = {
	count: (
		{
			filters,
			month,
		}: Omit<ProductsRequest, "order">
	) => db.select({ count: count() })
		.from(t.Products)
		.innerJoin(
			t.ProductAvailability,
			eq(t.Products.productId, t.ProductAvailability.productId),
		)
		.innerJoin(
			t.ProductPrices,
			and(
				eq(t.Products.productId, t.ProductPrices.productId),
				eq(t.ProductPrices.month, month),
			),
		)
		.where(and(
			filters.category ? eq(t.Products.category, filters.category) : undefined,
			filters.discount !== undefined
				? filters.discount === false
					? isNull(t.ProductPrices.discount)
					: not(isNull(t.ProductPrices.discount))
				: undefined,
			filters.minPrice ? gte(
				sql`coalesce(${t.ProductPrices.discountedPrice}, ${t.ProductPrices.basePrice})`,
				filters.minPrice
			) : undefined,
			filters.maxPrice ? lte(
				sql`coalesce(${t.ProductPrices.discountedPrice}, ${t.ProductPrices.basePrice})`,
				filters.maxPrice
			) : undefined,
			filters.isSeason !== undefined
				? eq(t.ProductPrices.isSeason, filters.isSeason)
				: undefined,
		))
		.then(t.$requireCount),

	select: (
		productId: bt.Product["productId"],
		month: bt.months,
	) => db.select({
		productId: t.Products.productId,
		name: t.Products.name,
		producer: t.Products.producer,
		category: t.Products.category,
		unit: t.Products.unit,
		avgUnitWeightKg: t.Products.avgUnitWeightKg,
		typicalUnitWeight: t.Products.typicalUnitWeight,
		availableUnits: t.ProductAvailability.availableUnits,
		basePrice: t.ProductPrices.basePrice,
		discountedPrice: t.ProductPrices.discountedPrice,
		discount: t.ProductPrices.discount,
		isSeason: t.ProductPrices.isSeason,
		description: t.Products.description,
	})
		.from(t.Products)
		.innerJoin(
			t.ProductAvailability,
			eq(t.Products.productId, t.ProductAvailability.productId),
		)
		.innerJoin(
			t.ProductPrices,
			and(
				eq(t.Products.productId, t.ProductPrices.productId),
				eq(t.ProductPrices.month, month),
			),
		)
		.where(eq(t.Products.productId, productId))
		.then(t.$first),

	selectAll: (
		productIds: bt.Product["productId"][],
		month: bt.months,
	) => db.select({
		productId: t.Products.productId,
		name: t.Products.name,
		producer: t.Products.producer,
		category: t.Products.category,
		unit: t.Products.unit,
		avgUnitWeightKg: t.Products.avgUnitWeightKg,
		typicalUnitWeight: t.Products.typicalUnitWeight,
		availableUnits: t.ProductAvailability.availableUnits,
		basePrice: t.ProductPrices.basePrice,
		discountedPrice: t.ProductPrices.discountedPrice,
		discount: t.ProductPrices.discount,
		isSeason: t.ProductPrices.isSeason,
		description: t.Products.description,
	})
		.from(t.Products)
		.innerJoin(
			t.ProductAvailability,
			eq(t.Products.productId, t.ProductAvailability.productId),
		)
		.innerJoin(
			t.ProductPrices,
			and(
				eq(t.Products.productId, t.ProductPrices.productId),
				eq(t.ProductPrices.month, month),
			),
		)
		.where(inArray(t.Products.productId, productIds)),

	exists: (
		productId: bt.Product["productId"],
	) => db.select({
		productId: t.Products.productId,
	})
		.from(t.Products)
		.where(eq(t.Products.productId, productId))
		.then(t.$first)
		.then(p => p !== undefined),

	selectPageWhen: (
		{
			filters,
			order,
			month,
			pageRequest,
		}: ProductsRequest & PageRequest
	) => db.transaction(tx => {
		const identifiers = tx.select({ productId: t.Products.productId })
			.from(t.Products)
			.innerJoin(
				t.ProductAvailability,
				eq(t.Products.productId, t.ProductAvailability.productId),
			)
			.innerJoin(
				t.ProductPrices,
				and(
					eq(t.Products.productId, t.ProductPrices.productId),
					eq(t.ProductPrices.month, month as bt.months),
				),
			)
			.where(and(
				filters.category ? eq(t.Products.category, filters.category) : undefined,
				filters.discount !== undefined
					? filters.discount === false
						? isNull(t.ProductPrices.discount)
						: not(isNull(t.ProductPrices.discount))
					: undefined,
				filters.minPrice ? gte(
					sql`coalesce(${t.ProductPrices.discountedPrice}, ${t.ProductPrices.basePrice})`,
					filters.minPrice
				) : undefined,
				filters.maxPrice ? lte(
					sql`coalesce(${t.ProductPrices.discountedPrice}, ${t.ProductPrices.basePrice})`,
					filters.maxPrice
				) : undefined,
				filters.isSeason !== undefined
					? eq(t.ProductPrices.isSeason, filters.isSeason)
					: undefined,
			))
			.orderBy(productsOrder(order))
			.limit(pageRequest.pageSize)
			.offset((pageRequest.page - 1) * pageRequest.pageSize)
			.as("identifiers")

		return tx.select({
			productId: t.Products.productId,
			name: t.Products.name,
			producer: t.Products.producer,
			category: t.Products.category,
			unit: t.Products.unit,
			avgUnitWeightKg: t.Products.avgUnitWeightKg,
			typicalUnitWeight: t.Products.typicalUnitWeight,
			availableUnits: t.ProductAvailability.availableUnits,
			basePrice: t.ProductPrices.basePrice,
			discountedPrice: t.ProductPrices.discountedPrice,
			discount: t.ProductPrices.discount,
			isSeason: t.ProductPrices.isSeason,
			description: t.Products.description,
		})
			.from(t.Products)
			.innerJoin(
				identifiers,
				eq(t.Products.productId, identifiers.productId),
			)
			.innerJoin(
				t.ProductAvailability,
				eq(t.Products.productId, t.ProductAvailability.productId),
			)
			.innerJoin(
				t.ProductPrices,
				and(
					eq(t.Products.productId, t.ProductPrices.productId),
					eq(t.ProductPrices.month, month as bt.months),
				),
			)
			.orderBy(productsOrder(order))
	}),

	updateAvailability: (
		productId: bt.Product["productId"],
		delta: {
			addedUnits: number,
			removedUnits?: undefined,
		} | {
			addedUnits?: undefined,
			removedUnits: number,
		},
	) => db.transaction(async tx => {
		await tx.update(t.ProductAvailability)
			.set({
				availableUnits:
					delta.addedUnits
						? sql`${t.ProductAvailability.availableUnits} + ${delta.addedUnits}`
						: sql`greatest(${t.ProductAvailability.availableUnits} - ${delta.removedUnits}, 0)`

			})
			.where(eq(t.ProductAvailability.productId, productId))

		return await db.select()
			.from(t.ProductAvailability)
			.where(eq(t.ProductAvailability.productId, productId))
	}),
}

type RecipesOrdering = `${"difficulty" | "name"}-${"asc" | "desc"}`

type RecipesRequest = {
	filters: {
		category: ("desserts" | "sides" | "soups" | "meals" | "salads")[],
		minDifficulty?: number,
		maxDifficulty?: number,
	},
	order: RecipesOrdering,
}

function recipeFilter(recipe: rt.Recipe, filters: RecipesRequest["filters"]) {
	let shouldReturn = true
	if (filters.category.length) shouldReturn &&= filters.category.includes(recipe.category)
	if (filters.minDifficulty) shouldReturn &&= filters.minDifficulty <= recipe.difficulty
	if (filters.maxDifficulty) shouldReturn &&= filters.maxDifficulty >= recipe.difficulty

	return shouldReturn
}

const Recipes = {
	count: (
		{ filters }: Omit<RecipesRequest, "order">
	) =>
		Promise.resolve(recipes.filter(r => recipeFilter(r, filters)).length),

	select: (
		recipeId: rt.Recipe["recipeId"],
	) => Promise.resolve(recipes.find(r => r.recipeId === recipeId)),

	selectPageWhen: (
		{
			filters,
			order,
			pageRequest,
		}: RecipesRequest & PageRequest
	) => Promise.resolve(
		orderBy(
			recipes
				.filter(r => recipeFilter(r, filters)),
			...(order.split("-") as [keyof rt.Recipe, Order]),
		)
			.values()
			.drop((pageRequest.page - 1) * pageRequest.pageSize)
			.take(pageRequest.pageSize)
			.map(r => ({
				recipeId: r.recipeId,
				img: r.img,
				name: r.name,
				category: r.category,
				difficulty: r.difficulty,
			}))
			.toArray()
	),
}

type OrderStatus = "rejected" | "delivered" | "sent" | "preparing" | "placed"

type OrdersRequest = {
	filters: {
		status?: OrderStatus,
		userId: bt.Order["userId"],
	}
}

function ordersStatusPredicate(filters: OrdersRequest["filters"]) {
	switch (filters.status) {
		case "rejected":
			return and(
				isNotNull(t.OrderRejections.productId),
				eq(t.Orders.userId, filters.userId),
			)
		case "delivered":
			return and(
				isNotNull(t.Orders.deliveryDate),
				eq(t.Orders.userId, filters.userId),
			)
		case "sent":
			return and(
				isNull(t.Orders.deliveryDate),
				isNotNull(t.Orders.sentDate),
				eq(t.Orders.userId, filters.userId),
			)
		case "preparing":
			return and(
				isNull(t.Orders.deliveryDate),
				isNull(t.Orders.sentDate),
				isNotNull(t.Orders.preparationDate),
				eq(t.Orders.userId, filters.userId),
			)
		case "placed":
			return and(
				isNull(t.Orders.deliveryDate),
				isNull(t.Orders.sentDate),
				isNull(t.Orders.preparationDate),
				eq(t.Orders.userId, filters.userId),
			)
		case undefined:
			return eq(t.Orders.userId, filters.userId)
		default: throw TypeError(`Unknown status filter: [${filters.status}]`)
	}
}

const updateDateSQL = sql`coalesce(${t.Orders.deliveryDate}, \
${t.Orders.sentDate}, \
${t.Orders.preparationDate}, \
${t.Orders.orderDate})`

const statusSQL = sql<OrderStatus>`case \
when ${isNotNull(t.OrderRejections.productId)} then 'rejected' \
when ${isNotNull(t.Orders.deliveryDate)} then 'delivered' \
when ${isNotNull(t.Orders.sentDate)} then 'sent' \
when ${isNotNull(t.Orders.preparationDate)} then 'preparing' \
else 'placed' end`

const Orders = {
	create: (
		address: bt.Address,
		products: Omit<bt.OrderProduct, "orderId">[],
		conflicts?: Omit<bt.OrderRejection, "orderId">[]
	) => db.transaction(async tx => {

		const [finalBasePrice, finalDiscountedPrice] = products.reduce(
			([fbp, fdp], p) => [fbp + p.finalBasePrice, fdp + p.finalDiscountedPrice],
			[0, 0] as [number, number],
		)

		const order = await tx.insert(t.Orders)
			.values({
				...address,
				finalBasePrice: finalBasePrice,
				finalDiscountedPrice: finalDiscountedPrice,
			})
			.$returningId()
			.then(t.$requireOne)

		await tx.insert(t.OrderProducts)
			.values(products.map(p => ({ ...p, orderId: order.orderId })))

		conflicts && await tx.insert(t.OrderRejections)
			.values(conflicts.map(c => ({ ...c, orderId: order.orderId })))

		return order.orderId
	}),

	count: (
		{ filters }: OrdersRequest
	) => db.select({
		count: countDistinct(t.Orders.orderId)
	})
		.from(t.Orders)
		.leftJoin(
			t.OrderRejections,
			eq(t.Orders.orderId, t.OrderRejections.orderId)
		)
		.where(ordersStatusPredicate(filters))
		.then(t.$requireCount),

	selectPageWhen: (
		{
			filters,
			pageRequest,
		}: OrdersRequest & PageRequest
	) => db.transaction(tx => {
		const baseIdentifiers = tx.select({ orderId: t.Orders.orderId })
			.from(t.Orders)
			.leftJoin(
				t.OrderRejections,
				eq(t.Orders.orderId, t.OrderRejections.orderId),
			)
			.where(ordersStatusPredicate(filters))
			.orderBy(desc(updateDateSQL))
			.limit(pageRequest.pageSize)
			.offset((pageRequest.page - 1) * pageRequest.pageSize)
			.as("identifiers")

		return tx.select({
			orderId: t.Orders.orderId,
			updateDate: updateDateSQL.mapWith(v => new Date(v)),
			finalDiscountedPrice: t.Orders.finalDiscountedPrice,
			status: statusSQL,
		})
			.from(t.Orders)
			.leftJoin(
				t.OrderRejections,
				eq(t.Orders.orderId, t.OrderRejections.orderId),
			)
			.innerJoin(
				baseIdentifiers,
				eq(t.Orders.orderId, baseIdentifiers.orderId),
			)
			.orderBy(desc(updateDateSQL))
	}),

	select: (
		orderId: bt.Order["orderId"],
	) => db.transaction(async tx => {
		const retrievedOrder = await tx.select({
			orderId: t.Orders.orderId,
			userId: t.Orders.userId,
			orderDate: t.Orders.orderDate,
			preparationDate: t.Orders.preparationDate,
			sentDate: t.Orders.sentDate,
			deliveryDate: t.Orders.deliveryDate,
			finalBasePrice: t.Orders.finalBasePrice,
			finalDiscountedPrice: t.Orders.finalDiscountedPrice,
			firstName: t.Orders.firstName,
			lastName: t.Orders.lastName,
			firstAddressLine: t.Orders.firstAddressLine,
			secondAddressLine: t.Orders.secondAddressLine,
			postalCode: t.Orders.postalCode,
			postalCity: t.Orders.postalCity,
			phoneNumber: t.Orders.phoneNumber,
			updateDate: updateDateSQL.mapWith(v => new Date(v)),
		})
			.from(t.Orders)
			.where(eq(t.Orders.orderId, orderId))
			.then(t.$requireOne)

		const products = await tx.select({
			productId: t.OrderProducts.productId,
			name: t.Products.name,
			producer: t.Products.producer,
			category: t.Products.category,
			unit: t.Products.unit,
			basketQuantity: t.OrderProducts.quantity,
			basePrice: t.OrderProducts.basePrice,
			discountedPrice: t.OrderProducts.discountedPrice,
			finalBasePrice: t.OrderProducts.finalBasePrice,
			finalDiscountedPrice: t.OrderProducts.finalDiscountedPrice,
		})
			.from(t.OrderProducts)
			.innerJoin(
				t.Products,
				eq(t.OrderProducts.productId, t.Products.productId)
			)
			.where(eq(t.OrderProducts.orderId, orderId))

		const conflicts = await tx.select({
			orderId: t.OrderRejections.orderId,
			productId: t.OrderRejections.productId,
			expectedQuantity: t.OrderRejections.expectedQuantity,
			actualQuantity: t.OrderRejections.actualQuantity,
		})
			.from(t.OrderRejections)
			.where(eq(t.OrderRejections.orderId, orderId))

		const status: OrderStatus = conflicts.length ? "rejected"
			: retrievedOrder.deliveryDate ? "delivered"
				: retrievedOrder.sentDate ? "sent"
					: retrievedOrder.preparationDate ? "preparing"
						: "placed"

		const order = O.without(
			retrievedOrder,
			["orderDate", "preparationDate", "sentDate", "deliveryDate"]
		)

		return {
			...order,
			status,
			rejectionReason: conflicts.length ? conflicts : undefined,
			products,
		}
	}),

	exists: (
		orderId: bt.Order["orderId"],
	) => db.select({
		orderId: t.Orders.orderId,
	})
		.from(t.Orders)
		.where(eq(t.Orders.orderId, orderId))
		.then(t.$first)
		.then(p => p !== undefined),

	$: {
		selectAll: () => db.select({
			orderId: t.Orders.orderId,
			updateDate: updateDateSQL.mapWith(v => new Date(v)),
			finalDiscountedPrice: t.Orders.finalDiscountedPrice,
			status: statusSQL,
		})
			.from(t.Orders)
			.leftJoin(
				t.OrderRejections,
				eq(t.Orders.orderId, t.OrderRejections.orderId),
			)
			.orderBy(desc(updateDateSQL)),

		updateStatus: (
			orderId: bt.Order["orderId"],
			status: Exclude<OrderStatus, "rejected" | "placed">
		) => {
			switch (status) {
				case "delivered":
					return db.update(t.Orders)
						.set({
							deliveryDate: sql`coalesce(${t.Orders.deliveryDate}, ${t.$now})`,
							sentDate: sql`coalesce(${t.Orders.sentDate}, ${t.$now})`,
							preparationDate: sql`coalesce(${t.Orders.preparationDate}, ${t.$now})`,
						})
						.where(eq(t.Orders.orderId, orderId))
				case "sent":
					return db.update(t.Orders)
						.set({
							sentDate: sql`coalesce(${t.Orders.sentDate}, ${t.$now})`,
							preparationDate: sql`coalesce(${t.Orders.preparationDate}, ${t.$now})`,
						})
						.where(eq(t.Orders.orderId, orderId))
				case "preparing":
					return db.update(t.Orders)
						.set({
							preparationDate: sql`coalesce(${t.Orders.preparationDate}, ${t.$now})`,
						})
						.where(eq(t.Orders.orderId, orderId))
				default: return Promise.reject(Error(`Wrong lifetime chronology or invalid status [${status}]`))
			}
		},
	}
}

const repo = {
	Products,
	Recipes,
	Orders,
}

export default repo
