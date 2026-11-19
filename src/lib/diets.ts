export const DIETS = [
  { id: "gluten-free", label: "Gluten Free" },
  { id: "high-protein", label: "High Protein" },
  { id: "low-gi", label: "Low GI" },
  { id: "vegan", label: "Vegan" },
  { id: "diabetic-friendly", label: "Diabetic Friendly" },
  { id: "immunity-boosting", label: "Immunity Boosting" },
  { id: "kids-friendly", label: "Kids Friendly" },
] as const;

export type DietId = (typeof DIETS)[number]["id"];

export const DIET_IDS = DIETS.map((diet) => diet.id) as [DietId, ...DietId[]];

export function dietLabel(id: string): string {
  return DIETS.find((diet) => diet.id === id)?.label ?? id;
}
