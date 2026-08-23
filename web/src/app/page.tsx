import { sql } from "@/lib/db";
import {
  MICRONUTRIENT_KEYS,
  NutrientKey,
  RDA_STANDARDS,
  pctOfRda,
  rdaBadgeClass,
} from "@/lib/rda-standards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const MACRO_ROWS: { key: NutrientKey; label: string }[] = [
  { key: "protein_g", label: "Protein" },
  { key: "carbohydrates_g", label: "Carbs" },
  { key: "total_fat_g", label: "Fat" },
  { key: "fiber_g", label: "Fiber" },
] as const;

async function getTodaysMeals() {
  return sql`
    SELECT m.id, m.timestamp, m.meal_name, n.*
    FROM meals m
    JOIN meal_nutrients n ON n.meal_id = m.id
    WHERE m.timestamp::date = CURRENT_DATE
    ORDER BY m.timestamp DESC;
  `;
}

export default async function DashboardPage() {
  const meals = await getTodaysMeals();

  const totals: Record<string, number> = {};
  for (const key of Object.keys(RDA_STANDARDS) as NutrientKey[]) {
    totals[key] = meals.reduce((sum, meal) => sum + Number(meal[key] ?? 0), 0);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Macros today</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {MACRO_ROWS.map(({ key, label }) => {
            const value = totals[key] ?? 0;
            const rda = RDA_STANDARDS[key].rda;
            const pct = Math.min(100, Math.round((value / rda) * 100));
            return (
              <Progress key={key} value={pct}>
                <div className="flex w-full items-baseline justify-between">
                  <ProgressLabel>{label}</ProgressLabel>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {value.toFixed(0)} / {rda} {RDA_STANDARDS[key].unit}
                  </span>
                </div>
                <ProgressTrack>
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Micronutrients (% RDA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MICRONUTRIENT_KEYS.map((key) => {
              const entry = RDA_STANDARDS[key];
              const value = totals[key] ?? 0;
              const pct = pctOfRda(key, value);
              return (
                <Badge key={key} variant="outline" className={rdaBadgeClass(pct)}>
                  {entry.label} {pct}%
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s meals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">kcal</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
                <TableHead className="text-right">Fat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No meals logged today.
                  </TableCell>
                </TableRow>
              )}
              {meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell className="font-medium">{meal.meal_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(meal.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-right">{Number(meal.dietary_energy_kcal).toFixed(0)}</TableCell>
                  <TableCell className="text-right">{Number(meal.protein_g).toFixed(0)}g</TableCell>
                  <TableCell className="text-right">{Number(meal.carbohydrates_g).toFixed(0)}g</TableCell>
                  <TableCell className="text-right">{Number(meal.total_fat_g).toFixed(0)}g</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
