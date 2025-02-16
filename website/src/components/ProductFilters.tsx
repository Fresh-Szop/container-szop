import { Checkbox } from "@/components/ui/checkbox"
import { ProductCategory } from "@/types/Dictionaries"
import { Input } from "@/components/ui/input"

const ProductFilters = () => {
  return (
    <div className={"w-[320px] p-4 flex flex-col gap-8 border h-fit bg-malachite-0 rounded-2xl"}>
      {/*CATEGORY*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Kategoria</span>
        <div className={"flex flex-col gap-4"}>
          {Object.entries(ProductCategory).map(([key, value]) => (
            <div key={key} className={"flex space-x-4 items-center"}>
              <Checkbox id={key} className={"h-5 w-5 rounded"} />
              <label htmlFor={key} className={"text-2xl"}>{value}</label>
            </div>
          ))}
        </div>
      </div>
      {/*IS SEASON*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Sezonowość</span>
        <div className={"flex flex-col gap-4"}>
          <div className={"flex space-x-4 items-center"}>
            <Checkbox id={"isSeason"} className={"h-5 w-5 rounded"} />
            <label htmlFor={"isSeason"} className={"text-2xl"}>Tak</label>
          </div>
          <div className={"flex space-x-4 items-center"}>
            <Checkbox id={"isNotSeason"} className={"h-5 w-5 rounded"} />
            <label htmlFor={"isNotSeason"} className={"text-2xl"}>Nie</label>
          </div>
        </div>
      </div>
      {/*PROMO*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Promocja</span>
        <div className={"flex flex-col gap-4"}>
          <div className={"flex space-x-4 items-center"}>
            <Checkbox id={"isPromo"} className={"h-5 w-5 rounded"} />
            <label htmlFor={"isPromo"} className={"text-2xl"}>Tak</label>
          </div>
          <div className={"flex space-x-4 items-center"}>
            <Checkbox id={"isNotPromo"} className={"h-5 w-5 rounded"} />
            <label htmlFor={"isNotPromo"} className={"text-2xl"}>Nie</label>
          </div>
        </div>
      </div>
      {/*PRICE RANGE*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Zakres cen</span>
        <div className={"flex gap-8"}>
          <Input type="number" placeholder={"Od"} />
          <span className={"font-bold text-3xl"}>-</span>
          <Input type="number" placeholder={"Do"} />
        </div>
      </div>
    </div>
  )
}

export default ProductFilters