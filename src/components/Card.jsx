const Card = ({
  title,
  date,
  description,
  likes,
  saves,
  imageUrl,
  onClick,
}) => {
  return (
    <div className="w-full sm:w-[400px] md:w-[450px] lg:w-[500px] rounded-lg overflow-hidden shadow-lg bg-white mx-auto my-4">
      <img className="w-full h-[150px] sm:h-[200px] object-cover" src={imageUrl} alt={title} />
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="font-bold text-lg sm:text-xl mb-2 line-clamp-2">{title}</div>
        <p className="text-gray-700 text-sm sm:text-base">{date}</p>
        <p className="text-gray-700 text-sm sm:text-base mt-2">{description}</p>
      </div>
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <span className="inline-block bg-gray-200 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700">
          👍 {likes}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700">
          💾 {saves}
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
    </div>
  );
};

export default Card;
