export type NutrientKey =
  | "dietary_energy_kcal"
  | "water_ml"
  | "caffeine_mg"
  | "carbohydrates_g"
  | "dietary_sugar_g"
  | "fiber_g"
  | "protein_g"
  | "total_fat_g"
  | "saturated_fat_g"
  | "monounsaturated_fat_g"
  | "polyunsaturated_fat_g"
  | "cholesterol_mg"
  | "vitamin_a_mcg"
  | "thiamin_b1_mg"
  | "riboflavin_b2_mg"
  | "niacin_b3_mg"
  | "pantothenic_acid_b5_mg"
  | "vitamin_b6_mg"
  | "biotin_b7_mcg"
  | "folate_b9_mcg"
  | "cobalamin_b12_mcg"
  | "vitamin_c_mg"
  | "vitamin_d_iu"
  | "vitamin_e_mg"
  | "vitamin_k_mcg"
  | "calcium_mg"
  | "chloride_mg"
  | "chromium_mcg"
  | "copper_mg"
  | "iodine_mcg"
  | "iron_mg"
  | "magnesium_mg"
  | "manganese_mg"
  | "molybdenum_mcg"
  | "phosphorus_mg"
  | "potassium_mg"
  | "selenium_mcg"
  | "sodium_mg"
  | "zinc_mg";

export interface RdaEntry {
  label: string;
  unit: string;
  rda: number;
  category: "macro" | "vitamin" | "mineral";
}

// General adult RDA/AI values (FDA / NIH ODS reference intakes).
export const RDA_STANDARDS: Record<NutrientKey, RdaEntry> = {
  dietary_energy_kcal: { label: "Energy", unit: "kcal", rda: 2000, category: "macro" },
  water_ml: { label: "Water", unit: "mL", rda: 3000, category: "macro" },
  caffeine_mg: { label: "Caffeine", unit: "mg", rda: 400, category: "macro" },
  carbohydrates_g: { label: "Carbohydrates", unit: "g", rda: 275, category: "macro" },
  dietary_sugar_g: { label: "Sugar", unit: "g", rda: 50, category: "macro" },
  fiber_g: { label: "Fiber", unit: "g", rda: 28, category: "macro" },
  protein_g: { label: "Protein", unit: "g", rda: 50, category: "macro" },
  total_fat_g: { label: "Total Fat", unit: "g", rda: 78, category: "macro" },
  saturated_fat_g: { label: "Saturated Fat", unit: "g", rda: 20, category: "macro" },
  monounsaturated_fat_g: { label: "Monounsaturated Fat", unit: "g", rda: 44, category: "macro" },
  polyunsaturated_fat_g: { label: "Polyunsaturated Fat", unit: "g", rda: 27, category: "macro" },
  cholesterol_mg: { label: "Cholesterol", unit: "mg", rda: 300, category: "macro" },

  vitamin_a_mcg: { label: "Vitamin A", unit: "mcg", rda: 900, category: "vitamin" },
  thiamin_b1_mg: { label: "Thiamin (B1)", unit: "mg", rda: 1.2, category: "vitamin" },
  riboflavin_b2_mg: { label: "Riboflavin (B2)", unit: "mg", rda: 1.3, category: "vitamin" },
  niacin_b3_mg: { label: "Niacin (B3)", unit: "mg", rda: 16, category: "vitamin" },
  pantothenic_acid_b5_mg: { label: "Pantothenic Acid (B5)", unit: "mg", rda: 5, category: "vitamin" },
  vitamin_b6_mg: { label: "Vitamin B6", unit: "mg", rda: 1.7, category: "vitamin" },
  biotin_b7_mcg: { label: "Biotin (B7)", unit: "mcg", rda: 30, category: "vitamin" },
  folate_b9_mcg: { label: "Folate (B9)", unit: "mcg", rda: 400, category: "vitamin" },
  cobalamin_b12_mcg: { label: "Vitamin B12", unit: "mcg", rda: 2.4, category: "vitamin" },
  vitamin_c_mg: { label: "Vitamin C", unit: "mg", rda: 90, category: "vitamin" },
  vitamin_d_iu: { label: "Vitamin D", unit: "IU", rda: 800, category: "vitamin" },
  vitamin_e_mg: { label: "Vitamin E", unit: "mg", rda: 15, category: "vitamin" },
  vitamin_k_mcg: { label: "Vitamin K", unit: "mcg", rda: 120, category: "vitamin" },

  calcium_mg: { label: "Calcium", unit: "mg", rda: 1300, category: "mineral" },
  chloride_mg: { label: "Chloride", unit: "mg", rda: 2300, category: "mineral" },
  chromium_mcg: { label: "Chromium", unit: "mcg", rda: 35, category: "mineral" },
  copper_mg: { label: "Copper", unit: "mg", rda: 0.9, category: "mineral" },
  iodine_mcg: { label: "Iodine", unit: "mcg", rda: 150, category: "mineral" },
  iron_mg: { label: "Iron", unit: "mg", rda: 18, category: "mineral" },
  magnesium_mg: { label: "Magnesium", unit: "mg", rda: 420, category: "mineral" },
  manganese_mg: { label: "Manganese", unit: "mg", rda: 2.3, category: "mineral" },
  molybdenum_mcg: { label: "Molybdenum", unit: "mcg", rda: 45, category: "mineral" },
  phosphorus_mg: { label: "Phosphorus", unit: "mg", rda: 1250, category: "mineral" },
  potassium_mg: { label: "Potassium", unit: "mg", rda: 4700, category: "mineral" },
  selenium_mcg: { label: "Selenium", unit: "mcg", rda: 55, category: "mineral" },
  sodium_mg: { label: "Sodium", unit: "mg", rda: 2300, category: "mineral" },
  zinc_mg: { label: "Zinc", unit: "mg", rda: 11, category: "mineral" },
};

export const MICRONUTRIENT_KEYS: NutrientKey[] = Object.keys(RDA_STANDARDS).filter(
  (k) => RDA_STANDARDS[k as NutrientKey].category !== "macro"
) as NutrientKey[];

export function pctOfRda(key: NutrientKey, value: number): number {
  const rda = RDA_STANDARDS[key].rda;
  if (!rda) return 0;
  return Math.min(999, Math.round((value / rda) * 100));
}

export function rdaBadgeClass(pct: number): string {
  if (pct >= 100) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (pct >= 60) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (pct >= 25) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  return "bg-red-500/15 text-red-400 border-red-500/30";
}
