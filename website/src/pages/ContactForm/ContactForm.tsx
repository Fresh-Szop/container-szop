import szop from "@/img/fresh-shop-contact-form.png"
export const ContactForm = () => {
  return(
    <div className={"h-full w-full py-12 text-3xl flex flex-col"}>
      <div className={"w-full flex justify-center"}><img src={szop} alt="Logo Icon" className={"max-w-72"}/></div>
      <span className={"font-bold text-6xl text-center"}>Napisz do nas</span>
      <form className={"w-full bg-desertsand-3 h-full mt-8 p-8"}>
        <div className={"flex w-full justify-between flex-col"}>
          <div className={"flex flex-col gap-2 max-w-4xl"}>
            <label className={"text-3xl"}>Imię:</label>
            <input type="text" className={"rounded-xl h-12 p-4 focus-visible:border-verdigris-1"}/>
          </div>
          <div className={"flex flex-col gap-2 max-w-4xl"}>
            <label className={"text-3xl"}>Nazwisko:</label>
            <input type="text" className={"rounded-xl h-12 p-4 focus-visible:border-verdigris-1"}/>
          </div>
        </div>
      </form>
    </div>
  )
}