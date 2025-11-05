import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { User } from '../lib/definitions'; // prilagodi path

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  // 1️⃣ Ustvari extension in tabelo, če še ne obstajata
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;

  // 2️⃣ Hashiranje gesla
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // 3️⃣ Vstavi uporabnika
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${user.name}, ${user.email}, ${hashedPassword})
    RETURNING *;
  `;

  // 4️⃣ Vrni vstavljenega uporabnika
  const insertedUser = result[0] as User;

  return insertedUser;
}