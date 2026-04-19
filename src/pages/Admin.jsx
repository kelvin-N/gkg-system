import { useEffect, useMemo, useState } from "react";
import { subscribeBookings, updateBookingStatus, assignStaffToBooking } from "../services/Booking";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Admin = () => {
  const { isAdmin, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [assigningStaff, setAssigningStaff] = useState(null);

  // Mock staff data - in a real app, this would come from a staff collection
  const staffMembers = [
    { id: "staff1", name: "Dr. Sarah Johnson" },
    { id: "staff2", name: "Nurse Michael Chen" },
    { id: "staff3", name: "Dr. Emily Davis" },
    { id: "staff4", name: "Nurse David Wilson" }
  ];

  useEffect(() => {
    if (!isAdmin) return;

    const unsubscribe = subscribeBookings(
      (latestBookings) => {
        setBookings(latestBookings);
        setLoading(false);
        setError("");
      },
      (_snapshotError) => {
        setError("Unable to load bookings. Please refresh the page.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((booking) => booking.status === "pending").length;
    const confirmed = bookings.filter((booking) => booking.status === "confirmed").length;
    const cancelled = bookings.filter((booking) => booking.status === "cancelled").length;
    return { total, pending, confirmed, cancelled };
  }, [bookings]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    return new Date(date).toLocaleString();
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingStatus(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch {
      setError("Failed to update booking status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStaffAssignment = async (bookingId, staffId, staffName) => {
    setAssigningStaff(bookingId);
    try {
      await assignStaffToBooking(bookingId, staffId, staffName);
    } catch {
      setError("Failed to assign staff. Please try again.");
    } finally {
      setAssigningStaff(null);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <Link to="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-600">Admin Dashboard</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">Live Booking Feed</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
            Monitor bookings in real time, track status and review the latest appointment requests.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleLogout} className="btn-secondary inline-flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <Link to="/booking" className="btn-primary inline-flex items-center justify-center">
            Add New Booking
          </Link>
          <Link to="/services" className="btn-secondary inline-flex items-center justify-center">
            View Services
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Bookings</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Pending</p>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Confirmed</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Cancelled</p>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
        </div>
      </div>

      <section className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Live updates from your Firestore bookings collection.</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Updated automatically when new bookings arrive.
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-6 text-red-700 dark:text-red-200">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-10 text-center text-gray-500 dark:text-gray-400">
            No bookings yet. New appointment requests will appear here as they come in.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Staff</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.name || "—"}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.email || "—"}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{booking.service || "—"}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{booking.date || "—"}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                        booking.status === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}>
                        {booking.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {booking.assignedStaff ? booking.assignedStaff.name : "Unassigned"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-y-2">
                      {/* Status Update Buttons */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                          disabled={updatingStatus === booking.id || booking.status === "confirmed"}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === booking.id ? "..." : "✓"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                          disabled={updatingStatus === booking.id || booking.status === "cancelled"}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === booking.id ? "..." : "✗"}
                        </button>
                      </div>

                      {/* Staff Assignment Dropdown */}
                      <select
                        value={booking.assignedStaff?.id || ""}
                        onChange={(e) => {
                          const selectedStaff = staffMembers.find(staff => staff.id === e.target.value);
                          if (selectedStaff) {
                            handleStaffAssignment(booking.id, selectedStaff.id, selectedStaff.name);
                          }
                        }}
                        disabled={assigningStaff === booking.id}
                        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Assign Staff</option>
                        {staffMembers.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(booking.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
