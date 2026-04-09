import { Link } from "react-router-dom";
import "@/layouts/layout.css";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";

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

