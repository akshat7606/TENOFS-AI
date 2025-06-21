import React, { useRef, useState } from "react";

function ReviewPage() {
  const [tenantName, setTenantName] = useState("");
  const [tenantAadhar, setTenantAadhar] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerAadhar, setOwnerAadhar] = useState("");
  const [flatAddress, setFlatAddress] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAgreementUpload = (e) => {
    setOcrLoading(true);
    setTimeout(() => setOcrLoading(false), 1500); // Simulate loading
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Review submitted!");
  };

  // Star rating component
  const StarRating = ({ rating, setRating }) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            color: star <= rating ? "#f5c518" : "#ccc",
            transition: "color 0.2s"
          }}
          onClick={() => setRating(star)}
          onMouseOver={() => setRating(star)}
          onMouseLeave={() => setRating(rating)}
          role="button"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <section className="page review-page" style={{ paddingTop: 40 }}>
      <h2 className="text-center text-xl font-bold mb-4">Give Review</h2>
      <div style={{ marginBottom: 16, width: "100%", maxWidth: 350 }}>
        <label className="form-label" htmlFor="agreement" style={{ fontSize: "0.95rem" }}>
          Upload Rent Agreement (Image or PDF)
        </label>
        <input
          id="agreement"
          type="file"
          accept="image/*,application/pdf"
          ref={fileInputRef}
          onChange={handleAgreementUpload}
          className="input-field"
          style={{ fontSize: "0.95rem", padding: "6px" }}
        />
        {ocrLoading && <p style={{ fontSize: "0.95rem" }}>Extracting details from agreement...</p>}
      </div>
      <form
        onSubmit={handleSubmit}
        className="login-form"
        style={{
          width: "100%",
          maxWidth: 350,
          padding: 16,
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}
      >
        <input
          id="tenantName"
          className="input-field"
          type="text"
          value={tenantName}
          onChange={e => setTenantName(e.target.value)}
          required
          placeholder="Tenant Name"
          style={{ fontSize: "0.95rem", padding: "6px" }}
        />
        <input
          id="tenantAadhar"
          className="input-field"
          type="text"
          value={tenantAadhar}
          onChange={e => setTenantAadhar(e.target.value)}
          required
          placeholder="Tenant Aadhar"
          style={{ fontSize: "0.95rem", padding: "6px" }}
        />
        <input
          id="ownerName"
          className="input-field"
          type="text"
          value={ownerName}
          onChange={e => setOwnerName(e.target.value)}
          required
          placeholder="Owner Name"
          style={{ fontSize: "0.95rem", padding: "6px" }}
        />
        <input
          id="ownerAadhar"
          className="input-field"
          type="text"
          value={ownerAadhar}
          onChange={e => setOwnerAadhar(e.target.value)}
          required
          placeholder="Owner Aadhar"
          style={{ fontSize: "0.95rem", padding: "6px" }}
        />
        <input
          id="flatAddress"
          className="input-field"
          type="text"
          value={flatAddress}
          onChange={e => setFlatAddress(e.target.value)}
          required
          placeholder="Flat Address"
          style={{ fontSize: "0.95rem", padding: "6px" }}
        />
        <textarea
          id="review"
          className="input-field"
          value={review}
          onChange={e => setReview(e.target.value)}
          required
          placeholder="Write your review here"
          style={{ fontSize: "0.95rem", padding: "6px", minHeight: 80, marginBottom: 12 }}
        />
        <label className="form-label" htmlFor="rating" style={{ fontSize: "0.95rem" }}>Rating</label>
        <StarRating rating={rating} setRating={setRating} />
        <button type="submit" className="btn primary" style={{ fontSize: "1rem", padding: "8px 0", marginTop: 8 }}>
          Submit Review
        </button>
      </form>
    </section>
  );
}

export default ReviewPage;