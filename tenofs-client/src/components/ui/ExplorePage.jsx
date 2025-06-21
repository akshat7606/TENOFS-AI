import React, { useState } from "react";

function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("address");

  // Dummy reviews for illustration; replace with your fetched data
  const reviews = [
    // { address: "123 Main St", owner: "John Doe", review: "Great experience!", rating: 5 },
    // { address: "456 Park Ave", owner: "Jane Smith", review: "Very helpful owner.", rating: 4 }
  ];

  const filteredReviews = reviews.filter((review) => {
    if (filter === "address") {
      return review.address.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (filter === "owner") {
      return review.owner.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });

  return (
    <section className="page explore-page" style={{ paddingTop: 40 }}>
      <h2 className="text-center text-2xl font-bold mb-6">View Reviews</h2>
      <form
        className="login-form"
        onSubmit={e => e.preventDefault()}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 16,
          borderRadius: 8,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          margin: "0 auto 24px auto"
        }}
      >
        <input
          className="input-field"
          type="text"
          placeholder={`Search by ${filter}`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ fontSize: "0.95rem", padding: "6px", marginBottom: 8 }}
        />
        <div className="flex space-x-2 my-2" style={{ justifyContent: "center" }}>
          <button
            type="button"
            className={`btn ${filter === "address" ? "primary" : "secondary"}`}
            onClick={() => setFilter("address")}
            style={{ fontSize: "0.95rem" }}
          >
            Address
          </button>
          <button
            type="button"
            className={`btn ${filter === "owner" ? "primary" : "secondary"}`}
            onClick={() => setFilter("owner")}
            style={{ fontSize: "0.95rem" }}
          >
            Owner
          </button>
        </div>
      </form>
      <div className="review-list" style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
        {filteredReviews.length === 0 && <p>No reviews found.</p>}
        {filteredReviews.map((r, i) => (
          <div key={i} className="card" style={{ marginBottom: 16 }}>
            <strong>{r.address}</strong>
            <div>Owner: {r.owner}</div>
            <div>Review: {r.review}</div>
            <div>Rating: {r.rating}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExplorePage;