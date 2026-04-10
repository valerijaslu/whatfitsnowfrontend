import { useEffect, useId, useRef } from "react";
import "@/ui/common/confirmDialog.css";
import "@/ui/common/buttons.css";
import "@/ui/common/typography.css";

type Props = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
  isConfirming = false,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    confirmRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="dialogOverlay" role="presentation" onMouseDown={onCancel}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="dialogBody">
          <div className="dialogTitle" id={titleId}>
            {title}
          </div>
          {description ? (
            <div className="muted" id={descId}>
              {description}
            </div>
          ) : null}
        </div>

        <div className="dialogActions">
          <button className="btn" type="button" onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={isDanger ? "btn primary dangerBtn" : "btn primary"}
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

