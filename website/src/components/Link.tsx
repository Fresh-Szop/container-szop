type LinkProps = {
  address: string;
  name: string;
}

export const Link = ({address, name}: LinkProps) => {
  return(
    <a href={address} className={"general-link"}>{name}</a>
  )
}