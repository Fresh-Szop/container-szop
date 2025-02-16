import { ProductCard } from "@/components/ProductCard"
import { SortingBar } from "@/components/SortingBar"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAllProductsThunk, selectProducts, resetProducts } from "./ProductFilters/productFiltersSlice"
import { BasketItem } from "@/types/Basket"

const ProductList = () => {
  const data = useAppSelector(selectProducts)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(resetProducts())
    dispatch(fetchAllProductsThunk())
  }, [dispatch])

  return (
    <div className={"w-full h-full flex flex-col gap-4"}>
      {/* {isLoading && <span>Loading...</span>} */}
      {/* {isError && <span>Error...</span>} */}
      {data && <SortingBar />}
      {data && data.products.map((product: BasketItem) => {
        return <ProductCard key={product.productId} data={product} isBasket={false} />
      })}
      {data && <SortingBar topBar={false} />}
    </div>
  );
}

export default ProductList;