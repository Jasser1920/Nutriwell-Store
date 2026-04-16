import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSession, isCurrentUserAdmin } from "@/lib/admin-service";

const AdminProtectedRoute = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-auth-check"],
    queryFn: async () => {
      const session = await getCurrentSession();
      if (!session) {
        return { hasSession: false, isAdmin: false };
      }

      const admin = await isCurrentUserAdmin();
      return { hasSession: true, isAdmin: admin };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vérification de l'accès administrateur...</p>
      </div>
    );
  }

  if (isError || !data?.hasSession) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!data.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
