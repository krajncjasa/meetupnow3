import bcrypt from "bcrypt";
import postgres from "postgres";
import { User } from "../lib/definitions"; // prilagodi path do tvojega User tipa

// 1️⃣ Povezava na bazo
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require", // Supabase zahteva SSL
});

// 2️⃣ Funkcija za ustvarjanje uporabnika
export async function createUser(user: Omit<User, "id">): Promise<User> {
  // Hash gesla
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // Vstavi uporabnika v tabelo
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${user.name}, ${user.email}, ${hashedPassword})
    RETURNING *;
  `;

  // Vrni uporabnika brez gesla (opcijsko)
  const insertedUser = result[0] as User;
  return insertedUser;
}

// 3️⃣ Primer uporabe (seed script)
// Lahko za test poženemo direktno
async function main() {
  const testUser = {
    name: "Janez Novak",
    email: "janez@example.com",
    password: "123456",
  };

  const user = await createUser(testUser);
  console.log("Uporabnik ustvarjen:", user);
}

// Poženi samo, če direktno kličeš ta file
if (require.main === module) {
  main().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
