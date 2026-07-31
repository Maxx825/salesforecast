-- Datasets and Forecast Runs Module
-- Migration: 20260730060000_datasets_and_forecasts

-- 1. Datasets table
CREATE TABLE IF NOT EXISTS public.datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    row_count INTEGER NOT NULL DEFAULT 0,
    col_count INTEGER NOT NULL DEFAULT 0,
    file_size TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'validating',
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Forecast runs table
CREATE TABLE IF NOT EXISTS public.forecast_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
    run_name TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'prophet',
    horizon_weeks INTEGER NOT NULL DEFAULT 12,
    confidence_level INTEGER NOT NULL DEFAULT 80,
    status TEXT NOT NULL DEFAULT 'queued',
    projected_revenue NUMERIC,
    mape NUMERIC,
    growth_rate NUMERIC,
    avg_ci_width NUMERIC,
    data_coverage TEXT,
    forecast_data JSONB,
    segment_data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON public.datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_uploaded_at ON public.datasets(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_forecast_runs_user_id ON public.forecast_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_forecast_runs_dataset_id ON public.forecast_runs(dataset_id);
CREATE INDEX IF NOT EXISTS idx_forecast_runs_created_at ON public.forecast_runs(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_runs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "users_manage_own_datasets" ON public.datasets;
CREATE POLICY "users_manage_own_datasets"
ON public.datasets
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "users_manage_own_forecast_runs" ON public.forecast_runs;
CREATE POLICY "users_manage_own_forecast_runs"
ON public.forecast_runs
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
