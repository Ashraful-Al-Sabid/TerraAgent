-- ==============================================================================
-- TerraAgent - Autonomous Multi-Agent Verification Platform Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(64) UNIQUE NOT NULL,
    applicant_name_en VARCHAR(255) NOT NULL,
    applicant_name_bn VARCHAR(255) NOT NULL,
    nid_number VARCHAR(32) NOT NULL,
    bris_number VARCHAR(32),
    dob DATE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    
    -- Land/Service Details
    division VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    upazila VARCHAR(64) NOT NULL,
    mouza VARCHAR(128) NOT NULL,
    jl_number VARCHAR(32) NOT NULL,
    khatian_number VARCHAR(64) NOT NULL,
    plot_number VARCHAR(64) NOT NULL,
    land_area_decimals NUMERIC(10, 2) NOT NULL,
    application_type VARCHAR(64) DEFAULT 'mutation_namjari',
    
    -- Workflow & Agent Status
    status VARCHAR(64) DEFAULT 'pending', -- pending, processing, flagged_discrepancy, verified, approved, rejected
    risk_level VARCHAR(32) DEFAULT 'low', -- low, medium, high, critical
    integrity_score INTEGER DEFAULT 0,    -- 0 to 100
    current_agent VARCHAR(64),
    
    -- Citizen Correction Handling
    discrepancy_flags JSONB DEFAULT '[]'::jsonb,
    correction_history JSONB DEFAULT '[]'::jsonb,
    is_resubmitted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    doc_type VARCHAR(64) NOT NULL, -- nid_card, khatian_porcha, deed_dalil, tax_dakhila, warishan_sanad
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_url TEXT,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    ocr_confidence NUMERIC(5, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Multi-Agent Audit Logs
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    agent_name VARCHAR(64) NOT NULL, -- intake, identity, background, dossier, orchestrator
    phase VARCHAR(64) NOT NULL,
    log_level VARCHAR(32) DEFAULT 'info', -- info, warning, error, success
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Synthetic Government Registries (Simulated Official Records)
CREATE TABLE IF NOT EXISTS synthetic_nid_registry (
    nid_number VARCHAR(32) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    father_name_en VARCHAR(255),
    father_name_bn VARCHAR(255),
    mother_name_en VARCHAR(255),
    mother_name_bn VARCHAR(255),
    dob DATE NOT NULL,
    blood_group VARCHAR(8),
    address TEXT,
    status VARCHAR(32) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS synthetic_birth_registry (
    bris_number VARCHAR(32) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    birth_place VARCHAR(128),
    registration_date DATE,
    father_name_en VARCHAR(255),
    mother_name_en VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS synthetic_land_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district VARCHAR(64) NOT NULL,
    upazila VARCHAR(64) NOT NULL,
    mouza VARCHAR(128) NOT NULL,
    jl_number VARCHAR(32) NOT NULL,
    khatian_number VARCHAR(64) NOT NULL,
    plot_number VARCHAR(64) NOT NULL,
    recorded_owner_en VARCHAR(255) NOT NULL,
    recorded_owner_bn VARCHAR(255) NOT NULL,
    recorded_nid VARCHAR(32),
    land_type VARCHAR(64) DEFAULT 'Nal',
    area_decimals NUMERIC(10, 2) NOT NULL,
    encumbrance_status VARCHAR(128) DEFAULT 'Clear', -- Clear, Disputed, Vested Property, Court Injunction, Bank Mortgage
    last_tax_year INTEGER DEFAULT 2025,
    survey_type VARCHAR(32) DEFAULT 'BS' -- CS, SA, RS, BS
);

-- 5. Dossier Reports
CREATE TABLE IF NOT EXISTS dossier_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    executive_summary TEXT NOT NULL,
    identity_findings JSONB NOT NULL DEFAULT '{}'::jsonb,
    land_record_findings JSONB NOT NULL DEFAULT '{}'::jsonb,
    risk_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,
    recommendation VARCHAR(64) NOT NULL, -- approve, clarify, reject, physical_hearing
    integrity_score INTEGER NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Officer Reviews
CREATE TABLE IF NOT EXISTS officer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    officer_name VARCHAR(128) NOT NULL,
    officer_designation VARCHAR(128) NOT NULL,
    action VARCHAR(64) NOT NULL, -- approved, rejected, clarification_requested, physical_inspection_required
    comments TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossier_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthetic_nid_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthetic_birth_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthetic_land_registry ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for MVP demonstration
CREATE POLICY "Allow public demo access for applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public demo access for documents" ON documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public demo access for agent_logs" ON agent_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public demo access for dossier_reports" ON dossier_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public demo access for officer_reviews" ON officer_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read access for synthetic_nid" ON synthetic_nid_registry FOR SELECT USING (true);
CREATE POLICY "Allow public read access for synthetic_birth" ON synthetic_birth_registry FOR SELECT USING (true);
CREATE POLICY "Allow public read access for synthetic_land" ON synthetic_land_registry FOR SELECT USING (true);
