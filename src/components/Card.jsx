import React, { useState } from "react";
import { getUserToken } from "../common/constants/storage";
import LoginModal from "../auth/login";
import { likeNews, unlikeNews, pinNews, unpinNews } from "../api/news";

const Card = ({
  title,
  date,
  description,
  likes: initialLikes,
  saves: initialSaves,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
  imageUrl,
  onClick,
  id, // assuming news item id
  organizationId,
}) => {

  
  const [openModal, setOpenModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [saves, setSaves] = useState(initialSaves || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [isSaved, setIsSaved] = useState(initialIsSaved || false);

  const performAction = async (action) => {
    const token = await getUserToken();
    if (!token) {
      setPendingAction(action);
      setOpenModal(true);
      return;
    }

    try {
      let response;
      switch (action) {
        case 'like':
          response = await (isLiked ? unlikeNews(organizationId, id) : likeNews(organizationId, id));
          if (response.success) {
            if (!isLiked) {
              setLikes(likes + 1);
              setIsLiked(true);
            } else {
              setLikes(likes - 1);
              setIsLiked(false);
            }
          }
          break;
        case 'save':
          response = await (isSaved ? unpinNews(id) : pinNews(id));
          if (response.success) {
            if (!isSaved) {
              setSaves(saves + 1);
              setIsSaved(true);
            } else {
              setSaves(saves - 1);
              setIsSaved(false);
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const handlePostLogin = () => {
    if (pendingAction) {
      performAction(pendingAction);
      setPendingAction(null);
    }
  };

  return (
    <div className="w-full sm:w-[400px] md:w-[450px] lg:w-[500px] rounded-lg overflow-hidden shadow-lg bg-white mx-auto my-4">
      <img className="w-full h-[150px] sm:h-[200px] object-cover" src={imageUrl} alt={title} />
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="font-bold text-lg sm:text-xl mb-2 line-clamp-2">{title}</div>
        <p className="text-gray-700 text-sm sm:text-base">{date}</p>
        <p className="text-gray-700 text-sm sm:text-base mt-2">{description}</p>
      </div>
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <span
          onClick={() => performAction('like')}
          className={`inline-block ${isLiked ? 'bg-red-200' : 'bg-gray-200 hover:bg-gray-300'} rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer`}
        >
          {isLiked ? '👎' : '👍'} {likes}
        </span>
        <span
          onClick={() => performAction('save')}
          className={`inline-block ${isSaved ? 'bg-yellow-200' : 'bg-gray-200 hover:bg-gray-300'} rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer`}
        >
          {isSaved ? '✔' : '💾'} {saves}
        </span>
      </div>
      <div className="px-4 sm:px-6 py-2">
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
          onClick={onClick}
        >
          Continue Reading
        </button>
      </div>
      {
        openModal &&
        <LoginModal open={openModal} onClose={() => setOpenModal(false)} actionCb={handlePostLogin} />
      }
    </div>
  );
};

export default Card;
