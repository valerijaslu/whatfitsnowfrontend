import { Link } from "react-router-dom";

export function ActivitiesListPage() {
  return (
    <div className="card">
      <div className="stack">
        <div className="row rowSpaceBetween">
          <h2 className="pageTitle">Activities</h2>
          <Link className="btn" to="/activities/new">
            Create activity
          </Link>
        </div>
        <div className="muted">List wiring will be added next (API + table).</div>
      </div>
    </div>
  );
}

