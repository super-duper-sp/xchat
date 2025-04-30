import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, message, Typography, Avatar, Badge } from 'antd';
import { MessageOutlined, SwapOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const RANDOM_RESPONSES = [
  "Hello! How are you doing today?",
  "Nice to meet you! Where are you from?",
  "What brings you to this chat?",
  "That's interesting! Tell me more about it.",
  "I'm enjoying our conversation!",
  "What do you like to do in your free time?",
  "Have you seen any good movies lately?",
  "What kind of music do you listen to?",
  "That's cool! I've been thinking about that too.",
  "Do you have any travel plans coming up?"
];

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(Math.floor(Math.random() * 1000) + 500);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simulate connected users count
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setConnectedUsers(prev => {
          const change = Math.floor(Math.random() * 10) - 5;
          return Math.max(100, prev + change);
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  // Generate a welcome message when connecting
  const generateWelcomeMessage = () => {
    setTimeout(() => {
      const welcomeMessage = {
        id: Date.now(),
        text: `Hey ${nickname}! Welcome to the chat. Someone will be with you shortly.`,
        isSender: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Simulate typing indicator
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const response = {
            id: Date.now() + 1,
            text: "Hi there! I've been connected to chat with you. How are you doing today?",
            isSender: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, response]);
        }, 2000);
      }, 3000);
    }, 1000);
  };

  const handleConnect = () => {
    if (!nickname) {
      message.error("Please enter a nickname before connecting");
      return;
    }
    setIsConnected(true);
    setMessages([]);
    generateWelcomeMessage();
    message.success(`You're now chatting with one of ${connectedUsers} online users`);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMessages([]);
    message.info("You've been disconnected from the chat");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: currentMessage,
      isSender: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulate received message with typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = RANDOM_RESPONSES[Math.floor(Math.random() * RANDOM_RESPONSES.length)];
      const receivedMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        isSender: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, receivedMessage]);
    }, 1500 + Math.random() * 2000);
  };

  // Format timestamp for messages
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '16px' }}>
      <Card style={{ width: '100%', maxWidth: '700px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Title level={2} style={{ color: '#722ed1' }}>Global Chat</Title>
                <Paragraph type="secondary">Connect with random people around the world</Paragraph>
              </div>
              <Input
                size="large"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                onPressEnter={handleConnect}
              />
              <Button
                type="primary"
                size="large"
                onClick={handleConnect}
                style={{ background: '#722ed1', borderColor: '#722ed1' }}
                icon={<SwapOutlined />}
                block
              >
                Connect to Random Chat
              </Button>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">{connectedUsers.toLocaleString()} users online now</Text>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge status="processing" color="green" />
                  <Text strong>Connected as {nickname}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{connectedUsers.toLocaleString()} online</Text>
                  <Button
                    danger
                    size="small"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
              
              <div style={{ 
                minHeight: '400px', 
                maxHeight: '400px', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px', 
                padding: '16px', 
                background: '#f0f2f5', 
                borderRadius: '8px' 
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.isSender ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px',
                        borderRadius: '8px',
                        background: message.isSender ? '#722ed1' : 'white',
                        color: message.isSender ? 'white' : 'inherit',
                        boxShadow: message.isSender ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                        border: message.isSender ? 'none' : '1px solid #e8e8e8',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{message.text}</span>
                        <span
                          style={{
                            fontSize: '12px',
                            marginTop: '4px',
                            color: message.isSender ? 'rgba(255,255,255,0.7)' : '#a0a0a0',
                          }}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #e8e8e8',
                    }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div className="typing-dot" style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: '#d9d9d9',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '0ms'
                        }}></div>
                        <div className="typing-dot" style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: '#d9d9d9',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '300ms'
                        }}></div>
                        <div className="typing-dot" style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: '#d9d9d9',
                          animation: 'bounce 1.4s infinite ease-in-out',
                          animationDelay: '600ms'
                        }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1 }}
                />
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{ background: '#722ed1', borderColor: '#722ed1' }}
                  icon={<SendOutlined />}
                >
                  Send
                </Button>
              </form>
            </>
          )}
        </div>
      </Card>
      
      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0);
          }
          40% { 
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;