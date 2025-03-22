import React from "react";
import { HeroSlider } from "../../vendor/Carousel/HeroSlider";

export const Home: React.FC = () => {
    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center">
                <HeroSlider />
            </div>
        </div>
    );
};