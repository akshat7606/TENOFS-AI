function RoleSelectionPage() {
  const { setRole } = useRole(); // Access the Role Context
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setRole(role); // Set the role in context
    navigate("/login"); // Redirect to the login page
  };

  return (
    <section className="page role-selection-page flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Select Your Role</h2>
      <p className="text-lg mb-8">Are you a tenant or an owner?</p>
      <div className="flex flex-col space-y-4 w-full max-w-sm">
        <button
          className="btn primary w-full"
          onClick={() => handleRoleSelection("tenant")}
        >
          Tenant
        </button>
        <button
          className="btn secondary w-full"
          onClick={() => handleRoleSelection("owner")}
        >
          Owner
        </button>
      </div>
    </section>
  );
}