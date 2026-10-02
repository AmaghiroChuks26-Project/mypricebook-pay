import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [feedback, setFeedback] = useState("");
  const location = useLocation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("Account access is not connected in this demo yet.");
  }

  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link className="brand brand--auth" to="/" aria-label="MyPriceBook Pay home">
          <span className="brand__mark"><span>+</span></span>
          <span className="brand__wordmark">MyPriceBook <span>Pay</span></span>
        </Link>
        <div className="auth-aside__message">
          <span className="auth-aside__symbol"><LockKeyhole size={24} aria-hidden="true" /></span>
          <p className="eyebrow">YOUR SHOP, IN SYNC</p>
          <h1>Every sale has a story.<br /><span>Keep it together.</span></h1>
          <p>Payments, inventory and receipts, connected in one clear workspace.</p>
        </div>
        <div className="auth-aside__footer"><ShieldCheck size={16} aria-hidden="true" /> Demo experience · no real account is created</div>
      </section>

      <section className="auth-main">
        <Link className="auth-back" to="/"><ArrowLeft size={16} aria-hidden="true" /> Back to home</Link>
        <div className="auth-form-wrap">
          <span className="demo-pill">DEMO FOUNDATION</span>
          <h2>{isRegister ? "Set up your shop" : "Welcome back"}</h2>
          <p className="auth-form__intro">{isRegister ? "Create a workspace for your pharmacy or shop." : "Sign in to continue to your workspace."}</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && <Field label="Your name" name="name" autoComplete="name" placeholder="e.g. Ada Okafor" required />}
            {isRegister && <Field label="Shop name" name="shop" autoComplete="organization" placeholder="e.g. Greenfield Pharmacy" required />}
            <Field
              label="Email or phone number"
              name="identifier"
              type="text"
              autoComplete="username"
              inputMode="email"
              placeholder="you@example.com or 080..."
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
              minLength={isRegister ? 8 : undefined}
              required
            />
            {!isRegister && <button className="auth-forgot" type="button" onClick={() => setFeedback("Password recovery will be available when accounts are connected.")}>Forgot password?</button>}
            <Button className="auth-submit" type="submit" size="lg" trailingIcon={<ArrowRight size={17} aria-hidden="true" />}>
              {isRegister ? "Create demo account" : "Log in"}
            </Button>
            <p className="auth-demo-note" role="note">This is a UI preview. Form submissions do not create an account.</p>
            {feedback && <p className="form-feedback" role="status">{feedback}</p>}
          </form>
          <p className="auth-switch">
            {isRegister ? "Already have a workspace?" : "New to MyPriceBook Pay?"}{" "}
            <Link to={isRegister ? "/login" : "/register"} state={{ from: location.pathname }}>{isRegister ? "Log in" : "Create an account"}</Link>
          </p>
        </div>
        <span className="auth-legal">By continuing, you agree to use this demo with fictional information only.</span>
      </section>
    </main>
  );
}