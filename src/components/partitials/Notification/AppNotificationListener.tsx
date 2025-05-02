import { useEffect } from "react"
import { messaging, onMessage } from "../../../assets/js/firebase-config"
import { toast } from "sonner"

export const AppNotificationListener = () => {
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("[FCM] Message received: ", payload)
            toast(payload?.notification?.title || "Thông báo mới", {
                description: payload?.notification?.body,
            })
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return null
}
