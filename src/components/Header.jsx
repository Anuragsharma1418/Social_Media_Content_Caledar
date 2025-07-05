import { addMonths, subMonths, format } from "date-fns";

const Header = ({ currentMonth, setCurrentMonth }) => {
  return (
    <div className="flex justify-between items-center mb-6 animate-fade-in">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="cursor-pointer px-4 py-2 bg-blue-300 hover:bg-blue-500 rounded shadow transition-transform hover:scale-105"
      >
        Prev
      </button>
      <h2 className="text-2xl font-bold text-blue-600 animate-slide-in">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="cursor-pointer px-4 py-2 bg-blue-300 hover:bg-blue-500 rounded shadow transition-transform hover:scale-105"
      >
        Next
      </button>
    </div>
  );
};

export default Header;
