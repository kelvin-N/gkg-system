## 🏥 GKG Home Health Care & Housekeeping System

A web-based platform for managing home healthcare and housekeeping services.  
Built with React, Firebase, and Vite.

---

## 🚀 Features

### 🌐 Customer Side
- View available services
- Book healthcare or housekeeping services
- Submit booking requests online

### ⚙️ Admin Dashboard
- View all bookings in real-time
- Track customer details
- Monitor booking status

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Firebase
- **Database:** Firestore
- **Authentication:** Firebase Auth (optional)
- **Styling:** CSS (Tailwind optional)

---

## 🏥 Available Services

### Medical Care Services
- **Nursing Care** - Professional nursing services at home
- **Physical Therapy** - Rehabilitation and physical therapy sessions
- **Medical Check-up** - Routine health examinations
- **Home Care Assistance** - General assistance with daily activities
- **Home Health Care** - Comprehensive in-home medical care including vital sign monitoring, medication management, wound care, and chronic condition management
- **Rehabilitation** - Recovery and rehabilitation programs

### Support Services
- **House Keeping** - Professional cleaning and maintenance services to keep your home safe, clean, and comfortable

---

## � Adding New Services

To add new services to the system:

1. **Update Booking Form**: Add the service option to the dropdown in `src/pages/Booking.jsx`
2. **Add to Database**: Use the temporary utility at `/add-services` to add services to Firebase
3. **Update Documentation**: Add the new service to this README

### Temporary Service Addition Utility

A temporary page is available at `/add-services` to add the new services to Firebase. After adding services:

1. Visit `http://localhost:5173/add-services` (when running dev server)
2. Click "Add Services to Database"
3. Verify services appear on the Services page
4. Remove the `AddServices.jsx` file and route from `App.jsx`

---

## �📁 Project Structure
