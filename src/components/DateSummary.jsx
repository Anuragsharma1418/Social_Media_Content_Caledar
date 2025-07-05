import { format } from "date-fns";

const DateSummary = ({ selectedDates }) => {
  return (
    <div className="mt-8 w-auto max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Selected Dates Summary:
      </h2>

      <p className="text-gray-600">
        {selectedDates.length} date
        {selectedDates.length === 1 ? "" : "s"} selected
      </p>

      {selectedDates.length === 0 ? (
        <p className="text-gray-500">No dates selected yet.</p>
      ) : (
        <ul className="space-y-2">
          {selectedDates.map((d, i) => (
            <li key={i} className="px-4 py-2 rounded shadow bg-purple-300">
              {format(d, "dd MMM yyyy")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default DateSummary;
