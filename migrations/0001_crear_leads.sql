-- Prospectos registrados desde el formulario de cotización (/api/estimate).
CREATE TABLE leads (
  id TEXT PRIMARY KEY NOT NULL,
  reference_id TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  client_ip TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service TEXT NOT NULL,
  area TEXT NOT NULL,
  location TEXT NOT NULL,
  timeline TEXT NOT NULL,
  comments TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  consent_at INTEGER NOT NULL
);

CREATE INDEX leads_created_at_idx ON leads (created_at);
