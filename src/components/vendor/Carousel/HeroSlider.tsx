import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useFetch from "../../../hooks/useFetch";
import { SliderItem } from "../../../types/ApiResponse/sliderItem";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../../shadcn-components/ui/carousel"

export const HeroSlider: React.FC = () => {
    const { data: sliders } = useFetch<SliderItem[]>(API_ENDPOINTS.SLIDER.GET_SLIDER.URL);

    if (!sliders || sliders.length === 0) return null;

    return (
        <div className="relative">
            <Carousel className="mx-auto w-full max-w-6xl">
                <CarouselContent>
                    {sliders.map((slider) => (
                        <CarouselItem key={slider.id}>
                            <div className="block w-full h-80 md:h-[500px] relative overflow-hidden rounded-lg shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={slider.image}
                                    alt={slider.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                    {slider.title && (
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                                            {slider.title}
                                        </h2>
                                    )}
                                    {slider.description && (
                                        <p className="text-white/90 max-w-xl text-sm md:text-base mb-4">
                                            {slider.description}
                                        </p>
                                    )}
                                    {slider.url && (
                                        <a
                                            href={slider.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md backdrop-blur-sm transition-colors"
                                        >
                                            Xem thêm
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-black" />
                <CarouselNext className="right-2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-black" />
            </Carousel>
        </div>
    )
};
