import { ProductCategory } from "@/types/Dictionaries"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { fetchAllProductsThunk } from "./productFiltersSlice"
import { AVAILABLE_FILTERS } from "@/constants"

const ProductFilters = () => {
  const dispatch = useAppDispatch()
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  useEffect(() => {
    // check if url contains parameter banner === true
    const urlParams = new URLSearchParams(window.location.search)
    const banner = urlParams.get("banner")
    if (!banner) {
      window.history.pushState({}, "", `${window.location.pathname}?`)
    }
  }, [])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const urlParams = new URLSearchParams(window.location.search)


    if (type === "checkbox") {
      if (checked) {
        urlParams.append(name, value)
      } else {
        urlParams.delete(name)
      }
    } else if (type === "radio") {
      urlParams.delete(name)
      if (checked) {
        urlParams.append(name, value)
      }
    }
    urlParams.forEach((value, key) => {
      if (!AVAILABLE_FILTERS.includes(key)) {
        urlParams.delete(key)
      }
    })
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`)
    dispatch(fetchAllProductsThunk());
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const urlParams = new URLSearchParams(window.location.search)

    setPriceRange(prevState => ({ ...prevState, [name]: value }))

    if (name === "min") {
      if (value) {
        urlParams.set("price-min", value)
      } else {
        urlParams.delete("price-min")
      }
    } else if (name === "max") {
      if (value) {

        urlParams.set("price-max", value)
      }
      else {
        urlParams.delete("price-max")
      }
    }
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`)
    dispatch(fetchAllProductsThunk());
  }

  const handleClearFilters = () => {
    setPriceRange({ min: "", max: "" })
    // clear all radio buttons
    const radioButtons = document.querySelectorAll("input[type=radio]")
    radioButtons.forEach(radioButton => {
      (radioButton as HTMLInputElement).checked = false
    });
    window.history.pushState({}, "", `${window.location.pathname}?`)
    dispatch(fetchAllProductsThunk());
  }

  return (
    <div className={"w-[320px] p-4 flex flex-col gap-8 border h-fit bg-malachite-0 rounded-2xl"}>
      {/*CATEGORY*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Kategoria</span>
        <div className={"flex flex-col gap-4"}>
          {Object.entries(ProductCategory).map(([key, value]) => (
            <div key={key} className={"flex space-x-4 items-center"}>
              <input type="radio" name={"category"} id={key} className={"h-5 w-5 rounded"} value={key} onChange={handleCheckboxChange} />
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
            <input type="radio" id={"isSeasonTrue"} name={"isSeason"} className={"h-5 w-5 rounded"} value={"true"} onChange={handleCheckboxChange} />
            <label htmlFor={"isSeasonTrue"} className={"text-2xl"}>Tak</label>
          </div>
          <div className={"flex space-x-4 items-center"}>
            <input type="radio" id={"isSeasonFalse"} name={"isSeason"} className={"h-5 w-5 rounded"} value={"false"} onChange={handleCheckboxChange} />
            <label htmlFor={"isSeasonFalse"} className={"text-2xl"}>Nie</label>
          </div>
        </div>
      </div>
      {/*PROMO*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Promocja</span>
        <div className={"flex flex-col gap-4"}>
          <div className={"flex space-x-4 items-center"}>
            <input type="radio" id={"isPromoTrue"} name={"discount"} className={"h-5 w-5 rounded"} value={"true"} onChange={handleCheckboxChange} />
            <label htmlFor={"isPromoTrue"} className={"text-2xl"}>Tak</label>
          </div>
          <div className={"flex space-x-4 items-center"}>
            <input type="radio" id={"isPromoFalse"} name={"discount"} className={"h-5 w-5 rounded"} value={"false"} onChange={handleCheckboxChange} />
            <label htmlFor={"isPromoFalse"} className={"text-2xl"}>Nie</label>
          </div>
        </div>
      </div>
      {/*PRICE RANGE*/}
      <div className={"flex flex-col gap-4"}>
        <span className={"text-3xl font-bold border-b-2 border-black"}>Zakres cen</span>
        <div className={"flex gap-8"}>
          <Input type="number" name="min" placeholder={"Od"} value={priceRange.min} onChange={handlePriceChange} />
          <span className={"font-bold text-3xl"}>-</span>
          <Input type="number" name="max" placeholder={"Do"} value={priceRange.max} onChange={handlePriceChange} />
        </div>
      </div>
      <button className={"text-2xl font-bold bg-blood-5 text-white py-4 rounded-2xl transition-all hover:bg-blood-7"} onClick={handleClearFilters}>Wyczyść filtry</button>
    </div>
  )
}

export default ProductFilters