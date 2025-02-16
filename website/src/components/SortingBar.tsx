import { SelectBox } from "@/components/SelectBox"
import { productsPerPageOptions, sortingOptions } from "@/types/Dictionaries"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchAllProductsThunk, selectCurrPage, selectMaxPages } from "./ProductFilters/productFiltersSlice"

export const SortingBar = ({ topBar = true }) => {
  const maxPages = useAppSelector(selectMaxPages)
  const dispatch = useAppDispatch()
  const activePage = useAppSelector(selectCurrPage)

  const handlePageClick = (page: number) => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("page", page.toString())
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`)
    dispatch(fetchAllProductsThunk());
  }

  return (
    <div className={"w-full bg-verdigris-2 text-2xl rounded-2xl flex p-4 justify-end gap-8"}>
      <div className="flex gap-4">
        <Pagination className={"w-fit m-0"}>
          <PaginationContent>
            {maxPages && maxPages > 15 &&
              <PaginationItem>
                <PaginationPrevious href="" />
              </PaginationItem>
            }
            <PaginationItem>
              <PaginationLink href="" className={"text-2xl"} onClick={(e: any) => { e.preventDefault(); handlePageClick(1) }} isActive={activePage === 1}>1</PaginationLink>
            </PaginationItem>
            {maxPages && Array.from({ length: maxPages - 1 }, (_, i) => i + 2).map(page => (
              <PaginationItem key={page}>
                <PaginationLink href="" className={"text-2xl"} onClick={(e: any) => { e.preventDefault(); handlePageClick(page) }} isActive={activePage === page}>{page}</PaginationLink>
              </PaginationItem>
            ))}
            {maxPages && maxPages > 15 &&
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="" />
                </PaginationItem>
              </>}
          </PaginationContent>
        </Pagination>
        {topBar && <SelectBox data={{ options: productsPerPageOptions }} width="40" filterName="page-size" />}

      </div>
      {topBar && <SelectBox data={{ options: sortingOptions }} filterName="order" />}
    </div>
  )
}