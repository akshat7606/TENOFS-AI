import { useRole } from "../context/RoleContext";

function RoleSelectionPage() {
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setRole(role); // Set the role in context
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <section className="page role-selection-page">
      <h2>Select Your Role</h2>
      <p>Are you a tenant or an owner?</p>
      <div>
        <button className="primary" onClick={() => handleRoleSelection("Tenant")}>
          Tenant
        </button>
        <button className="primary" onClick={() => handleRoleSelection("Owner")}>
          Owner
        </button>
      </div>
    </section>
  );
}