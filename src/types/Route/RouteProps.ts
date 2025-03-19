import { LayoutProps } from "../Layout/LayoutProps"

export interface RouteProps {
    path: string
    Component: React.ComponentType
    Layout: React.ComponentType<LayoutProps>
    routeType: number
}