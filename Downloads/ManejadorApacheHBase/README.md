# Apache HBase - Demostración Práctica

## Descripción

Proyecto de demostración completa de Apache HBase que incluye todas las operaciones CRUD y funcionalidades avanzadas específicas de bases de datos de columnas anchas.

## Características Implementadas

### Operaciones CRUD
- **CREATE**: Inserción de datos con column families (PUT operation)
- **READ**: Consultas individuales (GET) y escaneo completo (SCAN)
- **UPDATE**: Actualización de datos existentes
- **DELETE**: Eliminación de registros

### Operaciones Avanzadas
- **Column Families**: Organización de datos en familias de columnas (info, contact)
- **Batch Operations**: Inserción múltiple para mejor rendimiento
- **Time-Series Data**: Versionado de datos con timestamps (MAX_VERSIONS)

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Base de Datos**: Apache HBase (simulado para demo)
- **API**: Next.js Route Handlers (REST API)

## Requisitos del Sistema

### Para desarrollo local:
- Node.js 18+ o superior
- npm, pnpm, o yarn
- Navegador web moderno

### Para producción con HBase real:
- Apache HBase 2.x instalado y configurado
- Java JDK 8+ (requerido por HBase)
- Hadoop (requerido por HBase)
- Zookeeper (para coordinación de HBase)

##  Instalación y Configuración

### Paso 1: Clonar el proyecto

\`\`\`bash
# Clonar repositorio
git clone <url-del-repositorio>
cd ManejadorApacheHBase

# Instalar dependencias
npm install
\`\`\`

### Paso 2: Ejecutar en modo desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en: `http://localhost:3000`

### Paso 3 (Opcional): Configurar HBase real

Para conectar a una instancia real de HBase, actualizar el archivo `lib/hbase-client.ts`:

\`\`\`typescript
// Instalar cliente HBase
npm install hbase-rpc-client

// O usar REST API
npm install axios
\`\`\`

#### Configuración de HBase local:

1. **Descargar HBase:**
\`\`\`bash
wget https://downloads.apache.org/hbase/2.5.7/hbase-2.5.7-bin.tar.gz
tar -xzf hbase-2.5.7-bin.tar.gz
cd hbase-2.5.7
\`\`\`

2. **Configurar hbase-site.xml:**
\`\`\`xml
<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>file:///home/user/hbase</value>
  </property>
  <property>
    <name>hbase.zookeeper.property.dataDir</name>
    <value>/home/user/zookeeper</value>
  </property>
</configuration>
\`\`\`

3. **Iniciar HBase:**
\`\`\`bash
./bin/start-hbase.sh
\`\`\`

4. **Crear tabla desde HBase Shell:**
\`\`\`bash
./bin/hbase shell

# Crear tabla con column families
create 'users', {NAME => 'info', VERSIONS => 5}, {NAME => 'contact', VERSIONS => 5}

# Verificar tabla
list
describe 'users'
\`\`\`

## 📖 Uso de la Aplicación

### Interfaz Web

La aplicación incluye una interfaz interactiva con tabs para cada operación:

1. **CREATE**: Insertar nuevos usuarios
   - Ingresa User ID, nombre y email
   - Los datos se organizan en column families

2. **READ**: Consultar usuarios
   - Buscar por ID específico o listar todos
   - Dos tipos de consultas: GET y SCAN

3. **UPDATE**: Actualizar información
   - Modifica nombre y/o email de usuarios existentes

4. **DELETE**: Eliminar usuarios
   - Eliminación por User ID

5. **BATCH**: Operaciones por lotes
   - Inserta 5 usuarios simultáneamente
   - Optimiza el rendimiento

6. **TIME SERIES**: Versionado de datos
   - Consulta versiones históricas
   - Demuestra capacidades time-series

### API REST Endpoints

#### Usuarios

\`\`\`bash
# GET - Listar todos los usuarios
curl http://localhost:3000/api/hbase/users

# GET - Obtener usuario específico
curl http://localhost:3000/api/hbase/users/user001

# POST - Crear usuario
curl -X POST http://localhost:3000/api/hbase/users \
  -H "Content-Type: application/json" \
  -d '{"userId":"user001","name":"Juan Pérez","email":"juan@example.com"}'

# PUT - Actualizar usuario
curl -X PUT http://localhost:3000/api/hbase/users \
  -H "Content-Type: application/json" \
  -d '{"userId":"user001","name":"Juan Carlos","email":"juanc@example.com"}'

# DELETE - Eliminar usuario
curl -X DELETE http://localhost:3000/api/hbase/users/user001
\`\`\`

#### Operaciones Avanzadas

\`\`\`bash
# GET - Batch operations
curl http://localhost:3000/api/hbase/batch

# GET - Time-series data
curl http://localhost:3000/api/hbase/timeseries
\`\`\`

## 🏗️ Arquitectura HBase

### Estructura de la Tabla

\`\`\`
Tabla: users
Row Key: userId (string)

Column Families:
├── info:
│   ├── name (string)
│   ├── age (string)
│   ├── created_at (timestamp)
│   └── updated_at (timestamp)
│
└── contact:
    ├── email (string)
    └── phone (string)
\`\`\`

### Conceptos Clave

1. **Row Key**: Identificador único, ordenado lexicográficamente
2. **Column Families**: Agrupación física de columnas
3. **Columns**: Columnas dentro de cada family (dinámicas)
4. **Timestamps**: Cada celda mantiene múltiples versiones
5. **Versioning**: Configurado con MAX_VERSIONS

## 📸 Capturas de Pantalla

### Pantalla Principal
- Interfaz con tabs para cada operación CRUD
- Diseño responsivo con Tailwind CSS
- Componentes shadcn/ui

### Operaciones CRUD
- Formularios interactivos para cada operación
- Resultados en formato JSON
- Feedback en tiempo real

### Operaciones Avanzadas
- Batch operations con 5 usuarios de prueba
- Time-series con visualización de versiones

## 🔧 Scripts y Comandos

### Comandos HBase Shell

\`\`\`bash
# Iniciar HBase shell
hbase shell

# Ver todas las tablas
list

# Describir tabla
describe 'users'

# Insertar datos
put 'users', 'user001', 'info:name', 'Juan Pérez'
put 'users', 'user001', 'contact:email', 'juan@example.com'

# Consultar datos
get 'users', 'user001'
scan 'users'

# Consultar versiones
get 'users', 'user001', {VERSIONS => 5}

# Eliminar datos
delete 'users', 'user001', 'info:name'
deleteall 'users', 'user001'

# Eliminar tabla
disable 'users'
drop 'users'
\`\`\`

## 🎓 Conceptos Avanzados Demostrados

### 1. Column Families
- Organización física de datos
- Compresión y configuración independiente
- Familias 'info' y 'contact' en el demo

### 2. Time-Series Capabilities
- Almacenamiento de múltiples versiones
- MAX_VERSIONS configurable
- Consultas históricas con timestamps

### 3. Batch Operations
- Reducción de round-trips al servidor
- Mejor rendimiento en escrituras masivas
- Mantiene consistencia ACID

## 📚 Recursos Adicionales

- [Apache HBase Documentation](https://hbase.apache.org/book.html)
- [HBase Architecture](https://hbase.apache.org/book.html#architecture)
- [HBase Shell Commands](https://hbase.apache.org/book.html#shell)
- [Column Family Design](https://hbase.apache.org/book.html#columnfamily)

## 🐛 Troubleshooting

### Problema: HBase no inicia
\`\`\`bash
# Verificar Java
java -version

# Verificar puertos
netstat -an | grep 16010
netstat -an | grep 2181

# Ver logs
tail -f logs/hbase-*.log
\`\`\`

### Problema: Conexión rechazada
- Verificar que HBase esté corriendo: `jps` (debe mostrar HMaster)
- Verificar configuración en hbase-site.xml
- Verificar Zookeeper: debe estar activo

## 📝 Notas de Implementación

- **Demo Mode**: Este proyecto usa una simulación en memoria para facilitar la demostración
- **Producción**: Para usar HBase real, implementar cliente usando hbase-rpc-client o REST API
- **Escalabilidad**: HBase está diseñado para manejar petabytes de datos distribuidos
- **Consistency**: HBase proporciona consistencia fuerte a nivel de row

## 👨‍💻 Desarrollo

### Estructura del proyecto

\`\`\`
├── app/
│   ├── api/
│   │   └── hbase/
│   │       ├── users/
│   │       │   ├── route.ts          # GET (all), POST, PUT
│   │       │   └── [id]/route.ts     # GET (one), DELETE
│   │       ├── batch/route.ts        # Batch operations
│   │       └── timeseries/route.ts   # Time-series queries
│   ├── page.tsx                      # UI principal
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── hbase-client.ts               # Cliente HBase
├── components/
│   └── ui/                           # Componentes shadcn/ui
└── README.md
\`\`\`

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## ✨ Autor

Proyecto de demostración académica para el curso de Bases de Datos NoSQL.
\`\`\`
