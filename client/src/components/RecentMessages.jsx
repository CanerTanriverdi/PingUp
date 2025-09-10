import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const getAvatar = (url) => (url && url.trim() !== "" ? url : "https://ssl.gstatic.com/accounts/ui/avatar_2x.png");

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/recent-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const grouped = data.messages.reduce((acc, m) => {
          const id = m.from_user_id?._id;
          if (!id) return acc;
          if (!acc[id] || new Date(m.createdAt) > new Date(acc[id].createdAt)) acc[id] = m;
          return acc;
        }, {});
        const sorted = Object.values(grouped).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sorted);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchRecentMessages();
    const id = setInterval(fetchRecentMessages, 3000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-8 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id?._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
          >
            <img
              src={getAvatar(message.from_user_id?.profile_picture || null)}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium">{message.from_user_id?.full_name || "Unknown"}</p>
                <p className="text-[10px] text-slate-400">{moment(message.createdAt).fromNow()}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">{message.text ? message.text : "media"}</p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
