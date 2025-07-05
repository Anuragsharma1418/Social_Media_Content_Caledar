const ExportButton = ({ exportToExcel, isDisabled }) => {
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={exportToExcel}
        disabled={isDisabled}
        className=" cursor-pointer px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg"
      >
        Export to Excel
      </button>
    </div>
  );
};
export default ExportButton;
