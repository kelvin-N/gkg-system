import { useState } from "react";
import { Link } from "react-router-dom";
import { createBooking } from "../services/Booking";

const Booking = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success' or 'error'
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const serviceOptions = [
    "Nursing Care",
    "Physical Therapy",
    "Medical Check-up",
    "Home Care Assistance",
    "Home Health Care",
    "House Keeping",
    "Rehabilitation",
    "Other"
  ];

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", service: "", date: "", message: "" });
    setStatus("");
    setStatusType("");
    setFormErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.email.trim()) errors.email = "Email address is required.";
    if (!form.service) errors.service = "Please select a service.";
    if (!form.date) errors.date = "Preferred date is required.";

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setStatus("Please complete all required fields before submitting.");
      setStatusType("error");
      return;
    }

    setSaving(true);
    setStatus("");
    setFormErrors({});

    const result = await createBooking(form);
    if (result.success) {
      setStatus("Booking request sent successfully! We will contact you within 24 hours.");
      setStatusType("success");
      setForm({ name: "", email: "", phone: "", service: "", date: "", message: "" });
    } else {
      setStatus(result.error || "Failed to send booking request. Please try again or contact us directly.");
      setStatusType("error");
    }

    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Book Your Appointment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Schedule your home health care service with ease. Fill out the form below
          and we'll get back to you promptly to confirm your appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Appointment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
                {formErrors.name && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{formErrors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
                {formErrors.email && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              {/* Service Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                {formErrors.service && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{formErrors.service}</p>}
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {formErrors.date && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{formErrors.date}</p>}
              </div>

              {/* Message Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Please provide any additional information about your health needs or special requirements..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Send Booking Request
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full btn-secondary"
              >
                Reset Form
              </button>
            </div>
          </form>

          {/* Status Message */}
          {status && (
            <div className={`mt-6 p-4 rounded-lg font-medium ${
              statusType === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
            }`}>
              <div className="flex items-center gap-3">
                {statusType === "success" ? (
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <span>{status}</span>
              </div>
            </div>
          )}

          {(form.service || form.date || form.name || form.email) && (
            <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Booking preview</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 mb-2">Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{form.name || "N/A"}</p>
                </div>
                <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 mb-2">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{form.email || "N/A"}</p>
                </div>
                <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 mb-2">Service</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{form.service || "Not selected"}</p>
                </div>
                <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 mb-2">Preferred Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{form.date ? new Date(form.date).toLocaleDateString() : "Not selected"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">+233 XX XXX XXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">info@gkghealth.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Hours */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Service Hours
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                <span className="font-medium text-gray-900 dark:text-white">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                <span className="font-medium text-gray-900 dark:text-white">Emergency Only</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link to="/services" className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                View All Services →
              </Link>
              <Link to="/" className="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Back to Home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
