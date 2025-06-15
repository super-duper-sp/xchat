import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, message, Typography, Badge } from 'antd';
import { SwapOutlined, SendOutlined } from '@ant-design/icons';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import useSound from 'use-sound';

const { Text, Title, Paragraph } = Typography;

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [matchedPartner, setMatchedPartner] = useState(null);

  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const profile = useSelector((state) => state.auth.profile?.profileData?.user);


  const [playMatchSound] = useSound('/sounds/match.mp3', {
    volume: 1.0,
    interrupt: true,
  });

  useEffect(() => {
    if (isConnected && profile?.user_id) {
      socket.current = io("http://localhost:8000", {
        transports: ['websocket'],
      });

      socket.current.on("connect", () => {
        console.log("✅ Socket connected:", socket.current.id);
        socket.current.emit("register", profile.user_id);
      });

      socket.current.on("online_users", (count) => {
        setConnectedUsers(count);
      });

      socket.current.on("matched", ({ partnerId }) => {
        setIsMatching(false);
        setMatchedPartner(partnerId);

        // 🔊 Play sound on match
       
            playMatchSound(); // 🔊 Play the sound!
console.log("first")
      })
      socket.current.on("receive_message", (msg) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: msg.message,
          isSender: false,
          timestamp: new Date(),
        }]);
      });

      socket.current.on("partner_left", () => {
        message.warning("⚠️ Your chat partner has left.");
        setMatchedPartner(null);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [isConnected, profile?.user_id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isMatching) {
      const timeout = setTimeout(() => {
        setIsMatching(false);
        message.warning("⏳ Couldn't find a partner. Try again later.");
        handleDisconnect();
      }, 20000);
      return () => clearTimeout(timeout);
    }
  }, [isMatching]);

  const generateWelcomeMessage = (partnerId) => {
    setTimeout(() => {
      const welcomeMessage = {
        id: Date.now(),
        text: `🎉 You've been matched with ${partnerId}! Say hi 👋`,
        isSender: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const response = {
            id: Date.now() + 1,
            text: "Hi there! How are you doing today?",
            isSender: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, response]);
        }, 2000);
      }, 3000);
    }, 1000);
  };

  const handleConnect = () => {
    if (!profile?.user_id) {
      message.error("User profile not found.");
      return;
    }
    setIsConnected(true);
    setMessages([]);
    setMatchedPartner(null);
    setIsMatching(true);
    message.success(`You're now in the queue with ${connectedUsers} users online`);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsMatching(false);
    setMatchedPartner(null);
    setMessages([]);
    message.info("You've been disconnected from the chat");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !matchedPartner) return;

    const messageObj = {
      senderId: profile.user_id,
      message: currentMessage,
    };

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: currentMessage,
      isSender: true,
      timestamp: new Date(),
    }]);

    socket.current.emit("send_message", messageObj);
    setCurrentMessage('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '16px' }}>
      <Card style={{ width: '100%', maxWidth: '700px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isConnected ? (
            <>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: '#722ed1' }}>Random Chat</Title>
                <Paragraph type="secondary">Connect with a random user and start chatting instantly!</Paragraph>
              </div>
              <Button
                type="primary"
                size="large"
                onClick={handleConnect}
                icon={<SwapOutlined />}
                style={{ background: '#722ed1', borderColor: '#722ed1' }}
                block
              >
                Connect
              </Button>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">{connectedUsers} users online</Text>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge color="green" />
                  <Text strong>Connected as {profile?.name || profile?.user_id}</Text>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Text type="secondary">{connectedUsers} online</Text>
                  <Button danger size="small" onClick={handleDisconnect}>Disconnect</Button>
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
                {isMatching && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '300px',
                  }}>
                    <div className="loader" />
                    <Text style={{ marginTop: 16, fontSize: 16, color: '#722ed1' }}>
                      Matching you with someone...
                    </Text>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isSender ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: msg.isSender ? '#722ed1' : 'white',
                      color: msg.isSender ? 'white' : 'black',
                      boxShadow: msg.isSender ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                      border: msg.isSender ? 'none' : '1px solid #e8e8e8',
                    }}>
                      <div>
                        <span>{msg.text}</span><br />
                        <small style={{ fontSize: '11px', color: msg.isSender ? '#ccc' : '#999' }}>
                          {formatTime(msg.timestamp)}
                        </small>
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
                      border: '1px solid #e8e8e8',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 300, 600].map(delay => (
                          <div key={delay} style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#d9d9d9',
                            animation: 'bounce 1.4s infinite ease-in-out',
                            animationDelay: `${delay}ms`
                          }} />
                        ))}
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
                  icon={<SendOutlined />}
                  style={{ background: '#722ed1', borderColor: '#722ed1' }}
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

        .loader {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #722ed1;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;