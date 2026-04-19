import { useEffect, useState } from "react";
import { getServices } from "../services/serviceService";

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getServices();
      setServices(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Services</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200">No services available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.name}</h2>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">{service.category}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">GHS {service.price}</span>
                <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;