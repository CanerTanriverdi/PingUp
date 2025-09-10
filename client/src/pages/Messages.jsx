import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessagesSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const Messages = () => {
  // fix profile picture by me
  const getAvatar = (url) => {
    if (url && url.trim() !== "") return url;
    return "https://ssl.gstatic.com/accounts/ui/avatar_2x.png"; // Google default avatar
  };

  const { getToken } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
  }, []);

  const { connections } = useSelector((state) => state.connections);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Talk to your friends and family</p>
        </div>

        {/* Connected Users */}
        <div className="flex flex-col gap-3">
          {connections.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex flex-warp gap-5 p-6 bg-white shadow rounded-md"
            >
              {/* <img
                src={user.profile_picture}
                alt=""
                className="rounded-full size-12 mx-auto"
              /> */}
              <img
                src={getAvatar(user.profile_picture)}
                alt=""
                className="rounded-full w-12 h-12 shadow-md mx-auto"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-700">{user.full_name}</p>
                <p className="text-slate-500">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.bio}</p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1"
                >
                  <MessagesSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
