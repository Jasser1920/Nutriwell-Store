import { useState, useMemo, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, Clock, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchLocations } from "@/lib/location-service";

const StoreLocator = () => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5");
  const [resultsCount, setResultsCount] = useState("10");

  const { data: allPharmacies = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const filteredPharmacies = useMemo(() => {
    let results = allPharmacies;
    if (location.trim()) {
      const query = location.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query)
      );
    }
    return results.slice(0, parseInt(resultsCount));
  }, [allPharmacies, location, resultsCount]);

  // Default center: Tunis, Tunisia
  const mapCenter: [number, number] =
    filteredPharmacies.length > 0
      ? [filteredPharmacies[0].lat, filteredPharmacies[0].lng]
      : [36.8008, 10.1800];

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!leafletMapRef.current) {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      leafletMapRef.current = L.map(mapRef.current).setView(mapCenter, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(leafletMapRef.current);
    }

    // Update view
    leafletMapRef.current.setView(mapCenter, 13);

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    filteredPharmacies.forEach((p) => {
      const marker = L.marker([p.lat, p.lng])
        .addTo(leafletMapRef.current!)
        .bindPopup(`<strong>${p.name}</strong><br/>${p.address}, ${p.city}<br/>${p.phone}`);
      markersRef.current.push(marker);
    });

    return () => {};
  }, [filteredPharmacies, mapCenter]);

  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-body relative">
      {/* Biophilic leaf accent */}
      <div className="fixed top-60 left-4 w-16 h-16 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
        </svg>
      </div>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-secondary font-semibold">Trouver une pharmacie</span>
          </nav>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trouvez votre pharmacie Nutriwell
            </h1>
            <p className="text-muted-foreground text-lg">
              Localisez les pharmacies et points de vente qui distribuent les produits Nutriwell près de chez vous.
            </p>
          </div>
        </div>
      </section>

      {/* Search Block */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Ville, code postal ou adresse…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-11 border-border"
              />
            </div>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="w-full sm:w-36 h-11">
                <SelectValue placeholder="Rayon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resultsCount} onValueChange={setResultsCount}>
              <SelectTrigger className="w-full sm:w-40 h-11">
                <SelectValue placeholder="Résultats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 résultats</SelectItem>
                <SelectItem value="10">10 résultats</SelectItem>
                <SelectItem value="20">20 résultats</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-11 px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
              <Search size={18} />
              Rechercher
            </Button>
          </div>
        </div>
      </section>

      {/* Results Split Panel */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">{filteredPharmacies.length}</span> pharmacie{filteredPharmacies.length > 1 ? "s" : ""} trouvée{filteredPharmacies.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: 480 }}>
            {/* Left – Results List */}
            <div className="lg:col-span-2 overflow-y-auto rounded-xl border border-border bg-card" style={{ maxHeight: 520 }}>
              {filteredPharmacies.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                  <MapPin className="text-muted-foreground mb-3" size={36} />
                  <p className="text-muted-foreground">Aucune pharmacie trouvée pour cette recherche.</p>
                </div>
              ) : (
                filteredPharmacies.map((pharmacy, idx) => (
                  <div
                    key={pharmacy.id}
                    className={`flex items-start gap-4 p-5 hover:bg-muted/50 transition-colors cursor-pointer ${
                      idx !== filteredPharmacies.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="text-primary" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-foreground text-sm leading-tight mb-1">
                        {pharmacy.name}
                      </h3>
                      <p className="text-muted-foreground text-xs mb-1">
                        {pharmacy.address}, {pharmacy.city}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">{pharmacy.phone}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-secondary">{pharmacy.distance}</span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <Navigation size={12} />
                          Itinéraire
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right – Map */}
            <div className="lg:col-span-3 rounded-xl overflow-hidden border border-border" style={{ minHeight: 400 }}>
              <div ref={mapRef} style={{ height: "100%", width: "100%", minHeight: 400 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Info Block */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-xl font-bold text-foreground mb-3">
                Vous ne trouvez pas de point de vente ?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Les produits Nutriwell sont disponibles dans un réseau croissant de pharmacies et parapharmacies partenaires en Tunisie. Si votre pharmacie habituelle ne référence pas encore nos produits, n'hésitez pas à leur en faire la demande.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vous pouvez également nous contacter directement pour connaître le point de vente le plus proche ou commander en ligne.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="bg-muted py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              {[
                { icon: Truck, text: "Livraison rapide en pharmacie" },
                { icon: Shield, text: "Qualité pharmaceutique certifiée" },
                { icon: Clock, text: "Disponibilité vérifiée en temps réel" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="text-primary" size={22} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(var(--brand-dark))" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreLocator;
