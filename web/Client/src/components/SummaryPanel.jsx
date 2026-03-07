function SummaryPanel({ summary }) {

  return (
    <div className="bg-white shadow rounded p-6">

      <h3 className="text-lg font-semibold mb-4">
        AI Summary
      </h3>

      <p className="text-gray-700">
        {summary || "No summary available."}
      </p>

    </div>
  );
}

export default SummaryPanel;