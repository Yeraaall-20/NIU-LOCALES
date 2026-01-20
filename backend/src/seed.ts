import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@niufoods.cl' },
    update: {},
    create: {
      email: 'admin@niufoods.cl',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      role: 'ADMIN'
    }
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear usuarios técnicos
  const tecnicos = [
    {
      email: 'yerall.alvarez@niufoods.cl',
      nombre: 'Yerall',
      apellido: 'Alvarez'
    },
    {
      email: 'charlotte.coleman@niufoods.cl',
      nombre: 'Charlotte',
      apellido: 'Coleman'
    },
    {
      email: 'david.conde@niufoods.cl',
      nombre: 'David',
      apellido: 'Conde'
    },
    {
      email: 'juan.pablo@niufoods.cl',
      nombre: 'Juan Pablo',
      apellido: 'Palma'
    },
    {
      email: 'christopher.guerra@niufoods.cl',
      nombre: 'Christopher',
      apellido: 'Guerra'
    }
  ];

  const tecnicosCreados = [];
  for (const tecnico of tecnicos) {
    const user = await prisma.user.upsert({
      where: { email: tecnico.email },
      update: {},
      create: {
        email: tecnico.email,
        password: hashedPassword, // password: 'admin123'
        nombre: tecnico.nombre,
        apellido: tecnico.apellido,
        role: 'SUPPORT'
      }
    });
    tecnicosCreados.push(user);
    console.log('✅ Técnico creado:', user.email);
  }

  // Crear locales variados
  const localesData = [
    {
      sigla: 'NIU-01',
      nombreLocal: 'Niu Sushi Plaza Norte',
      direccion: 'Av. Américo Vespucio 1501',
      comuna: 'Huechuraba',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2345 6789',
      asignado: tecnicosCreados[0].email,
      marca: 'NIU_SUSHI',
      tipoLocal: 'Tradicional',
      dvrModelo: 'HIKVISION DS-7608NI',
      dvrCapacidadDisco: '4TB',
      dvrNumeroCamaras: '8',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    },
    {
      sigla: 'NIU-02',
      nombreLocal: 'Niu Sushi Las Condes',
      direccion: 'Av. Apoquindo 4500',
      comuna: 'Las Condes',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2400 5555',
      asignado: tecnicosCreados[0].email,
      marca: 'NIU_SUSHI',
      tipoLocal: 'Tradicional',
      dvrModelo: 'HIKVISION DS-7608NI',
      dvrCapacidadDisco: '4TB',
      dvrNumeroCamaras: '8',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    },
    {
      sigla: 'GUA-01',
      nombreLocal: 'Guacamole Providencia',
      direccion: 'Av. Providencia 2500',
      comuna: 'Providencia',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2987 6543',
      asignado: tecnicosCreados[1].email,
      marca: 'GUACAMOLE',
      tipoLocal: 'Express',
      dvrModelo: 'HIKVISION DS-7604NI',
      dvrCapacidadDisco: '2TB',
      dvrNumeroCamaras: '4',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    },
    {
      sigla: 'GUA-02',
      nombreLocal: 'Guacamole Ñuñoa',
      direccion: 'Av. Irarrázaval 3456',
      comuna: 'Ñuñoa',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2765 4321',
      asignado: tecnicosCreados[1].email,
      marca: 'GUACAMOLE',
      tipoLocal: 'Express',
      dvrModelo: 'HIKVISION DS-7604NI',
      dvrCapacidadDisco: '2TB',
      dvrNumeroCamaras: '4',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    },
    {
      sigla: 'PIZZA-01',
      nombreLocal: 'Pizzería Vitacura',
      direccion: 'Av. Vitacura 5678',
      comuna: 'Vitacura',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2200 8765',
      asignado: tecnicosCreados[2].email,
      marca: 'PIZZA_PLUS',
      tipoLocal: 'Tradicional',
      dvrModelo: 'HIKVISION DS-7608NI',
      dvrCapacidadDisco: '4TB',
      dvrNumeroCamaras: '8',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    },
    {
      sigla: 'PIZZA-02',
      nombreLocal: 'Pizzería Macul',
      direccion: 'Av. Macul 8765',
      comuna: 'Macul',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2555 9876',
      asignado: tecnicosCreados[3].email,
      marca: 'PIZZA_PLUS',
      tipoLocal: 'Tradicional',
      dvrModelo: 'HIKVISION DS-7604NI',
      dvrCapacidadDisco: '2TB',
      dvrNumeroCamaras: '4',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    },
    {
      sigla: 'BOWL-01',
      nombreLocal: 'Poke Bowl Centro',
      direccion: 'Calle Huérfanos 1234',
      comuna: 'Santiago',
      region: 'Metropolitana',
      pais: 'Chile',
      telefonoLocal: '+56 2 2666 1111',
      asignado: tecnicosCreados[4].email,
      marca: 'POKE_BOWL',
      tipoLocal: 'Express',
      dvrModelo: 'HIKVISION DS-7604NI',
      dvrCapacidadDisco: '2TB',
      dvrNumeroCamaras: '4',
      dvrUsuarioAdmin: 'admin',
      dvrUsuarioOperaciones: 'operador',
      dvrClaveAdmin: 'admin123',
      dvrClaveOperaciones: 'oper123'
    }
  ];

  for (const localData of localesData) {
    const tecnicoAsignado = tecnicosCreados.find(t => t.email === localData.asignado);
    await prisma.local.upsert({
      where: { sigla: localData.sigla },
      update: {},
      create: {
        ...localData,
        createdBy: tecnicoAsignado?.id || admin.id,
        updatedBy: tecnicoAsignado?.id || admin.id
      }
    });
  }

  console.log('✅ 7 locales creados y asignados a técnicos');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
