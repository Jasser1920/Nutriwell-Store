import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  ContactReportStatus,
  fetchAdminContactReportById,
  fetchAdminContactReports,
  getContactAttachmentSignedUrl,
  updateContactReportStatus,
} from "@/lib/contact-service";
import { signOut } from "@/lib/admin-service";

const formatDate = (dateIso: string) => {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel: Record<ContactReportStatus, string> = {
  nouveau: "Nouveau",
  traite: "Traite",
  archive: "Archive",
};

const AdminContactReports = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: reports = [], isLoading, isError } = useQuery({
    queryKey: ["admin-contact-reports"],
    queryFn: fetchAdminContactReports,
  });

  const { data: selectedReport } = useQuery({
    queryKey: ["admin-contact-report", selectedId],
    queryFn: () => fetchAdminContactReportById(selectedId as string),
    enabled: Boolean(selectedId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactReportStatus }) =>
      updateContactReportStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-contact-reports"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-contact-report"] });
    },
  });

  const openAttachmentMutation = useMutation({
    mutationFn: (path: string) => getContactAttachmentSignedUrl(path),
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;

    return reports.filter((report) => {
      return (
        report.subject.toLowerCase().includes(q) ||
        report.email.toLowerCase().includes(q) ||
        report.last_name.toLowerCase().includes(q) ||
        report.first_name.toLowerCase().includes(q)
      );
    });
  }, [reports, search]);

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Rapports Contact</h1>
            <p className="text-muted-foreground">Consultez et traitez les messages clients.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Produits
            </Link>
            <Link
              to="/admin/recipes"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Recettes
            </Link>
            <Link
              to="/admin/content"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Contenu pages
            </Link>
            <button
              onClick={onLogout}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Deconnexion
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-border bg-card p-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par sujet, email, nom"
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="max-h-[560px] overflow-y-auto">
              {isLoading && <p className="p-4 text-sm text-muted-foreground">Chargement des rapports...</p>}
              {isError && <p className="p-4 text-sm text-destructive">Erreur de chargement.</p>}

              {!isLoading && !isError && filtered.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">Aucun rapport trouve.</p>
              )}

              <div className="space-y-2">
                {filtered.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedId(report.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedId === report.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{report.subject}</p>
                      <span className="text-xs text-muted-foreground">{statusLabel[report.status]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {report.first_name} {report.last_name} - {report.email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(report.created_at)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            {!selectedReport && (
              <p className="text-sm text-muted-foreground">Selectionnez un rapport pour voir le detail.</p>
            )}

            {selectedReport && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold text-foreground">{selectedReport.subject}</h2>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedReport.created_at)}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.civility ? `${selectedReport.civility} ` : ""}
                    {selectedReport.first_name} {selectedReport.last_name} - {selectedReport.email}
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{selectedReport.message}</p>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground">
                  {selectedReport.profile_type && <p>Profil: {selectedReport.profile_type}</p>}
                  {selectedReport.phone_number && (
                    <p>
                      Telephone: {selectedReport.phone_prefix ?? ""} {selectedReport.phone_number}
                    </p>
                  )}
                  {(selectedReport.address || selectedReport.postal_code || selectedReport.city || selectedReport.country) && (
                    <p>
                      Adresse: {selectedReport.address ?? ""} {selectedReport.postal_code ?? ""} {selectedReport.city ?? ""} {selectedReport.country ?? ""}
                    </p>
                  )}
                  {selectedReport.attachment_url && (
                    <button
                      onClick={() => openAttachmentMutation.mutate(selectedReport.attachment_url as string)}
                      className="text-left font-semibold text-primary hover:underline"
                    >
                      {openAttachmentMutation.isPending ? "Ouverture..." : "Ouvrir la piece jointe"}
                    </button>
                  )}
                </div>

                <div className="pt-2">
                  <label className="mb-1 block text-sm font-medium text-foreground">Statut</label>
                  <select
                    value={selectedReport.status}
                    onChange={(e) =>
                      statusMutation.mutate({
                        id: selectedReport.id,
                        status: e.target.value as ContactReportStatus,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="traite">Traite</option>
                    <option value="archive">Archive</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactReports;
