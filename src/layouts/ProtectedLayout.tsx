import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import "@/layouts/layout.css";
import "@/ui/common/buttons.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";

export function ProtectedLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="container">
      <div className="nav">
        <div className="navlinks">
          <NavLink to="/activities">Activities</NavLink>
          <NavLink to="/activities/new">Create</NavLink>
          <NavLink to="/suggest">Suggest</NavLink>
        </div>
        <div className="row">
          <span className="muted">{user?.email ?? ""}</span>
          <button className="btn" onClick={logout} type="button">
            Log out
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}

