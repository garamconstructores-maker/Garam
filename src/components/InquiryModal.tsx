import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
import { Project } from '../types/portfolio';
import { leadSchema } from '../shared/apiContracts';
import { buildWhatsAppUrl } from '../config';
import { track } from '../utils/track';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Servicio desde el que se abrió (sección de servicios). */
  preselectedService?: string;
  /** Obra de referencia ("Quiero un proyecto como este"). */
  referenceProject?: Project | null;
  /** Desde dónde se abrió: hero, header, ficha:casa-am… (se guarda con la solicitud). */
  origin: string;
}

const PROJECT_TYPES = [
  { value: 'Residencial', hint: 'Casa o edificio' },
  { value: 'Comercial', hint: 'Tienda, restaurante, sede de marca' },
  { value: 'Corporativo', hint: 'Oficinas o torre' },
  { value: 'Salud / Especializada', hint: 'Clínica o urgencias' },
  { value: 'Urbanismo', hint: 'Terrazas, vialidad, parcelas' },
];
const ROLES = ['Propietario o inversionista', 'Desarrollador inmobiliario', 'Estudio de arquitectura', 'Empresa o corporativo'];
const LOCATIONS = [
  'Altamira / La Castellana / Country Club',
  'Valle Arriba / Las Mercedes / El Rosal',
  'Galipán / El Ávila',
  'Otra zona de Caracas',
  'Fuera de Caracas',
];
const AREAS = ['Menos de 500 m²', '500 - 1.500 m²', '1.500 - 5.000 m²', 'Más de 5.000 m²'];
const TIMELINES = ['Este año', 'El próximo año', 'Más adelante', 'Por definir'];
const STEPS = ['Tu proyecto', 'Ubicación y escala', 'Contacto'];

const Choice: React.FC<{ selected: boolean; onClick: () => void; label: string; hint?: string }> = ({ selected, onClick, label, hint }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
      selected ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-stone bg-white text-brand-ink hover:border-brand-ink/50'
    }`}
  >
    <span className="block text-sm font-semibold">{label}</span>
    {hint && <span className={`block text-xs ${selected ? 'text-white/75' : 'text-brand-muted'}`}>{hint}</span>}
  </button>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <fieldset className="space-y-2">
    <legend className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{label}</legend>
    {children}
  </fieldset>
);

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, preselectedService, referenceProject, origin }) => {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<string>(referenceProject?.category ?? 'Residencial');
  const [role, setRole] = useState(ROLES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [area, setArea] = useState(AREAS[1]);
  const [timeline, setTimeline] = useState(TIMELINES[3]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isOpen) track('formulario_iniciado', origin);
  }, [isOpen, origin]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Al cambiar de paso, el foco va al título del paso (lectores de pantalla y teclado).
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, successRef]);

  if (!isOpen) return null;

  const context = [
    referenceProject && `Referencia: ${referenceProject.title}`,
    preselectedService && `Servicio: ${preselectedService}`,
  ].filter(Boolean) as string[];

  const goNext = () => {
    setError(null);
    const next = step + 1;
    track(next === 1 ? 'formulario_paso_2' : 'formulario_paso_3', origin);
    setStep(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      name,
      email,
      phone,
      service: projectType,
      area,
      location,
      timeline,
      comments: [...context, `Perfil: ${role}`, comments.trim()].filter(Boolean).join(' · '),
      origin,
      consent: consent as true,
    };
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setError(!email && !phone ? 'Déjanos un teléfono o un correo para responderte.' : 'Revisa tu nombre, teléfono o correo y la autorización de contacto.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok || !data.referenceId) throw new Error(data.error || 'No pudimos registrar la solicitud.');
      track('solicitud_enviada', origin);
      setSuccessRef(data.referenceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos registrar la solicitud. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsAppUrl = buildWhatsAppUrl(
    encodeURIComponent(
      `Hola GARAM. Envié la solicitud ${successRef ?? ''} desde la web: proyecto ${projectType} en ${location}, ${area}, plazo: ${timeline.toLowerCase()}.` +
        (referenceProject ? ` Me interesa algo como ${referenceProject.title}.` : ''),
    ),
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 font-sans backdrop-blur-md animate-fade-in sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-step-title"
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-brand-stone bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-stone bg-brand-paper px-6 py-5 sm:px-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-emerald-600" />
              <span>Cuéntanos de tu proyecto</span>
            </div>
            {!successRef && (
              <p className="font-mono text-xs tabular-nums text-brand-muted">
                Paso {step + 1} de {STEPS.length} · {STEPS[step]}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 cursor-pointer rounded-md p-2 text-brand-muted transition-colors hover:bg-white hover:text-brand-ink"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {!successRef && (
          <div className="h-1 bg-brand-stone/60" aria-hidden="true">
            <div className="h-full bg-brand-copper transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        )}

        <div className="space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          {context.length > 0 && !successRef && (
            <div className="flex flex-wrap gap-2">
              {context.map((c) => (
                <span key={c} className="rounded-md border border-brand-stone bg-brand-paper px-2.5 py-1 text-xs text-brand-ink">
                  {c}
                </span>
              ))}
            </div>
          )}

          {successRef ? (
            <div className="space-y-5 py-4 text-center">
              <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-emerald-600" />
              <h2 id="inquiry-step-title" ref={headingRef} tabIndex={-1} className="font-editorial text-3xl text-brand-ink outline-none">
                Solicitud recibida
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-brand-muted">
                Un gerente de proyectos de GARAM te contactará para conversar sobre tu proyecto. Si quieres adelantar, escríbenos por WhatsApp con el resumen ya listo.
              </p>
              <p className="inline-block rounded-lg border border-brand-stone bg-brand-paper px-4 py-2 font-mono text-xs">
                Referencia: <strong className="text-brand-ink">{successRef}</strong>
              </p>
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', origin)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                  Seguir por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full cursor-pointer rounded-md border border-brand-stone px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink sm:w-auto"
                >
                  Volver al sitio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={step === 2 ? handleSubmit : (e) => (e.preventDefault(), goNext())} className="space-y-6">
              <h2 id="inquiry-step-title" ref={headingRef} tabIndex={-1} className="font-editorial text-3xl leading-tight text-brand-ink outline-none">
                {step === 0 && '¿Qué quieres construir?'}
                {step === 1 && '¿Dónde y de qué tamaño?'}
                {step === 2 && '¿Cómo te contactamos?'}
              </h2>

              {step === 0 && (
                <>
                  <Field label="Tipo de proyecto">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {PROJECT_TYPES.map((t) => (
                        <Choice key={t.value} label={t.value} hint={t.hint} selected={projectType === t.value} onClick={() => setProjectType(t.value)} />
                      ))}
                    </div>
                  </Field>
                  <Field label="Tú eres">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {ROLES.map((r) => (
                        <Choice key={r} label={r} selected={role === r} onClick={() => setRole(r)} />
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="Ubicación">
                    <div className="grid grid-cols-1 gap-2">
                      {LOCATIONS.map((l) => (
                        <Choice key={l} label={l} selected={location === l} onClick={() => setLocation(l)} />
                      ))}
                    </div>
                  </Field>
                  <Field label="Superficie aproximada">
                    <div className="grid grid-cols-2 gap-2">
                      {AREAS.map((a) => (
                        <Choice key={a} label={a} selected={area === a} onClick={() => setArea(a)} />
                      ))}
                    </div>
                  </Field>
                  <Field label="¿Cuándo quieres empezar?">
                    <div className="grid grid-cols-2 gap-2">
                      {TIMELINES.map((t) => (
                        <Choice key={t} label={t} selected={timeline === t} onClick={() => setTimeline(t)} />
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {step === 2 && (
                <div className="space-y-4 text-sm">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-brand-ink">Nombre</span>
                    <input
                      required
                      minLength={2}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border border-brand-stone px-3 py-2.5 focus:border-brand-ink focus:outline-none"
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-brand-ink">Teléfono o WhatsApp</span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-md border border-brand-stone px-3 py-2.5 focus:border-brand-ink focus:outline-none"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-brand-ink">Correo</span>
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-brand-stone px-3 py-2.5 focus:border-brand-ink focus:outline-none"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-brand-muted">Con uno de los dos basta.</p>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-brand-ink">¿Algo más que debamos saber? (opcional)</span>
                    <textarea
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full rounded-md border border-brand-stone px-3 py-2.5 focus:border-brand-ink focus:outline-none"
                    />
                  </label>
                  <label className="flex items-start gap-3 text-xs leading-relaxed text-brand-muted">
                    <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
                    <span>Autorizo a GARAM Constructores a contactarme sobre esta solicitud.</span>
                  </label>
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-brand-stone pt-5">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-semibold text-brand-muted transition-colors hover:text-brand-ink"
                  >
                    <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                    Atrás
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-brand-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-ink/90 disabled:opacity-60"
                >
                  {step < 2 ? (
                    <>
                      Continuar <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {submitting ? 'Enviando…' : 'Enviar solicitud'} <Send aria-hidden="true" className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
