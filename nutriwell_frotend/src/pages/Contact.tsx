import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { Phone, Shield, Clock, ChevronRight, Upload, CheckSquare, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createContactReport, uploadContactAttachment } from "@/lib/contact-service";

const subjectOptions = [
  "Demande d'information produit",
  "Question sur une commande",
  "Réclamation qualité",
  "Partenariat professionnel",
  "Autre demande",
];

const profileOptions = [
  "Particulier",
  "Professionnel de santé",
  "Pharmacien",
  "Distributeur",
  "Autre",
];

const civilityOptions = ["M.", "Mme", "Dr", "Pr"];

const countryOptions = [
  "France", "Belgique", "Suisse", "Luxembourg", "Canada", "Maroc", "Tunisie", "Algérie",
];

const phonePrefixes = ["+33", "+32", "+41", "+352", "+1", "+212", "+216", "+213"];

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [profileType, setProfileType] = useState("");
  const [civility, setCivility] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Limit file size to 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: "Le fichier ne doit pas dépasser 5 Mo" }));
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject) errs.subject = "Veuillez sélectionner un sujet";
    if (!message.trim()) errs.message = "Veuillez saisir votre message";
    if (!email.trim()) errs.email = "Veuillez saisir votre email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format d'email invalide";
    if (!lastName.trim()) errs.lastName = "Veuillez saisir votre nom";
    if (!firstName.trim()) errs.firstName = "Veuillez saisir votre prénom";
    if (!captcha) errs.captcha = "Veuillez confirmer que vous n'êtes pas un robot";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      try {
        setIsSubmitting(true);
        
        // Upload file if present
        let attachmentUrl: string | null = null;
        if (file) {
          try {
            attachmentUrl = await uploadContactAttachment(file, email);
          } catch (fileErr) {
            console.error("File upload failed:", fileErr);
            // Continue without the file
          }
        }

        // Create contact report
        await createContactReport({
          subject,
          message,
          email,
          profileType,
          civility,
          lastName,
          firstName,
          address,
          postalCode,
          city,
          country,
          phonePrefix,
          phoneNumber,
          attachmentUrl,
        });

        setSubmitted(true);
      } catch (err) {
        console.error("Error submitting form:", err);
        setErrors(prev => ({
          ...prev,
          submit: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200";
  const selectClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 appearance-none";
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5";
  const errorClass = "text-xs text-destructive mt-1 font-medium";

  return (
    <div className="min-h-screen bg-background font-body relative">
      {/* Biophilic leaf accent */}
      <div className="fixed top-48 right-6 w-20 h-20 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
          <path d="M50 40C40 35 25 40 25 55" stroke="hsl(147 100% 37%)" strokeWidth="0.8"/>
        </svg>
      </div>
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-[15%] w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute bottom-0 left-[10%] w-48 h-48 rounded-full bg-secondary/5 blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Contactez-nous</span>
          </nav>
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Mail className="text-primary" size={28} />
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Contactez-nous
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Notre équipe est à votre écoute. Remplissez le formulaire ci-dessous et nous vous répondrons dans les meilleurs délais.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider fillColor="hsl(var(--background))" />

      {/* Contact Form */}
      <section id="contact-form" className="py-16">
        <div className="container mx-auto px-6">
          {submitted ? (
            <ScrollReveal>
              <div className="max-w-xl mx-auto text-center py-20">
                <div className="w-20 h-20 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-6">
                  <CheckSquare className="text-secondary" size={32} />
                </div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Message envoyé !</h2>
                <p className="text-muted-foreground text-lg mb-8">Merci pour votre message. Notre équipe vous répondra sous 48h ouvrées.</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                  Retour à l'accueil
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
              {/* Instruction */}
              <div className="text-center mb-10">
                <p className="text-muted-foreground text-sm">
                  Les champs marqués d'un <span className="text-destructive font-bold">*</span> sont obligatoires.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT COLUMN — Message */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <MessageSquare size={18} className="text-primary" />
                    <h2 className="font-heading text-lg font-bold text-foreground">Votre message</h2>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-6 space-y-5 shadow-sm">
                    {/* Subject */}
                    <div>
                      <label className={labelClass}>Sujet <span className="text-destructive">*</span></label>
                      <select value={subject} onChange={(e) => setSubject(e.target.value)} className={selectClass}>
                        <option value="">— Sélectionnez un sujet —</option>
                        {subjectOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {errors.subject && <p className={errorClass}>{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClass}>Message <span className="text-destructive">*</span></label>
                      <textarea
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Décrivez votre demande en détail…"
                        className={`${inputClass} min-h-[160px] resize-y`}
                      />
                      {errors.message && <p className={errorClass}>{errors.message}</p>}
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className={labelClass}>Pièce jointe</label>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-sm cursor-pointer hover:bg-primary/20 transition-colors border border-primary/20">
                          <Upload size={15} />
                          Choisir un fichier
                          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                        </label>
                        <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {fileName || "Aucun fichier"}
                        </span>
                      </div>
                    </div>

                    {/* File format info */}
                    <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Formats acceptés</p>
                      <p className="text-xs">PDF, JPG, PNG, DOC, DOCX — Max 5 Mo</p>
                    </div>

                    {/* Warning */}
                    <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-4 text-xs text-destructive/80">
                      <p className="font-semibold mb-0.5">⚠ Données sensibles</p>
                      <p>Ne transmettez jamais de numéros de carte bancaire, mots de passe ou données médicales confidentielles.</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN — Identity */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <User size={18} className="text-secondary" />
                    <h2 className="font-heading text-lg font-bold text-foreground">Vos coordonnées</h2>
                  </div>
                  <div className="bg-card rounded-2xl border border-border p-6 space-y-5 shadow-sm">
                    {/* Email */}
                    <div>
                      <label className={labelClass}>Email <span className="text-destructive">*</span></label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className={inputClass} />
                      {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    {/* Profile type */}
                    <div>
                      <label className={labelClass}>Type de profil</label>
                      <select value={profileType} onChange={(e) => setProfileType(e.target.value)} className={selectClass}>
                        <option value="">— Sélectionnez —</option>
                        {profileOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>

                    {/* Civility + Last name + First name */}
                    <div className="grid grid-cols-[100px_1fr_1fr] gap-3">
                      <div>
                        <label className={labelClass}>Civilité</label>
                        <select value={civility} onChange={(e) => setCivility(e.target.value)} className={selectClass}>
                          <option value="">—</option>
                          {civilityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Nom <span className="text-destructive">*</span></label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" className={inputClass} />
                        {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Prénom <span className="text-destructive">*</span></label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" className={inputClass} />
                        {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className={labelClass}>Adresse</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Numéro et nom de rue" className={inputClass} />
                    </div>

                    {/* Postal + City */}
                    <div className="grid grid-cols-[140px_1fr] gap-3">
                      <div>
                        <label className={labelClass}>Code postal</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="75001" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Ville</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" className={inputClass} />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className={labelClass}>Pays</label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
                        <option value="">— Sélectionnez —</option>
                        {countryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className={labelClass}>Téléphone</label>
                      <div className="grid grid-cols-[100px_1fr] gap-3">
                        <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} className={selectClass}>
                          {phonePrefixes.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="6 12 34 56 78" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anti-spam + Submit */}
              <div className="max-w-5xl mx-auto mt-10">
                <div className="bg-muted/50 rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-base font-bold text-foreground mb-4">Vérification</h3>
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none rounded-xl border border-border px-5 py-3.5 bg-background hover:border-primary/30 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={captcha}
                      onChange={(e) => setCaptcha(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary/40 accent-[hsl(var(--primary))]"
                    />
                    <span className="text-sm font-medium text-foreground">Je ne suis pas un robot</span>
                  </label>
                  {errors.captcha && <p className={`${errorClass} mt-2`}>{errors.captcha}</p>}
                </div>

                <div className="mt-8 text-center">
                  {errors.submit && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
                      {errors.submit}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-12 py-4 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer mon message"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Legal / GDPR */}
      <section className="py-14 bg-muted/60">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-6">
              <Shield size={18} className="text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Protection des données</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Les informations recueillies via ce formulaire font l'objet d'un traitement destiné à répondre à votre demande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression. Contactez{" "}
                <a href="mailto:dpo@nutriwell.com" className="text-primary hover:underline font-medium">dpo@nutriwell.com</a>.
              </p>
              <p>
                Vos données sont conservées 3 ans maximum à compter de votre dernière interaction. Elles ne seront jamais cédées à des tiers sans consentement.
              </p>
              <p>
                Consultez notre <a href="#" className="text-primary hover:underline font-medium">Politique de confidentialité</a> et nos <a href="#" className="text-primary hover:underline font-medium">CGU</a> pour plus de détails.
              </p>
              <p>
                En soumettant ce formulaire, vous acceptez que vos données soient traitées conformément à notre politique de confidentialité.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider fillColor="hsl(var(--background))" />

      {/* Benefits Strip */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="bg-muted py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Phone, title: "Réponse sous 48h", desc: "Chaque demande est traitée avec soin par notre équipe.", color: "primary" },
                { icon: Shield, title: "Données sécurisées", desc: "Vos informations sont protégées conformément au RGPD.", color: "secondary" },
                { icon: Clock, title: "Support dédié", desc: "Un interlocuteur qualifié pour chaque type de demande.", color: "accent" },
              ].map((b, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="text-center p-6 organic-card">
                    <div className={`w-14 h-14 rounded-xl bg-${b.color}/10 flex items-center justify-center mx-auto mb-4`}>
                      <b.icon className={`text-${b.color}`} size={24} />
                    </div>
                    <h4 className="font-heading font-bold text-foreground mb-2">{b.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </ScrollReveal>
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

export default Contact;
