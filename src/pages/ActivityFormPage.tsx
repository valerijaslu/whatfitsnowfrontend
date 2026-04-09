import { useParams } from "react-router-dom";

export function ActivityFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();

  return (
    <div className="card">
      <div className="stack">
        <h2 className="pageTitle">{mode === "create" ? "Create activity" : "Edit activity"}</h2>
        {mode === "edit" ? <div className="muted">Editing activity id: {id}</div> : null}
        <div className="muted">Form wiring will be added next (API + validation).</div>
      </div>
    </div>
  );
}

