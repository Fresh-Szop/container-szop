import { DICTIONARY } from "@/constants"
import fallback from "@/img/404fallback.png"

export const NotFound404 = () => {
  return (
    <div className={"h-full flex flex-col items-center bg-malachite-0 w-full justify-center grow"}>
      <span className={"text-8xl"}>{DICTIONARY.NOT_FOUND_FALLBACK}</span>
      <img width={600} src={fallback} alt={"fallback-404"} />
    </div>
  )
}
