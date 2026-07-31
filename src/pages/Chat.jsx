import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import api from '../api/axios'
import { Send, MessageSquare } from 'lucide-react'
import { AnimatePresence, motion, MotionButton } from '../components/motion'

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
    <div
      className="page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >

      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <MessageSquare size={18} style={{ color: 'var(--color-accent)' }} />
        <div>
          <h1
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Session Chat
          </h1>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
        }}
      >
        {messages.length === 0 && (
          <div className="empty-state" style={{ padding: '3rem 2rem' }}>
            <MessageSquare size={32} className="empty-state__icon" />
            <p className="empty-state__title">No messages yet</p>
            <p className="empty-state__text">Start the conversation</p>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
            maxWidth: 720,
            margin: '0 auto',
          }}
        >
          <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender._id === user?._id || msg.sender === user?._id
            return (
              <motion.div
                key={msg._id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    backgroundColor: isMe
                      ? 'var(--color-accent)'
                      : 'var(--color-surface-raised)',
                    color: isMe
                      ? 'var(--color-text-inverse)'
                      : 'var(--color-text-primary)',
                    borderLeft: isMe ? 'none' : '3px solid var(--color-border)',
                  }}
                >
                  {!isMe && (
                    <p
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {msg.sender.name}
                    </p>
                  )}
                  <p>{msg.text}</p>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      marginTop: '0.375rem',
                      color: isMe
                        ? 'rgba(10, 10, 11, 0.6)'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            )
          })}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  padding: '0.75rem 1rem',
                  borderLeft: '3px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'var(--color-text-muted)',
                      borderRadius: '50%',
                      animation: 'pulse-subtle 1s ease-in-out infinite',
                    }}
                  />
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'var(--color-text-muted)',
                      borderRadius: '50%',
                      animation: 'pulse-subtle 1s ease-in-out infinite',
                      animationDelay: '0.15s',
                    }}
                  />
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'var(--color-text-muted)',
                      borderRadius: '50%',
                      animation: 'pulse-subtle 1s ease-in-out infinite',
                      animationDelay: '0.3s',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border-subtle)',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: 720,
            margin: '0 auto',
          }}
        >
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            className="input-field input-field--boxed"
            style={{ fontSize: '0.875rem' }}
          />
          <MotionButton
            onClick={sendMessage}
            disabled={!text.trim()}
            className="btn btn-primary"
            style={{ padding: '0.625rem 1rem', flexShrink: 0 }}
            aria-label="Send message"
            hoverScale={1.06}
            tapScale={0.94}
          >
            <Send size={16} />
          </MotionButton>
        </div>
      </div>

    </div>
  )
}

export default Chat