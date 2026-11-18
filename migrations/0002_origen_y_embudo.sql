-- Origen de cada solicitud (hero, ficha:casa-am, servicio:promocion…).
ALTER TABLE leads ADD COLUMN origin TEXT;

-- Embudo de contacto: conteos diarios por evento y origen, sin datos personales.
CREATE TABLE funnel_counts (
  day TEXT NOT NULL,
  event TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event, origin)
);
