import { RibbonItem } from "./ribbonItem";

export interface Ribbon {
    id?: number;
    name?: string;
    description?: string;
    status?: boolean;
    ribbonItems?: RibbonItem[];
}