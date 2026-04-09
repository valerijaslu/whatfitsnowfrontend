import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

export function ProtectedLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="container">
      <div className="nav">
        <div className="navlinks">
          <NavLink to="/">Dashboard</NavLink>
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

