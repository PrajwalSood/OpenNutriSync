import { sql } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

async function getRecentMeals() {
  return sql`
    SELECT m.id, m.timestamp, m.meal_name, n.dietary_energy_kcal, n.protein_g, n.carbohydrates_g, n.total_fat_g
    FROM meals m
    JOIN meal_nutrients n ON n.meal_id = m.id
    ORDER BY m.timestamp DESC
    LIMIT 100;
  `;
}

export default async function HistoryPage() {
  const meals = await getRecentMeals();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal history</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal</TableHead>
              <TableHead>Date</TableHead>
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
                  No meals logged yet.
                </TableCell>
              </TableRow>
            )}
            {meals.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell className="font-medium">{meal.meal_name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(meal.timestamp).toLocaleString()}
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
  );
}
