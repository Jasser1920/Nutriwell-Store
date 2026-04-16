/**
 * Nutrition data transformer
 * Converts between database format (string array) and display format (object array)
 */

export interface NutritionInfo {
  nutriment: string;
  per100ml: string;
  perPortion: string;
}

/**
 * Parse nutrition string array from database
 * Example input: ["Énergie: 100 kcal / 200 kcal", "Protéines: 10g / 20g"]
 * Expected output: [{nutriment: "Énergie", per100ml: "100 kcal", perPortion: "200 kcal"}, ...]
 */
export const parseNutritionArray = (nutritionArray: string[]): NutritionInfo[] => {
  if (!nutritionArray || nutritionArray.length === 0) return [];

  return nutritionArray
    .map((item) => {
      // Handle format: "Nutriment: value1 / value2"
      const match = item.match(/^([^:]+):\s*(.+?)\s*\/\s*(.+)$/);
      if (!match) return null;

      return {
        nutriment: match[1].trim(),
        per100ml: match[2].trim(),
        perPortion: match[3].trim(),
      };
    })
    .filter((item): item is NutritionInfo => item !== null);
};

/**
 * Convert nutrition object array to string array for database
 * Example input: [{nutriment: "Énergie", per100ml: "100 kcal", perPortion: "200 kcal"}, ...]
 * Expected output: ["Énergie: 100 kcal / 200 kcal", "Protéines: 10g / 20g"]
 */
export const stringifyNutritionArray = (nutritionArray: NutritionInfo[]): string[] => {
  if (!nutritionArray || nutritionArray.length === 0) return [];

  return nutritionArray.map(
    (item) => `${item.nutriment}: ${item.per100ml} / ${item.perPortion}`
  );
};

/**
 * Format nutrition for display in UI
 * Takes both formats and returns the object array format
 */
export const formatNutritionForDisplay = (
  nutrition: string[] | NutritionInfo[]
): NutritionInfo[] => {
  if (!nutrition || nutrition.length === 0) return [];

  // If already in object format, return as is
  if (typeof nutrition[0] === "object") {
    return nutrition as NutritionInfo[];
  }

  // Otherwise parse from string format
  return parseNutritionArray(nutrition as string[]);
};
