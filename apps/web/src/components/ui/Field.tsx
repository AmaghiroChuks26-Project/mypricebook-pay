import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
}

export function Field({ error, hint, label, leadingIcon, ...inputProps }: FieldProps) {
  const generatedId = useId();
  const inputId = inputProps.id ?? generatedId;
  const describedBy = [hint && `${inputId}-hint`, error && `${inputId}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className={`field__control ${leadingIcon ? "field__control--icon" : ""}`}>
        {leadingIcon && <span className="field__icon" aria-hidden="true">{leadingIcon}</span>}
        <input
          className="input"
          id={inputId}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...inputProps}
        />
      </div>
      {hint && <p className="field__hint" id={`${inputId}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${inputId}-error`}>{error}</p>}
    </div>
  );
}