import Link from "next/link";

export function Nav() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div>
          <p className="brand-title">JSO · Code Portfolio Evaluation Agent</p>
          <p className="brand-subtitle">User Dashboard Focus</p>
        </div>
        <Link className="topbar-link" href="/user">
          Open Dashboard
        </Link>
      </div>
    </header>
  );
}
