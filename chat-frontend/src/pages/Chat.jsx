import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Получаем список комнат
  useEffect(() => {
    API.get("/chat/rooms/")
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    // загрузка сообщений комнаты
    API.get(`/chat/rooms/${room.id}/messages/`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedRoom) return;

    const res = await API.post(`/chat/rooms/${selectedRoom.id}/messages/`, {
      content: text,
    });
    setMessages([...messages, res.data]);
    setText("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-lg flex flex-col">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">💬 Rooms</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => handleRoomSelect(room)}
              className={`cursor-pointer p-3 hover:bg-blue-50 ${
                selectedRoom?.id === room.id ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b bg-white shadow-sm">
              <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex flex-col max-w-md"
                >
                  <span className="text-sm text-gray-500">
                    {msg.user.username}
                  </span>
                  <div className="bg-blue-100 p-2 rounded-lg inline-block">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t bg-white flex space-x-2"
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a room to start chatting 💬
          </div>
        )}
      </main>
    </div>
  );
}
