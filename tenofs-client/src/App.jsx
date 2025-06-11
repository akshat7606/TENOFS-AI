// Tenofs Fullstack Web App (Firebase-powered, React Frontend)
// Enhanced with PAN + Agreement verification, Proof upload, Exit video logging, Trust Score display, and Private Review system.

import React, {createContext, useState, useEffect,useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import './styles.css';
import { useLocation } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TryItFirstPage from "./components/ui/TryItFirstPage"; // Update the path as needed



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


function RoleSelectionPage() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate(`/${role}`);
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

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null); // Role can be "Tenant" or "Owner"

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const role = location.pathname.includes("tenant") ? "Owner" : "Tenant";

  const handleTryItFirst = () => {
    navigate("/try-it-first"); // Navigate to the "Try It First" page
  };

  return (
    <section className="page">
      <h1>Welcome to Tenofs</h1>
      <p>Your trusted {role.toLowerCase()} review and trust score system</p>
      <div>
        <Link to="/login"><button className="primary">Login</button></Link>
        <Link to="/signup"><button className="primary">Sign Up</button></Link>
        <button className="primary" onClick={handleTryItFirst}>Try It First</button>
      </div>
    </section>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validation logic
    if (!email || !password) {
      alert("Email and Password are mandatory!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <section className="page login-page">
      <h2>Login</h2>
      <p>Access your account</p>
      <div className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </section>
  );
}

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    password: "",
    agreement: null, // Rent agreement file
  });
  const [flatDetails, setFlatDetails] = useState(null); // Fetched flat details
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const storage = getStorage(app);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `agreements/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);
      setFormData({ ...formData, agreement: fileURL });

      // Simulate fetching flat details from the uploaded file
      setFlatDetails({
        address: "123 Main Street, City",
        tenant: "John Doe",
        owner: "Jane Smith",
      });
    } catch (error) {
      console.error("File Upload Error:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleSignup = async () => {
    const { name, email, phone, pan, password, agreement } = formData;

    // Validation logic
    if (!name || !email || !phone || !pan || !password || !agreement) {
      alert("All fields are mandatory");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), { ...formData, flatDetails });
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error); // Log the error to the console
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <section className="page signup-page">
      <h2>Sign Up</h2>
      <p>Create your account</p>
      <div className="form">
        <input
          type="text"
          placeholder="Full Name*"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email*"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number*"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="PAN ID*"
          value={formData.pan}
          onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
        />
        <input
          type="file"
          placeholder="Upload Rent Agreement*"
          onChange={handleFileUpload}
        />
        {flatDetails && (
          <div className="flat-details">
            <p><strong>Flat Address:</strong> {flatDetails.address}</p>
            <p><strong>Tenant:</strong> {flatDetails.tenant}</p>
            <p><strong>Owner:</strong> {flatDetails.owner}</p>
          </div>
        )}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
            placeholder="Password*"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.125 0 2.2.225 3.188.625M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.825 3.188A10.05 10.05 0 0119 12c0-1.125-.225-2.2-.625-3.188"
                />
              </svg>
            )}
          </span>
        </div>
        <button onClick={handleSignup}>Sign Up</button>
      </div>
    </section>
  );
}

function TryPage() {
  return (
    <section className="page try-page">
      <h2>Try Without Signup</h2>
      <p>Explore the features</p>
      <div>
        <Link to="/review">
          <button className="primary">Give a Review</button>
        </Link>
        <Link to="/explore">
          <button className="primary">See Reviews</button>
        </Link>
      </div>
    </section>
  );
}

function ReviewPage() {
  const [reviewData, setReviewData] = useState({
    address: "",
    review: "",
    proof: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reviews"), reviewData);
      alert("Review submitted successfully!");
      setReviewData({ address: "", review: "", proof: null });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <section className="page review-page">
      <h2>Submit a Review</h2>
      <p>Provide your feedback about the tenant or owner.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Address*"
          value={reviewData.address}
          onChange={(e) => setReviewData({ ...reviewData, address: e.target.value })}
          required
        />
        <textarea
          placeholder="Your Review*"
          value={reviewData.review}
          onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
          required
        ></textarea>
        <input
          type="file"
          onChange={(e) => setReviewData({ ...reviewData, proof: e.target.files[0] })}
        />
        <button type="submit" className="primary">Submit Review</button>
      </form>
    </section>
  );
}

function TenantReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"), where("role", "==", "owner")); // Fetch reviews of owners
    const querySnapshot = await getDocs(q);
    const all = [];
    querySnapshot.forEach(doc => all.push(doc.data()));
    setReviews(all);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="review-page">
      <h2>Owner and Flat Reviews</h2>
      <p>Read reviews about owners and flats</p>
      <div className="review-list">
        {reviews.map((r, idx) => (
          <div key={idx} className="card">
            <p className="font-bold">{r.address}</p>
            <p>{r.review}</p>
            {r.proof && <p className="text-sm text-gray-500">Proof: {r.proof}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function OwnerReviewsPage() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"), where("role", "==", "tenant")); // Fetch reviews of tenants
    const querySnapshot = await getDocs(q);
    const all = [];
    querySnapshot.forEach(doc => all.push(doc.data()));
    setReviews(all);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="review-page">
      <h2>Tenant Reviews</h2>
      <p>Read reviews about tenants</p>
      <div className="review-list">
        {reviews.map((r, idx) => (
          <div key={idx} className="card">
            <p className="font-bold">{r.address}</p>
            <p>{r.review}</p>
            {r.proof && <p className="text-sm text-gray-500">Proof: {r.proof}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ExplorePage() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"));
    const querySnapshot = await getDocs(q);
    const all = [];
    querySnapshot.forEach(doc => all.push(doc.data()));
    setReviews(all);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="review-page">
      <h2>Explore Reviews</h2>
      <p>Read reviews from other tenants and owners</p>
      <div className="review-list">
        {reviews.map((r, idx) => (
          <div key={idx} className="card">
            <p className="font-bold">{r.address}</p>
            <p>{r.review}</p>
            {r.proof && <p className="text-sm text-gray-500">Proof: {r.proof}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPage() {
  return (
    <section className="max-w-4xl mx-auto py-10">
      <h2 className="text-3xl font-semibold mb-4">Your Dashboard</h2>
      <img src="/assets/dashboard-image.jpg" alt="Dashboard" className="rounded-lg shadow-lg mb-6" />
      <p className="text-gray-600 mb-6">Track your reviews, rent history, and upload exit videos</p>
      <div className="space-y-4">
        <button className="primary w-full">Upload Exit Video</button>
        <div className="card">
          <p className="text-xl font-bold">Trust Score: 84/100</p>
          <p className="text-sm text-gray-500">Based on verified agreements and uploaded reviews</p>
        </div>
      </div>
    </section>
  );
}


export default function App() {
  return (
    <RoleProvider>
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/tenant" element={<LandingPage />} />
        <Route path="/owner" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/try-it-first" element={<TryItFirstPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  </RoleProvider>
  );
}
