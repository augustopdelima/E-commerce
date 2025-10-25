import type { FC } from "react";

interface ProductThumbProps {
    imageUrl:string,
    name:string,
}

export const Thumb:FC<ProductThumbProps> = ({ imageUrl, name }) => {
  return (
   <aside className="w-full">
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-auto object-cover aspect-square" 
        />
      </div> 
      <div className="flex gap-2">
        
        <div className="w-16 h-16 border border-indigo-500 rounded-md cursor-pointer overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt="Miniatura do produto"
            className="w-full h-full object-cover"
          />
        </div>
       
      </div>
    </aside> 
  );
};
