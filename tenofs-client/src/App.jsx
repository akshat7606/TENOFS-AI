// Tenofs Fullstack Web App (Firebase-powered, React Frontend)
// Enhanced with PAN + Agreement verification, Proof upload, Exit video logging, Trust Score display, and Private Review system.

import React, {createContext, useState, useEffect,useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import './styles.css';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TryItFirstPage from "./components/ui/TryItFirstPage"; // Update the path as needed
import { Layout } from "./components/ui/layout";
import { Navigate } from "react-router-dom";
import { Header } from "./components/ui/header"; // Use named import
import { Footer } from "./components/ui/footer"; // Adjust the path if needed
import LandingPage from "./components/ui/LandingPage"; // Adjust the path if necessary // Adjust the path if necessary
import RoleLandingPage from "./components/ui/RoleLandingPage"; // Adjust the path if necessary// Import the new page
import ReviewPage from "./components/ui/ReviewPage";
import ExplorePage from "./components/ui/ExplorePage";
import DashboardPage from "./components/ui/DashboardPage"; // Import the new page
import MyReviewPage from "./components/ui/MyReviewPage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBA8TiWaLNnKczR5ar9rFNyXdrjOWynbU4",
  authDomain: "tenofs-8d87a.firebaseapp.com",
  projectId: "tenofs-8d87a",
  storageBucket: "tenofs-8d87a.firebasestorage.app",
  messagingSenderId: "836403816561",
  appId: "1:836403816561:web:d79389cea9c91cd7cb13d0",
  measurementId: "G-3FBN8KJHWX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { db };


function RoleSelectionPage() {
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    console.log("Selected Role:", role); // Debugging
    setRole(role); // Set the role in context
    navigate("/role-landing"); // Redirect to the RoleLandingPage
  };

  return (
    <section className="page role-selection-page">
      <h2>Select Your Role</h2>
      <p>Are you a tenant or an owner?</p>
      <div>
        <button className="primary" onClick={() => handleRoleSelection("tenant")}>
          Tenant
        </button>
        <button className="primary" onClick={() => handleRoleSelection("owner")}>
          Owner
        </button>
      </div>
    </section>
  );
}


// Create Role Context
const RoleContext = createContext();

// RoleProvider Component
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null); // Role can be "tenant" or "owner"

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom Hook to Use Role Context
export const useRole = () => useContext(RoleContext);

function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true); // Update authentication state
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error); // Log the exact error
  
      // Handle specific Firebase Authentication errors
      switch (error.code) {
        case "auth/user-not-found":
          alert("No user found with this email. Please check your email or sign up.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          alert("The email address is invalid. Please enter a valid email.");
          break;
        case "auth/too-many-requests":
          alert("Too many failed login attempts. Please try again later.");
          break;
        default:
          alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <section className="page login-page">
      <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="email" className="form-label">
          {/* Email */}
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <label htmlFor="password" className="form-label">
          {/* Password */}
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="btn primary">
          Login
        </button>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
      <span>Don't have an account? </span>
      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="btn"
        style={{ padding: "6px 18px", fontSize: "1rem", display: "inline-block" }}
      >
        Sign Up
      </button>
        </div>
      </form>
    </section>
  );
}

function SignupPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const { role } = useRole(); // Get the selected role from context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
  
    // Validation logic
    if (!formData.name || !formData.email || !formData.phone || !formData.pan || !formData.password) {
      alert("All fields are mandatory");
      return;
    }
  
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      // Save user details and role to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pan: formData.pan,
        role: role, // Save the selected role (tenant or owner)
      });
  
      // Set authentication state and redirect to dashboard
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please use a different email.");
      } else if (error.code === "auth/weak-password") {
        alert("The password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        alert("The email address is invalid. Please enter a valid email.");
      } else if (error.message.includes("PERMISSION_DENIED")) {
        alert("You do not have permission to perform this action. Please check your Firestore rules.");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <section className="page signup-page">
      <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <label htmlFor="name" className="form-label">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="input-field"
        />
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="input-field"
        />
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <input
          id="phone"
          type="text"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="input-field"
        />
        <label htmlFor="pan" className="form-label">
          PAN ID
        </label>
        <input
          id="pan"
          type="text"
          placeholder="Enter your PAN ID"
          value={formData.pan}
          onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
          required
          className="input-field"
        />
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="input-field"
        />
        <button type="submit" className="btn primary">
          Sign Up
        </button>
      </form>
    </section>
  );
}

// function TryPage() {
//   return (
//     <section className="page try-page">
//       <h2>Try Without Signup</h2>
//       <p>Explore the features</p>
//       <div>
//         <Link to="/review">
//           <button className="primary">Give a Review</button>
//         </Link>
//         <Link to="/explore">
//           <button className="primary">See Reviews</button>
//         </Link>
//       </div>
//     </section>
//   );
// }

// function ReviewPage() {
//   const [review, setReview] = useState("");
//   const [address, setAddress] = useState("");
//   const [owner, setOwner] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Submit review logic here
//     alert("Review submitted!");
//   };

//   return (
//     <section className="page review-page">
//       <h2 className="text-center text-2xl font-bold mb-6">Give Review</h2>
//       <form onSubmit={handleSubmit} className="login-form">
//         <label className="form-label" htmlFor="address">Flat Address</label>
//         <input
//           id="address"
//           className="input-field"
//           type="text"
//           value={address}
//           onChange={e => setAddress(e.target.value)}
//           required
//         />
//         <label className="form-label" htmlFor="owner">Owner Name</label>
//         <input
//           id="owner"
//           className="input-field"
//           type="text"
//           value={owner}
//           onChange={e => setOwner(e.target.value)}
//           required
//         />
//         <label className="form-label" htmlFor="review">Review</label>
//         <textarea
//           id="review"
//           className="input-field"
//           value={review}
//           onChange={e => setReview(e.target.value)}
//           required
//         />
//         <button type="submit" className="btn primary">Submit Review</button>
//       </form>
//     </section>
//   );
// }

function TenantReviewsPage() {
  const { role } = useRole();

  if (role !== "tenant") {
    return <p>Access denied. Only tenants can view this page.</p>;
  }

  // Fetch and display reviews about owners
  return <div>Tenant Reviews Page</div>;
}

function OwnerReviewsPage() {
  const { role } = useRole();

  if (role !== "owner") {
    return <p>Access denied. Only owners can view this page.</p>;
  }

  // Fetch and display reviews about tenants
  return <div>Owner Reviews Page</div>;
}

// function ExplorePage() {
//   const [search, setSearch] = useState("");

//   // Dummy reviews for illustration
//   const reviews = [
//     { address: "123 Main St", owner: "John Doe", review: "Great experience!" },
//     { address: "456 Park Ave", owner: "Jane Smith", review: "Very helpful owner." }
//   ];

//   const filtered = reviews.filter(
//     r =>
//       r.address.toLowerCase().includes(search.toLowerCase()) ||
//       r.owner.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <section className="page login-page">
//       <h2 className="text-center text-2xl font-bold mb-6">View Reviews</h2>
//       <form className="login-form" onSubmit={e => e.preventDefault()}>
//         <input
//           className="input-field"
//           type="text"
//           placeholder="Search by address or owner"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />
//       </form>
//       <div className="review-list" style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
//         {filtered.length === 0 && <p>No reviews found.</p>}
//         {filtered.map((r, i) => (
//           <div key={i} className="card" style={{ marginBottom: 16 }}>
//             <strong>{r.address}</strong>
//             <div>Owner: {r.owner}</div>
//             <div>{r.review}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


// function DashboardPage() {
//   const navigate = useNavigate();
//   return (
//     <section className="dashboard-page">
//       <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
//       <button className="btn" onClick={() => navigate("/review")}>
//         Give Review
//       </button>
//       <button className="btn" onClick={() => navigate("/explore")}>
//         View Reviews
//       </button>
//     </section>
//   );
// }

function FlatReviewsPage({ flatId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), where("flatId", "==", flatId));
        const querySnapshot = await getDocs(q);
        const allReviews = [];
        querySnapshot.forEach((doc) => allReviews.push(doc.data()));
        setReviews(allReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [flatId]);

  return (
    <section className="review-page">
      <h2 className="text-3xl font-bold mb-6">Reviews for Flat</h2>
      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review, idx) => (
            <div key={idx} className="card p-4 border rounded shadow mb-4">
              <p className="font-bold">{review.address}</p>
              <p>{review.review}</p>
              {review.proof && <p className="text-sm text-gray-500">Proof: {review.proof}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No reviews available for this flat.</p>
      )}
    </section>
  );
}


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Define authentication state

  return (
    <RoleProvider>
      <div className="app-container">
        <Router>
        <Header /> {/* Fixed header at the top */}
          <div className="main-content">
            <Layout>
              <Routes>
                <Route path="/" element={<RoleSelectionPage />} />
                <Route path="/role-landing" element={<RoleLandingPage />} />
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/try-it-first" element={<TryItFirstPage />} />
                <Route
                  path="/dashboard"
                  element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
                />
                <Route path="/my-reviews" element={<MyReviewPage />} />
                <Route path="/reviews/:flatId" element={<FlatReviewsPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/tenant-reviews" element={<TenantReviewsPage />} />
                <Route path="/owner-reviews" element={<OwnerReviewsPage />} />
                <Route path="/tenant" element={<LandingPage />} />
                <Route path="/owner" element={<LandingPage />} />
              </Routes>
            </Layout>
          </div>
          <Footer /> {/* Footer always at the bottom */}
        </Router>
      </div>
    </RoleProvider>
  );
}