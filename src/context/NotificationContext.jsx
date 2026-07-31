import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import { useSocket } from './SocketContext'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth()
    const { socket } = useSocket()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications')
            setNotifications(res.data)
            setUnreadCount(res.data.filter(n => !n.read).length)
        } catch (error) {
            console.error('Failed to fetch notifications', error)
        }
    }

    useEffect(() => {
        if (user) {
            fetchNotifications()
        } else {
            setNotifications([])
            setUnreadCount(0)
        }
    }, [user])

    useEffect(() => {
        if (socket) {
            socket.on('new_notification', (notification) => {
                setNotifications(prev => [notification, ...prev])
                setUnreadCount(prev => prev + 1)
            })

            return () => {
                socket.off('new_notification')
            }
        }
    }, [socket])

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`)
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark notification as read', error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all')
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all notifications as read', error)
        }
    }

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => useContext(NotificationContext)
