import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentSession, isCurrentUserAdmin, signInWithEmail, signOut } from "@/lib/admin-service";

const AdminLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: alreadyAdminChecked, isLoading } = useQuery({
    queryKey: ["admin-login-check"],
    queryFn: async () => {
      const session = await getCurrentSession();

      if (!session) return false;
      return isCurrentUserAdmin();
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      await signInWithEmail(email.trim(), password);
      const isAdmin = await isCurrentUserAdmin();

      if (!isAdmin) {
        await signOut();
        setErrorMsg("Ce compte n'a pas les droits administrateur.");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-auth-check"] });
      navigate("/admin/products");
    } catch {
      setErrorMsg("Connexion impossible. Vérifiez votre email et mot de passe.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoading && alreadyAdminChecked) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Espace Admin</h1>
        <p className="text-muted-foreground mb-6">Connectez-vous pour gérer les produits.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
