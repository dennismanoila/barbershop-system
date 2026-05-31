import { Navigate } from "react-router-dom";

type Props = { children: React.ReactNode };

function getRole(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.role as string;
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }: Props) {
  const role = getRole();

  if (!role) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  return <>{children}</>;
}
