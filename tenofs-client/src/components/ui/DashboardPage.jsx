import React from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../App";

function DashboardPage() {
  const navigate = useNavigate();
  const { role } = useRole();

  return (
    <section className="dashboard-page">
      <h2 className="text-2xl font-bold mb-6" style={{ textAlign: "center", marginTop: 0 }}>
        Dashboard
      </h2>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
        <button className="btn" onClick={() => navigate("/review")}>
          Give Review
        </button>
        <button className="btn" onClick={() => navigate("/explore")}>
          View Reviews
        </button>
        <button className="btn" onClick={() => navigate("/my-reviews")}>
          My Reviews & Ratings
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <p>
          {role === "owner"
            ? "As an owner, you can see your flat and owner ratings and reviews."
            : "As a tenant, you can see your ratings and reviews."}
        </p>
      </div>
    </section>
  );
}

export default DashboardPage;