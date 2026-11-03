import React, { useState } from 'react';
import { InquiryFormData, ProjectCategory } from '../types/portfolio';
import { X, Send, CheckCircle2, MessageCircle, ShieldCheck, Calendar, MapPin, Building, ArrowRight } from 'lucide-react';
import { leadSchema } from '../shared/apiContracts';
import { buildWhatsAppUrl } from '../config';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const ROLES = [
  'Propietario / Inversionista Particular',
  'Estudio de Arquitectura / Diseñador',
  'Promotor Inmobiliario / Desarrolladora',
  'Director de Operaciones / Corporativo',
];

const LOCATIONS = [
  'Altamira / La Castellana / Country Club',
  'Valle Arriba / Las Mercedes / El Rosal',
  'Galipán / Parque Nacional El Ávila',
  'Otras zonas de Caracas / Gran Caracas',
  'Interior del país / Otra ubicación',
];

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const [clientRole, setClientRole] = useState(ROLES[0]);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: (preselectedService as ProjectCategory) || 'Residencial',
    location: LOCATIONS[0],
    estimatedArea: '500 - 1.500 m²',
    targetTimeline: '2026 - 2027',
    budgetRange: 'Por definir en propuesta técnica',
    comments: preselectedService
      ? `Requerimiento orientado al área de: ${preselectedService}.`
      : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Keyboard Escape dismissal
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.projectType,
        area: formData.estimatedArea,
        location: formData.location,
        timeline: formData.targetTimeline,
        comments: [formData.company, clientRole, formData.budgetRange, formData.comments].filter(Boolean).join(' · '),
        consent: true,
      };
      const parsedPayload = leadSchema.safeParse(payload);
      if (!parsedPayload.success) {
        throw new Error('Revisa los datos de contacto y los campos obligatorios antes de continuar.');
      }

      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.referenceId) {
        throw new Error(data.error || 'No pudimos registrar la solicitud.');
      }
      setSuccessRef(data.referenceId);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setSubmitError(err instanceof Error ? err.message : 'No pudimos registrar la solicitud. Intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Pre-configured direct WhatsApp message
  const whatsAppDirectMessage = encodeURIComponent(
    `Buenas tardes. Me comunico con GARAM Constructores desde su portal web oficial. Solicito agendar una reunión técnica de factibilidad para un proyecto ${formData.projectType} en ${formData.location} (${formData.estimatedArea}).`
  );
  const whatsAppDirectUrl = buildWhatsAppUrl(whatsAppDirectMessage);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-fade-in font-sans cursor-pointer"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden my-auto cursor-default shadow-2xl border border-brand-stone max-h-[92vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-brand-paper p-6 sm:p-8 flex items-start justify-between border-b border-brand-stone shrink-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#86868b] font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>GARAM CONSTRUCTORES · CANAL CONFIDENCIAL VIP</span>
            </div>
            <h2 id="inquiry-modal-title" className="font-editorial text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
              Reunión Técnica de Factibilidad
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted font-normal leading-relaxed">
              Atención directa para propietarios, arquitectos y directores de inversión. Análisis de alcance, tiempos y viabilidad constructiva.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-ink hover:bg-white rounded-md transition-colors cursor-pointer shrink-0 ml-4"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {successRef ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-brand-ink">
                  Reunión de Factibilidad Registrada
                </h3>
                <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                  Su solicitud ha sido asignada a nuestra **Dirección de Obra y Gerencia Técnica**. Un ingeniero o arquitecto senior de GARAM se comunicará directamente para coordinar la cita o visita técnica preliminar.
                </p>
              </div>

              <div className="inline-block p-4 rounded-2xl bg-brand-paper border border-brand-stone text-xs font-mono">
                <span className="text-[#86868b]">Expediente Técnico: </span>
                <span className="font-bold text-brand-ink">{successRef}</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar Inmediato por WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setSuccessRef(null);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-md bg-brand-ink text-white text-xs font-semibold hover:bg-brand-ink/90 transition-all shadow-sm"
                >
                  Volver al Portafolio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {submitError}
                </div>
              )}

              {/* Selector de Rol del Cliente */}
              <div className="space-y-2">
                <label className="font-bold text-brand-ink uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-brand-ink" />
                  <span>Perfil de quien consulta:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setClientRole(role)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                        clientRole === role
                          ? 'border-brand-ink bg-brand-ink text-white shadow-xs font-semibold'
                          : 'border-brand-stone bg-white text-brand-muted hover:border-brand-ink/40 hover:text-brand-ink'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipología y Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs">
                    Tipo de Proyecto / Intervención *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectType: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all font-medium"
                  >
                    <option value="Residencial">Residencial de Lujo (Unifamiliar / Edificio)</option>
                    <option value="Comercial">Comercial (Restaurante / Retail / Sede de Marca)</option>
                    <option value="Corporativo">Corporativo (Fit-Out / Oficinas / Torre)</option>
                    <option value="Salud / Especializada">Salud & Hospitalario (Clínica / Quirófano)</option>
                    <option value="Urbanismo">Urbanismo & Movimiento de Tierra (Terrazas)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-ink" />
                    <span>Ubicación Estimada de la Obra</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all font-medium"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Metraje y Cronograma */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs">
                    Superficie o Metraje Estimado
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedArea}
                    onChange={(e) => setFormData({ ...formData, estimatedArea: e.target.value })}
                    placeholder="Ej. 1.250 m² o Parcela de 3.000 m²"
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-ink" />
                    <span>Cronograma / Inicio Estimado</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetTimeline}
                    onChange={(e) =>
                      setFormData({ ...formData, targetTimeline: e.target.value })
                    }
                    placeholder="Ej. Inmediato / Q3 2026 / Factibilidad 2027"
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Datos de Contacto Directo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-brand-stone">
                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Ing. Roberto Mendoza"
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs">
                    Teléfono / WhatsApp (opcional si indica correo)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+58 (412) 000-0000"
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-ink text-xs">
                    Correo Electrónico (opcional si indica teléfono)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                    className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Notas del Proyecto */}
              <div className="space-y-1.5">
                <label className="font-semibold text-brand-ink text-xs">
                  Detalles del Requerimiento o Terreno
                </label>
                <textarea
                  rows={2}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Comentarios sobre el estado del terreno, planos disponibles o metas técnicas..."
                  className="w-full p-3 bg-brand-paper rounded-xl border border-transparent focus:border-brand-ink focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-copper/40 text-xs text-brand-ink focus:outline-none transition-all"
                />
              </div>

              <label className="flex items-start gap-3 text-[11px] leading-relaxed text-brand-muted">
                <input
                  type="checkbox"
                  required
                  aria-label="Acepto el contacto de GARAM sobre esta solicitud"
                  className="mt-0.5 size-4 accent-brand-ink"
                />
                <span>Acepto que GARAM use estos datos para contactarme sobre esta solicitud de factibilidad.</span>
              </label>

              {/* Bottom Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-stone">
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>O contactar directamente vía WhatsApp VIP</span>
                </a>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-xs font-semibold text-brand-muted hover:text-brand-ink cursor-pointer"
                  >
                    Cerrar
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3 text-xs font-semibold rounded-md bg-brand-ink text-white hover:bg-brand-ink/90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <span>{submitting ? 'Agendando...' : 'Agendar Reunión Técnica'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
