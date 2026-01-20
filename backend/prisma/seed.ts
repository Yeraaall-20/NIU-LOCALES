import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@niufoods.cl";
  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    const passwordHash = await bcrypt.hash("Admin1234*", 10);
    await prisma.user.create({
      data: {
        nombre: "Admin",
        apellido: "General",
        email,
        password: passwordHash,
        role: "ADMIN",
      },
    });
    console.log("✔ Usuario admin creado: ", email, " / pass: Admin1234*");
  } else {
    console.log("ℹ Admin ya existe");
  }
}

main().finally(async () => prisma.$disconnect());