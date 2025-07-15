import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../store/slices/chatSlice';
import useScrollToBottom from '../hooks/useScrollToBottom';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const MESSAGES_PER_PAGE = 20;

const ChatroomPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const allMessages = messages[id] || [];
  const paginatedMessages = allMessages.slice(-page * MESSAGES_PER_PAGE);

  const scrollRef = useRef(null);
  useScrollToBottom(scrollRef, [paginatedMessages.length, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed && !imagePreview) return;

    const userMsg = {
      id: Date.now(),
      sender: user?.email || user?.phone,
      text: trimmed,
      image: imagePreview,
      timestamp: new Date().toISOString(),
      type: imagePreview ? 'image' : 'text',
    };

    dispatch(addMessage({ chatroomId: id, message: userMsg }));
    setInput('');
    setImagePreview(null);
    simulateGeminiReply(trimmed);
  };

  const simulateGeminiReply = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'Gemini',
        text: `You said: "${text}" 🤖`,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      dispatch(addMessage({ chatroomId: id, message: botMsg }));
      setIsTyping(false);
    }, 1500);
  };

  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop === 0 && paginatedMessages.length < allMessages.length) {
      setPage((prev) => prev + 1);
      toast('Loading older messages...');
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5] dark:bg-gray-900 p-2 sm:p-4 relative">
      {/* Header */}
      <div className="text-xl font-bold text-center py-2 text-white bg-green-600 rounded-t shadow">
        Chatroom #{id}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2 bg-chat-light dark:bg-chat-dark rounded shadow-inner space-y-3"
        onScroll={handleScroll}
      >
        {paginatedMessages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-2 max-w-xs md:max-w-md lg:max-w-lg text-sm shadow-sm ${
              msg.sender === (user?.email || user?.phone)
                ? 'ml-auto bg-green-500 text-white'
                : 'mr-auto bg-white dark:bg-gray-800 text-black dark:text-white'
            }`}
          >
            {msg.type === 'image' && (
              <img src={msg.image} alt="upload" className="rounded mb-1 max-h-48 object-cover" />
            )}
            <p>{msg.text}</p>
            <span className="block text-[10px] text-right mt-1 opacity-60">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="italic text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            Gemini is typing
            <span className="animate-pulse">...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Section */}
      <div className="mt-3 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow">
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />

        <button onClick={() => setShowEmoji((prev) => !prev)} className="text-xl">
          😊
        </button>

        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-24 left-2 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}
    </div>
  );
};

export default ChatroomPage;
