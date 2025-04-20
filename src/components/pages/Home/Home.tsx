import React from "react";
import { HeroSlider } from "../../vendor/Carousel/HeroSlider";
import useFetch from "../../../hooks/useFetch.ts";
import { API_ENDPOINTS } from "../../../constants/apiInfo.ts";
import { RibbonsContainer } from "../../vendor/Ribbon/RibbonsContainer.tsx";
import { Ribbon } from "../../../types/ApiResponse/Ribbon/ribbon.ts";

export const Home: React.FC = () => {
    const { data: ribbons, loading } = useFetch<Ribbon[]>(API_ENDPOINTS.RIBBON.ALL.URL);

    return (
        <div className="w-full">
            <div className="w-full flex items-center justify-center">
                <HeroSlider />
            </div>
            {ribbons && ribbons.length > 0 && (
                <RibbonsContainer ribbons={ribbons} loading={loading} />
            )}
        </div>
    );
};