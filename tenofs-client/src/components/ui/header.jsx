import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="header" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
      <img
        src="/landing-image.jpg"
        alt="Tenofs Logo"
        style={{ height: "36px", width: "36px", objectFit: "cover", borderRadius: "6px" }}
      />
      <span
        style={{
          fontWeight: 800,
          fontSize: "1.5rem",
          color: "#222",
          fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
          cursor: "pointer"
        }}
        onClick={() => navigate("/")}
        tabIndex={0}
        role="button"
        aria-label="Go to landing page"
      >
        TENOFS
      </span>
    </header>
  );
}