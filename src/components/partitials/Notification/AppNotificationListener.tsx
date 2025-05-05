import { useEffect } from "react"
import { messaging, onMessage } from "../../../assets/js/firebase-config"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { plusUnreadCount } from "../../../redux/slice/notificationSlice"
import AuthUtil from "../../../utils/authUtil"

export const AppNotificationListener = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("[FCM] Message received: ", payload)
            // Tăng tạm thời số lượng thông báo chưa đọc lên 1
            dispatch(plusUnreadCount());
            if (!AuthUtil.isLogged())
                return;
            toast.info(payload?.notification?.title || "Thông báo mới", {
                description: payload?.notification?.body,
            })
        })

        return () => {
            unsubscribe()
        }
    }, [dispatch])

    return null
}
