import { useAppDispatch } from "@/app/hooks";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchAllProductsThunk } from "./ProductFilters/productFiltersSlice";
import { useEffect, useState } from "react";

type SelectBoxProps = {
  data: {
    options: { value: string; name: string; }[];
  },
  width?: string;
  filterName: string;
}

export const SelectBox = ({ data, width, filterName }: SelectBoxProps) => {
  const dispatch = useAppDispatch()
  const [selectedValue, setSelectedValue] = useState<string>("default")

  useEffect(() => {
    //Initial option set based on url query
    const urlParams = new URLSearchParams(window.location.search)
    const filterValue = urlParams.get(filterName)
    // if filter value is null or undefined, set default value
    if (!filterValue){
      setSelectedValue("default")
    }
  }, [window.location.search])

  const handleSelectBoxChange = (value: string) => {
    setSelectedValue(value)
    const urlParams = new URLSearchParams(window.location.search)
    if (value === "default") {
      urlParams.delete(filterName)
    } else {
      urlParams.set(filterName, value)
    }

    if (filterName === "page-size") {
      urlParams.set("page", "1")
    }
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`)
    dispatch(fetchAllProductsThunk());
  }
  return (
    <Select onValueChange={handleSelectBoxChange} defaultValue="default" value={selectedValue}>
      <SelectTrigger className={width ? `w-[${width}px]` : "w-[180px]"}>
        <SelectValue className={"text-2xl"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem className={"text-2xl"} value="default">Domyślnie</SelectItem>
          {data && data.options.map(el => (
            <SelectItem className={"text-2xl"} key={el.value} value={el.value}>{el.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}