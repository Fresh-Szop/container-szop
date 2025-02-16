import ProductFilters from "@/components/ProductFilters/ProductFilters"
import ProductList from "@/components/ProductList"

const ProductListing = () => {
  return (
    <div className={"h-full w-full flex gap-8 my-4"}>
      <ProductFilters />
      <ProductList />
    </div>
  );
}

export default ProductListing;