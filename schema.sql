-- OpenNutriSync database schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) DEFAULT 'default_user',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meal_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_nutrients (
    meal_id UUID PRIMARY KEY REFERENCES meals(id) ON DELETE CASCADE,

    -- Energy & Hydration
    dietary_energy_kcal NUMERIC(8, 2) DEFAULT 0,
    water_ml NUMERIC(8, 2) DEFAULT 0,
    caffeine_mg NUMERIC(8, 2) DEFAULT 0,

    -- Macronutrients
    carbohydrates_g NUMERIC(8, 2) DEFAULT 0,
    dietary_sugar_g NUMERIC(8, 2) DEFAULT 0,
    fiber_g NUMERIC(8, 2) DEFAULT 0,
    protein_g NUMERIC(8, 2) DEFAULT 0,
    total_fat_g NUMERIC(8, 2) DEFAULT 0,
    saturated_fat_g NUMERIC(8, 2) DEFAULT 0,
    monounsaturated_fat_g NUMERIC(8, 2) DEFAULT 0,
    polyunsaturated_fat_g NUMERIC(8, 2) DEFAULT 0,
    cholesterol_mg NUMERIC(8, 2) DEFAULT 0,

    -- Vitamins
    vitamin_a_mcg NUMERIC(8, 2) DEFAULT 0,
    thiamin_b1_mg NUMERIC(8, 2) DEFAULT 0,
    riboflavin_b2_mg NUMERIC(8, 2) DEFAULT 0,
    niacin_b3_mg NUMERIC(8, 2) DEFAULT 0,
    pantothenic_acid_b5_mg NUMERIC(8, 2) DEFAULT 0,
    vitamin_b6_mg NUMERIC(8, 2) DEFAULT 0,
    biotin_b7_mcg NUMERIC(8, 2) DEFAULT 0,
    folate_b9_mcg NUMERIC(8, 2) DEFAULT 0,
    cobalamin_b12_mcg NUMERIC(8, 2) DEFAULT 0,
    vitamin_c_mg NUMERIC(8, 2) DEFAULT 0,
    vitamin_d_iu NUMERIC(8, 2) DEFAULT 0,
    vitamin_e_mg NUMERIC(8, 2) DEFAULT 0,
    vitamin_k_mcg NUMERIC(8, 2) DEFAULT 0,

    -- Minerals & Electrolytes
    calcium_mg NUMERIC(8, 2) DEFAULT 0,
    chloride_mg NUMERIC(8, 2) DEFAULT 0,
    chromium_mcg NUMERIC(8, 2) DEFAULT 0,
    copper_mg NUMERIC(8, 2) DEFAULT 0,
    iodine_mcg NUMERIC(8, 2) DEFAULT 0,
    iron_mg NUMERIC(8, 2) DEFAULT 0,
    magnesium_mg NUMERIC(8, 2) DEFAULT 0,
    manganese_mg NUMERIC(8, 2) DEFAULT 0,
    molybdenum_mcg NUMERIC(8, 2) DEFAULT 0,
    phosphorus_mg NUMERIC(8, 2) DEFAULT 0,
    potassium_mg NUMERIC(8, 2) DEFAULT 0,
    selenium_mcg NUMERIC(8, 2) DEFAULT 0,
    sodium_mg NUMERIC(8, 2) DEFAULT 0,
    zinc_mg NUMERIC(8, 2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_meals_timestamp ON meals(timestamp DESC);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(64) DEFAULT 'default_user',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    active_energy_kcal NUMERIC(8, 2) DEFAULT 0,
    steps INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
