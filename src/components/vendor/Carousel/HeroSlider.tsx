import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useFetch from "../../../hooks/useFetch";
import { SliderItem } from "../../../types/ApiResponse/Slider/sliderItem.ts";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import Logger from "../../../log/logger.ts";

export const HeroSlider: React.FC = () => {
    const { data: sliders } = useFetch<SliderItem[]>(API_ENDPOINTS.SLIDER.GET_SLIDER.URL);
    Logger.log("API_ENDPOINTS.SLIDER.GET_SLIDER.URL", API_ENDPOINTS.SLIDER.GET_SLIDER.URL);
    Logger.log("sliders", sliders);
    if (!sliders || sliders.length === 0) return null;

    const settings = {
        dots: true,
        // infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <section className="w-full py-10 bg-gray-100">
            <div className="container mx-auto">
                <div className="flex justify-center">
                    <div className="w-full max-w-5xl">
                        <div className="relative">
                            <Slider {...settings} className="hero-slider">
                                {sliders.map((slider, index) => (
                                    <div
                                        key={index}
                                        className="bg-black relative h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center"
                                        style={{
                                            backgroundImage: slider.image ? `linear-gradient(to right, white, transparent), url("${slider.image}")` : "none",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}

                                    >
                                        <div className="bg-black/40 w-full h-full absolute top-0 left-0"></div>
                                        <div className="relative z-10 max-w-2xl mx-auto p-6 text-white">
                                            <h2 className="text-2xl md:text-4xl font-bold">{slider.title}</h2>
                                            <p className="mt-2 text-lg">{slider.description}</p>
                                            <div className="mt-4">
                                                <a href={slider.url} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition">
                                                    Xem ngay
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};
