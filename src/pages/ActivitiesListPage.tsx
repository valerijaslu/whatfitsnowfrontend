import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@/layouts/layout.css";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";
import "@/pages/activities/activitiesList.css";
import { deleteActivity, listActivities, type ActivityDto } from "@/api/activities";

function formatDuration(minMinutes: number, maxMinutes: number) {
  if (minMinutes === maxMinutes) return `${minMinutes}m`;
  return `${minMinutes}–${maxMinutes}m`;
}

export function ActivitiesListPage() {
  const [rows, setRows] = useState<ActivityDto[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sorted = useMemo(() => {
    if (!rows) return null;
    return [...rows].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  }, [rows]);

  async function refresh() {
    setError(null);
    setIsLoading(true);
    try {
      const data = await listActivities();
      setRows(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as any)?.message ||
          err.response?.statusText ||
          err.message ||
          "Failed to load activities.";
        setError(String(msg));
      } else {
        setError(err instanceof Error ? err.message : "Failed to load activities.");
      }
      setRows(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onDelete(id: number) {
    const ok = window.confirm("Delete this activity?");
    if (!ok) return;

    setDeletingId(id);
    setError(null);
    try {
      await deleteActivity(id);
      await refresh();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as any)?.message || err.message || "Delete failed."
        : err instanceof Error
          ? err.message
          : "Delete failed.";
      setError(String(msg));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="card">
      <div className="stack">
        <div className="row rowSpaceBetween">
          <h2 className="pageTitle">Activities</h2>
          <Link className="btn" to="/activities/new">
            Create activity
          </Link>
        </div>

        {error ? <div className="error">{error}</div> : null}

        {isLoading ? <div className="muted">Loading…</div> : null}

        {!isLoading && sorted && sorted.length === 0 ? (
          <div className="muted">No activities yet. Create one to get started.</div>
        ) : null}

        {!isLoading && sorted && sorted.length > 0 ? (
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Title</th>
                  <th className="th">Duration</th>
                  <th className="th">Effort</th>
                  <th className="th">Location</th>
                  <th className="th">Social</th>
                  <th className="th">Active</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.id}>
                    <td className={`td tdTitle`}>{a.title}</td>
                    <td className="td">{formatDuration(a.minDurationMinutes, a.maxDurationMinutes)}</td>
                    <td className="td">
                      <span className="badge">{a.effortLevel}</span>
                    </td>
                    <td className="td">{a.locationType}</td>
                    <td className="td">{a.socialType}</td>
                    <td className="td">{a.isActive ? "Yes" : "No"}</td>
                    <td className="td">
                      <div className="actionsCell">
                        <Link className="btn linkBtn" to={`/activities/${a.id}/edit`}>
                          Edit
                        </Link>
                        <button
                          className="btn"
                          type="button"
                          onClick={() => onDelete(a.id)}
                          disabled={deletingId === a.id}
                        >
                          {deletingId === a.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

