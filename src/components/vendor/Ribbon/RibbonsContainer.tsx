import { Ribbon } from "../../../types/ApiResponse/Ribbon/ribbon";
import { BooksRibbonContainer } from "./BookRibbonContainer";

export const RibbonsContainer = ({
    ribbons,
    loading,
}: {
    ribbons: Ribbon[];
    loading: boolean;
}) => {
    return (
        <div className="space-y-12">
            {ribbons.map((ribbon) => (
                <BooksRibbonContainer
                    key={ribbon.id || ribbon.name}
                    ribbon={ribbon}
                    loading={loading}
                />
            ))}
        </div>
    );
};