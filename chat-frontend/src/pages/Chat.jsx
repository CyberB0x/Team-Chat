//  Chat.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  //  State for rooms and selected room
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const navigate = useNavigate();

  //  Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const res = await API.get("/chat/rooms/");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  }

  async function fetchMessages(roomId) {
    try {
      const res = await API.get(`/chat/rooms/${roomId}/messages/`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedRoom || !newMessage.trim()) return;

    try {
      const res = await API.post(`/chat/rooms/${selectedRoom.id}/messages/`, {
        content: newMessage,
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  function handleSelectRoom(room) {
    setSelectedRoom(room);
    fetchMessages(room.id);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Rooms
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </h2>

        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => handleSelectRoom(room)}
              className={`p-2 rounded cursor-pointer ${
                selectedRoom?.id === room.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {selectedRoom.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-gray-100 p-2 rounded w-fit"
                >
                  <strong>{msg.user.username}: </strong>
                  {msg.content}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t flex space-x-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border p-2 rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 rounded"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a room to start chatting 💬</p>
          </div>
        )}
      </div>
    </div>
  );
}
