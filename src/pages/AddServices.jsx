import { useState } from "react";
import { addServicesToFirebase } from "../services/addServices";

const AddServices = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddServices = async () => {
    setLoading(true);
    setStatus("Adding services to database...");

    try {
      const result = await addServicesToFirebase();
      if (result.success) {
        setStatus("Services added successfully! You can now remove this page.");
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Add New Services to Database
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This utility will add the following services to your Firebase database:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Home Health Care</strong> - Comprehensive in-home medical care</li>
              <li><strong>House Keeping</strong> - Professional cleaning and maintenance services</li>
            </ul>
          </div>

          <div className="mb-6">
            <button
              onClick={handleAddServices}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Adding Services..." : "Add Services to Database"}
            </button>
          </div>

          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes("Error")
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            }`}>
              {status}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Next Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
              <li>Click the button above to add services to Firebase</li>
              <li>Verify services appear on the Services page</li>
              <li>Delete this AddServices.jsx file and remove the route</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServices;