import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import AddServices from "./pages/AddServices";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
      <Router>
      {/* Modern Header with Gradient Background */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-blue-900 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">G</span>
              </div>
              <span className="hidden sm:block">GKG Health Care</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-4 md:gap-8">
              <Link to="/" className="text-white/90 hover:text-white font-medium transition-colors hidden sm:block">
                Home
              </Link>
              <Link to="/services" className="text-white/90 hover:text-white font-medium transition-colors hidden sm:block">
                Services
              </Link>
              <Link to="/admin" className="text-white/90 hover:text-white font-medium transition-colors hidden sm:block">
                Admin
              </Link>
              <Link to="/booking" className="btn-primary bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md">
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button className="text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <Routes>
            {/* Enhanced Home Page */}
            <Route path="/" element={
              <div className="text-center py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    Your Health, <span className="text-blue-600 dark:text-blue-400">Our Priority</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Professional home health care services delivered with compassion and expertise.
                    Experience healthcare that comes to you.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link to="/services" className="btn-primary w-full sm:w-auto">
                      Explore Services
                    </Link>
                    <Link to="/booking" className="btn-secondary w-full sm:w-auto">
                      Schedule Appointment
                    </Link>
                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="card text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Certified Professionals</h3>
                      <p className="text-gray-600 dark:text-gray-400">Licensed healthcare providers with years of experience</p>
                    </div>

                    <div className="card text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Home Visits</h3>
                      <p className="text-gray-600 dark:text-gray-400">Convenient healthcare services in the comfort of your home</p>
                    </div>

                    <div className="card text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
                      <p className="text-gray-600 dark:text-gray-400">Round-the-clock emergency support and consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-services" element={<RequireAdmin><AddServices /></RequireAdmin>} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold">GKG Health Care</span>
              </div>
              <p className="text-gray-400 mb-4">
                Providing compassionate and professional home health care services
                to our community with dedication and excellence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/booking" className="text-gray-400 hover:text-white transition-colors">Book Appointment</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Admin Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +233 XX XXX XXXX
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@gkghealth.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 GKG Home Health Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(_error, _info) {
    // You could log to an external service here
    // console.error(_error, _info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-gray-900 p-4">
          <div className="max-w-2xl w-full text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <pre className="text-sm text-left overflow-auto max-h-48 p-2 bg-gray-100 dark:bg-gray-700 rounded">{String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}</pre>
            <div className="mt-6">
              <button onClick={() => window.location.reload()} className="btn-primary">Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default App;