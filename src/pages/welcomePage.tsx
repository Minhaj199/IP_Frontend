import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Welcome = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/products");
  };

  useEffect(() => {
    document.title = "Welcome | Inventory App";
  }, []);

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 text-white cursor-pointer transition duration-300 hover:brightness-110"
    >
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to Stock Inventory</h1>
        <p className="text-xl opacity-90">Click anywhere to continue...</p>
      </div>
    </div>
  );
};

export default Welcome;
