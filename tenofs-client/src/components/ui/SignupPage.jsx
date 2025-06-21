import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../App";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../App";

function SignupPage({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const auth = getAuth();
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
          {/* <label htmlFor="name" className="form-label">
            Full Name
          </label> */}
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="input-field"
          />
          {/* <label htmlFor="email" className="form-label">
            Email
          </label> */}
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="input-field"
          />
          {/* <label htmlFor="phone" className="form-label">
            Phone Number
          </label> */}
          <input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="input-field"
          />
          {/* <label htmlFor="pan" className="form-label">
            PAN ID
          </label> */}
          <input
            id="pan"
            type="text"
            placeholder="Enter your PAN ID"
            value={formData.pan}
            onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
            required
            className="input-field"
          />
          {/* <label htmlFor="password" className="form-label">
            Password
          </label> */}
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
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ marginRight: "8px" }}>Already have an account?</span>
          <button
            type="button"
            className="btn"
            style={{ maxWidth: 120, padding: "8px 18px" }}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
        </form>
      </section>
    );
  }
  
// function SignupPage({ setIsAuthenticated }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = (e) => {
//     e.preventDefault();
//     // Signup logic here
//     setIsAuthenticated(true);
//     navigate("/dashboard");
//   };

//   return (
//     <section className="page signup-page">
//       <h2>Sign Up</h2>
//       <form className="signup-form" onSubmit={handleSignup}>
//         <input
//           className="input-field"
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//         />
//         <input
//           className="input-field"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//         />
//         <button className="btn" type="submit">
//           Sign Up
//         </button>
//       </form>
//       <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
//         <button
//           type="button"
//           className="btn"
//           style={{ width: "90%", maxWidth: 240 }}
//           onClick={() => navigate("/login")}
//         >
//           Already have an account? Login
//         </button>
//       </div>
//     </section>
//   );
// }

export default SignupPage;