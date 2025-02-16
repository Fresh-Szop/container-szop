type ImageWrapperProps = {
  maxWidth: number | string;
  imgUrl: string;
  imgAlt: string;
}

export const ImageWrapper = ({ maxWidth, imgUrl, imgAlt }: ImageWrapperProps) => {
  return (
    <div className={` max-w-${maxWidth} w-full h-auto flex items-center justify-center`}>
      <img src={imgUrl} alt={imgAlt} className={"object-contain"}/>
    </div>
  )
}