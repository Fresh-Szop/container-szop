import { useParams } from "react-router-dom"
import { ImageWrapper } from "@/components/ImageWrapper"
import { ProductsCarousel } from "@/components/ProductsCarousel"
import { DICTIONARY } from "@/constants"
import { useFetchSpecificProduct } from "@/api/hooks/useFetchSpecificProduct"
import { PurchaseBox } from "@/components/PurchaseBox"
import { ProductData } from "@/components/ProductData"
import { DNA } from "react-loader-spinner"

export const Product = () => {
  const { productID: id } = useParams<{ productID: string }>()
  const productID = parseInt(id || "", 10)

  const { data, isLoading } = useFetchSpecificProduct(productID)

  return (
    <>
      {isLoading && <div className="flex justify-center w-full">
        <DNA height="200" width="200" />
      </div>}
      {data &&
        <>
          <div className={"w-full bg-desertsand-0 my-4 flex flex-col"}>
            <div className={"w-full flex gap-12 p-4"}>
              <ImageWrapper maxWidth={"image"} imgUrl={`src/img/vegetables/${data.productId}.webp`}
                imgAlt={data.name} />
              <ProductData data={data} />
              <PurchaseBox data={data} />
            </div>

          </div>
          <div className={"flex flex-col g-4 mt-auto w-full"}>
            <span className={"text-4xl pl-4"}>{DICTIONARY.PRODUCTS_PURCHASED_TOGETHER}</span>
            <ProductsCarousel />
          </div>
        </>
      }
    </>
  )
}
