import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  PharmacyLocation,
  PharmacyLocationInput,
} from "@/lib/location-service";
import { signOut } from "@/lib/admin-service";

const EMPTY_FORM: PharmacyLocationInput = {
  name: "", address: "", city: "", distance: "", lat: 36.8008, lng: 10.18, phone: "",
};

const AdminLocationStore = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<PharmacyLocationInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const pinRef = useRef<L.Marker | null>(null);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: fetchLocations,
  });

  const saveMutation = useMutation({
    mutationFn: (data: { id?: string; input: PharmacyLocationInput }) =>
      data.id ? updateLocation(data.id, data.input) : createLocation(data.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      resetForm();
    },
    onError: (e: any) => setFormError(e?.message ?? "Erreur lors de la sauvegarde."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    movePinTo(EMPTY_FORM.lat, EMPTY_FORM.lng);
  };

  const movePinTo = (lat: number, lng: number) => {
    if (!leafletMapRef.current) return;
    if (pinRef.current) {
      pinRef.current.setLatLng([lat, lng]);
    } else {
      pinRef.current = L.marker([lat, lng], { draggable: true })
        .addTo(leafletMapRef.current)
        .on("dragend", (e) => {
          const { lat: la, lng: ln } = (e.target as L.Marker).getLatLng();
          setForm((f) => ({ ...f, lat: parseFloat(la.toFixed(6)), lng: parseFloat(ln.toFixed(6)) }));
        });
    }
    leafletMapRef.current.setView([lat, lng], leafletMapRef.current.getZoom());
  };

  // Init map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current).setView([EMPTY_FORM.lat, EMPTY_FORM.lng], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    pinRef.current = L.marker([EMPTY_FORM.lat, EMPTY_FORM.lng], { draggable: true })
      .addTo(map)
      .on("dragend", (e) => {
        const { lat, lng } = (e.target as L.Marker).getLatLng();
        setForm((f) => ({ ...f, lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }));
      });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      const la = parseFloat(lat.toFixed(6));
      const ln = parseFloat(lng.toFixed(6));
      pinRef.current?.setLatLng([la, ln]);
      setForm((f) => ({ ...f, lat: la, lng: ln }));
    });

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
      pinRef.current = null;
    };
  }, []);

  const startEdit = (loc: PharmacyLocation) => {
    setEditingId(loc.id);
    setFormError("");
    const input: PharmacyLocationInput = {
      name: loc.name, address: loc.address, city: loc.city,
      distance: loc.distance, lat: loc.lat, lng: loc.lng, phone: loc.phone,
    };
    setForm(input);
    movePinTo(loc.lat, loc.lng);
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.address || !form.city) {
      setFormError("Nom, adresse et ville sont obligatoires.");
      return;
    }
    saveMutation.mutate({ id: editingId ?? undefined, input: form });
  };

  const field = (key: keyof PharmacyLocationInput) => ({
    value: String(form[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: key === "lat" || key === "lng" ? parseFloat(e.target.value) || 0 : e.target.value })),
  });

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Pharmacies partenaires</h1>
            <p className="text-muted-foreground">Gérez les points de vente affichés sur la carte.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/admin/products" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Produits</Link>
            <Link to="/admin/recipes" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Recettes</Link>
            <Link to="/admin/contact-reports" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Rapports contact</Link>
            <Link to="/admin/content" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Contenu pages</Link>
            <button
              onClick={async () => { await signOut(); navigate("/admin/login"); }}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Form + Map */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
            {editingId ? "Modifier la pharmacie" : "Ajouter une pharmacie"}
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form fields */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[
                { label: "Nom *", key: "name" as const, placeholder: "Pharmacie Centrale" },
                { label: "Adresse *", key: "address" as const, placeholder: "1 Avenue Habib Bourguiba" },
                { label: "Ville *", key: "city" as const, placeholder: "Tunis" },
                { label: "Distance (optionnel)", key: "distance" as const, placeholder: "0.3 km" },
                { label: "Téléphone", key: "phone" as const, placeholder: "+216 71 123 456" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
                  <input
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    {...field(key)}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Latitude</label>
                  <input
                    type="number" step="any"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    {...field("lat")}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setForm((f) => ({ ...f, lat: val }));
                      movePinTo(val, form.lng);
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Longitude</label>
                  <input
                    type="number" step="any"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    {...field("lng")}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setForm((f) => ({ ...f, lng: val }));
                      movePinTo(form.lat, val);
                    }}
                  />
                </div>
              </div>
              {formError && <p className="text-sm text-destructive">{formError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {saveMutation.isPending ? "Sauvegarde…" : editingId ? "Mettre à jour" : "Ajouter"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-full border border-border px-6 py-2 text-sm font-semibold text-foreground hover:bg-muted">
                    Annuler
                  </button>
                )}
              </div>
            </form>

            {/* Map */}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Cliquez sur la carte ou faites glisser le marqueur pour définir la position.</p>
              <div ref={mapRef} className="h-80 w-full rounded-lg border border-border" />
            </div>
          </div>
        </div>

        {/* Locations table */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-muted/40">
                <tr>
                  {["Nom", "Adresse", "Ville", "Téléphone", "Lat / Lng", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Chargement…</td></tr>
                )}
                {!isLoading && locations.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Aucune pharmacie enregistrée.</td></tr>
                )}
                {locations.map((loc) => (
                  <tr key={loc.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm text-foreground">{loc.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{loc.address}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{loc.city}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{loc.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(loc)}
                          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => { if (confirm(`Supprimer "${loc.name}" ?`)) deleteMutation.mutate(loc.id); }}
                          disabled={deleteMutation.isPending}
                          className="rounded-full border border-destructive/40 px-4 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLocationStore;
