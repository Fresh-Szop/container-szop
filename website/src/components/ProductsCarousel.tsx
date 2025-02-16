import * as React from "react"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"

export const ProductsCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000
        })
      ]}
      opts={{
        align: "start",
        loop: true,
        slidesToScroll: 3
      }}
      className="w-full max-w-[120rem] self-center"
    >
      <CarouselContent>
        {Array.from({ length: 9 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <a href={`/product/${index + 1}`}><span className="text-3xl font-semibold"><img
                    src={`/src/img/vegetables/${index + 1}.webp`}
                    alt="Vegetable photo" /></span></a>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
