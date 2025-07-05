const DistributedPostsSummary = ({ distributedPosts }) => {
  const hasPosts = Object.keys(distributedPosts).length > 0;

  return (
    <div className="mt-8 w-auto max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Distributed Posts Summary:
      </h2>

      {!hasPosts ? (
        <p className="text-gray-500">No posts distributed yet.</p>
      ) : (
        <ul className="space-y-2">
          {Object.keys(distributedPosts).map((date) => (
            <li key={date} className="bg-pink-300 px-4 py-2 rounded shadow">
              {date} - {distributedPosts[date].length} Posts
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DistributedPostsSummary;
