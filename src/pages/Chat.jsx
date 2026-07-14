import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../api/axios'

const Chat = () => {
  const { bookingId } = useParams()
  const { user } = useAuth()
  const { socket } = useSocket()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  let typingTimeout = useRef(null)

  // Load existing messages + join room
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${bookingId}`)
        setMessages(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchMessages()

    if (socket) {
      socket.emit('join_room', bookingId)

      // Listen for incoming messages
      socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data])
      })

      // Listen for typing indicator
      socket.on('typing', (data) => {
        setIsTyping(data.typing)
      })
    }

    return () => {
      if (socket) {
        socket.off('receive_message')
        socket.off('typing')
      }
    }
  }, [bookingId, socket])

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTyping = (e) => {
    setText(e.target.value)

    if (!typing) {
      setTyping(true)
      socket?.emit('typing', { bookingId, typing: true })
    }

    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      setTyping(false)
      socket?.emit('typing', { bookingId, typing: false })
    }, 1000)
  }

  const sendMessage = async () => {
    if (!text.trim()) return

    try {
      // Save to DB
      const res = await api.post('/chat', { bookingId, text })

      // Add to own UI instantly
      setMessages(prev => [...prev, res.data])

      // Emit to other user via socket
      socket?.emit('send_message', {
        bookingId,
        ...res.data
      })

      setText('')
      socket?.emit('typing', { bookingId, typing: false })
    } catch (err) {
      console.error(err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-white font-semibold">Session Chat</h1>
        <p className="text-gray-400 text-xs mt-1">Booking ID: {bookingId}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center text-sm">
            No messages yet. Say hello! 👋
          </p>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender._id === user?._id || msg.sender === user?._id
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm
                ${isMe
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {!isMe && (
                  <p className="text-blue-400 text-xs font-medium mb-1">
                    {msg.sender.name}
                  </p>
                )}
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition disabled:opacity-50 text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}

export default Chat