import { DICTIONARY } from "@/constants"
import { BasketItem } from "@/types/Basket"
import { ProductCategory } from "@/types/Dictionaries"
import { Warehouse } from "lucide-react"


export const ProductData = ({ data }: { data: BasketItem }) => {

  return (
    <div className={"flex flex-col gap-4 justify-center border-r pr-12 max-w-[50rem] w-full text-4xl"}>
      <div className={"flex gap-4"}>{DICTIONARY.PRODUCT_NAME}: <span
        className={"text-flame-4 font-bold"}>{data.name}</span></div>
      <div className={"flex gap-4"}>{DICTIONARY.CATEGORY}: <span
        className={"text-flame-4 font-bold"}>{ProductCategory[data.category as keyof typeof ProductCategory]}</span></div>
      <div className={"flex gap-4"}>{DICTIONARY.UNIT_OF_MEASURE}: <span
        className={"text-flame-4 font-bold"}>{data.unit}.</span></div>
      <div className={"flex gap-4"}>{DICTIONARY.MIN_ORDER_QUANTITY}: <span
        className={"text-flame-4 font-bold"}>1 {data.unit}.</span></div>
      <div className={"flex gap-4"}>{DICTIONARY.FRESH_SHOP_ID}: <span
        className={"text-flame-4 font-bold"}>{String(data.productId).padStart(5, '0')}</span></div>
      <div className={"flex gap-4 items-center"}>
        <Warehouse />
        {DICTIONARY.AVAILABLE_QUANTITY}: <span
          className={"text-flame-4 font-bold"}>{data.availableUnits} {data.unit}.</span></div>
    </div>
  )
}