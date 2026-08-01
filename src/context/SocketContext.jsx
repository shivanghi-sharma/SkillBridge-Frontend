import { createContext, useContext , useEffect , useState } from 'react'
import {io} from 'socket.io-client'
import {useAuth} from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({children}) => {
    const { user } = useAuth()
    const[socket , setSocket] = useState(null)

useEffect(() => {
    if(user) {
        //Connect to socket server when user logs in
       const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000')
        newSocket.on('connect', () => {
            newSocket.emit('join_user_room', user._id)
        })

        setTimeout(() => setSocket(newSocket), 0)

        return () => newSocket.disconnect()
    }
    },[user])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>

    )
}

export const useSocket = () => useContext(SocketContext)
