import React from "react";
import { Link } from "react-router-dom";
import { useRole } from "../../App";

function TryItFirstPage() {
  const { role } = useRole();

  return (
    <section className="page try-page">
      <h2>Try Without Signup</h2>
      <p>Explore the features as a {role}</p>
      <div>
        {role === "Tenant" ? (
          <>
            <Link to="/review">
              <button className="primary">Give a Review for Owner</button>
            </Link>
            <Link to="/explore">
              <button className="primary">See Reviews of Owners</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/review">
              <button className="primary">Give a Review for Tenant</button>
            </Link>
            <Link to="/explore">
              <button className="primary">See Reviews of Tenants</button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

export default TryItFirstPage;