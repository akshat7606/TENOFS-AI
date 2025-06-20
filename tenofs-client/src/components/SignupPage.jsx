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