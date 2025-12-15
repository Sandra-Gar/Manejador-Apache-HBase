-- Script HBase para crear la tabla de usuarios
-- Ejecutar desde HBase shell: hbase shell < hbase-create-table.sql
-- O manualmente: hbase shell y copiar los comandos

-- Crear tabla 'users' con dos column families
-- info: información personal (name, age, created_at, updated_at)
-- contact: información de contacto (email, phone)
create 'users', 
  {NAME => 'info', VERSIONS => 5, COMPRESSION => 'SNAPPY', BLOOMFILTER => 'ROW'}, 
  {NAME => 'contact', VERSIONS => 5, COMPRESSION => 'SNAPPY', BLOOMFILTER => 'ROW'}

-- Verificar que la tabla fue creada
list

-- Ver detalles de la tabla
describe 'users'

-- Insertar datos de prueba
put 'users', 'user001', 'info:name', 'Juan Pérez'
put 'users', 'user001', 'info:age', '30'
put 'users', 'user001', 'contact:email', 'juan@example.com'
put 'users', 'user001', 'contact:phone', '+52-555-1234'

put 'users', 'user002', 'info:name', 'María García'
put 'users', 'user002', 'info:age', '28'
put 'users', 'user002', 'contact:email', 'maria@example.com'
put 'users', 'user002', 'contact:phone', '+52-555-5678'

-- Verificar datos insertados
get 'users', 'user001'
scan 'users'

-- Consultar versiones (time-series)
get 'users', 'user001', {VERSIONS => 5}

-- Contar registros
count 'users'

-- Notas:
-- VERSIONS => 5: Mantiene hasta 5 versiones de cada celda (útil para time-series)
-- COMPRESSION => 'SNAPPY': Compresión eficiente de datos
-- BLOOMFILTER => 'ROW': Optimiza búsquedas por row key
