type ZodiacAnimal =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

// 常用生肖计算：以 1900（Rat）为基准
const ANIMALS: ZodiacAnimal[] = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

export function getZodiacAnimal(year: number): ZodiacAnimal {
  const baseYear = 1900; // Rat
  const idx = ((year - baseYear) % 12 + 12) % 12;
  return ANIMALS[idx];
}
