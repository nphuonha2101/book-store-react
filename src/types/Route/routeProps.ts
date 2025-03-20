import { LayoutProps } from "../Layout/layoutProps.ts"

export interface RouteProps {
    path: string
    Component: React.ComponentType
    Layout: React.ComponentType<LayoutProps>
    routeType: number
}