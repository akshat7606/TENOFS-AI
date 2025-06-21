import React from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../App";

function TryItFirstPage() {
  const { role } = useRole();
  const navigate = useNavigate();

  return (
    <section className="page try-page">
      <h2>Try Without Signup</h2>
      <p>Explore the features as a {role}</p>
      <div>
        {role === "tenant" && (
          <>
            <button
              className="btn"
              onClick={() => navigate("/login")}
            >
              Give a Review for Owner / Flat
            </button>
            <button
              className="btn"
              onClick={() => navigate("/owner-reviews")}
            >
              See Reviews of Owners / Flat
            </button>
          </>
        )}
        {role === "owner" && (
          <>
            <button
              className="btn"
              onClick={() => navigate("/login")}
            >
              Give a Review for Tenant
            </button>
            <button
              className="btn"
              onClick={() => navigate("/tenant-reviews")}
            >
              See Reviews of Tenants
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default TryItFirstPage;