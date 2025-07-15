import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatroom, deleteChatroom } from '../store/slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useDebounce from '../hooks/useDebounce';
import ThemeToggle from '../Components/UI/ThemeToggle';
import { FaTrashAlt, FaPlus, FaComments } from 'react-icons/fa';

function Dashboard() {
  const chat = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newRoom, setNewRoom] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const filteredChatrooms = Array.isArray(chat.chatrooms)
    ? chat.chatrooms.filter((room) =>
        room.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : [];

  const handleCreate = () => {
    if (!newRoom.trim()) return toast.error('Room title required');
    const newChatroom = {
      id: Date.now().toString(),
      title: newRoom.trim(),
    };
    dispatch(addChatroom(newChatroom));
    toast.success('Chatroom created');
    setNewRoom('');
  };

  const handleDelete = (id) => {
    dispatch(deleteChatroom(id));
    toast.success('Chatroom deleted');
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="max-w-3xl mx-auto bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg text-black dark:text-white transition">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-2">
            <FaComments className="text-xl" />
            Chatrooms
          </h1>
          <ThemeToggle />
        </div>

        <input
          type="text"
          placeholder="Search chatrooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter new chatroom title"
            className="flex-1 p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Create
          </button>
        </div>

        <ul className="space-y-4">
          {filteredChatrooms.map((room) => (
            <li
              key={room.id}
              className="flex justify-between items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition"
            >
              <span
                onClick={() => navigate(`/chatroom/${room.id}`)}
                className="cursor-pointer hover:text-blue-600 dark:hover:text-cyan-400 font-medium transition"
              >
                {room.title}
              </span>
              <button
                onClick={() => handleDelete(room.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FaTrashAlt />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
