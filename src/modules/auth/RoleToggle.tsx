type Role = "buyer" | "seller";

interface RoleToggleProps {
  role: Role;
  onChange: (role: Role) => void;
}

const RoleToggle = ({ role, onChange }: RoleToggleProps) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
      <button
        type="button"
        onClick={() => onChange("buyer")}
        className={`px-6 py-2 rounded-md text-sm font-medium transition ${
          role === "buyer"
            ? "bg-indigo-600 text-white"
            : "text-gray-600 hover:text-black"
        }`}
      >
        Buyer
      </button>

      <button
        type="button"
        onClick={() => onChange("seller")}
        className={`px-6 py-2 rounded-md text-sm font-medium transition ${
          role === "seller"
            ? "bg-indigo-600 text-white"
            : "text-gray-600 hover:text-black"
        }`}
      >
        Seller
      </button>
    </div>
  );
};

export default RoleToggle;
