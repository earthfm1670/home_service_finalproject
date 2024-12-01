import { FC } from "react";

interface MyCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const MyCard: FC<MyCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default MyCard;
