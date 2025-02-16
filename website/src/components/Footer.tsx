import logo from "@/img/fresh-shop-logo.png"
import { DICTIONARY } from "@/constants"
import { Link } from "@/components/Link"

export const Footer = () => {
  return (
    <footer
      className="w-full max-w-[128rem] h-80 bg-verdigris-2 flex align-center justify-center rounded-tl-2xl rounded-tr-2xl p-4 mt-auto">
      <div className={"w-full flex gap-4"}>
        <div className={"max-w-72 w-full flex items-center"}><a href="/"><img alt="Company logo" src={logo} /></a></div>
        <div className={"flex w-full"}>
          <div className={"footer-col w-full"}>
            <span className={"font-bold"}>Dane firmy</span>
            <div className={"text-2xl flex flex-col gap-2"}>
              <span>Fresh Szop sp. z o.o. </span>
              <span>al.Pietruszki 25 </span>
              <span>92-428 Łódź </span>
              <span> NIP: {DICTIONARY.NIP_NUM}</span>
              <span>KRS: {DICTIONARY.KRS_NUM}</span>
            </div>
          </div>
          <div className={"footer-col w-full"}>
            <span className={"font-bold"}>Kontakt</span>
            <div className={"text-2xl flex flex-col gap-2"}>
              <span className={"font-bold"}>Biuro obsługi klienta </span>
              <span>Napisz do nas: fresh@szop.pl</span>
              <span>+48 42 123 22 00</span>
              <span>(Czynne pn-pt od 8:00 do 16:00) </span>
              <a href="/#" className={"font-bold hover:cursor-pointer mt-4"}>Formularz kontaktowy</a>
            </div>
          </div>
          <div className={"footer-col w-full"}>
            <span className={"font-bold"}>Informacje</span>
            <div className={"text-2xl flex flex-col gap-2"}>
              <a href="/src/docs/Regulamin sklepu Fresh Szop.pdf" target="_blank" rel="noreferrer" className={"hover:cursor-pointer hover:underline"}>Regulamin sklepu</a>
              <a href="/src/docs/Polityka prywatności Fresh Szop.pdf" target="_blank" rel="noreferrer" className={"hover:cursor-pointer hover:underline"}>Polityka prywatności</a>
              <a href="/src/docs/Cookies Fresh Szop.pdf" target="_blank" rel="noreferrer" className={"hover:cursor-pointer hover:underline"}>Polityka cookies</a>
              <a href="/src/docs/Ows Fresh Szop.pdf" target="_blank" rel="noreferrer" className={"hover:cursor-pointer hover:underline"}>Ogólne warunki sprzedaży</a>
            </div>
          </div>
          <div className={"footer-col w-full border-0"}>
            <span className={"font-bold"}>O firmie</span>
            <div className={"text-2xl flex flex-col gap-2"}>
              <Link name={"O nas"} address={"o-firmie"} />
              <Link name={"Kariera"} address={"kariera"} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}