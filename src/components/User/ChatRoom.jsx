import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const ChatRoom = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'You', text: input }]);
    // TODO: Send via WebSocket
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        <header className="bg-indigo-600 text-white text-center p-4 text-xl font-bold">
          🌐 Chat with Stranger
        </header>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === 'You' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === 'You'
                    ? 'bg-indigo-200 text-right'
                    : 'bg-gray-200'
                }`}
              >
                <span className="text-sm font-medium block mb-1 text-gray-600">
                  {msg.sender}
                </span>
                <span className="text-sm">{msg.text}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-4 border-t flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ChatRoom;