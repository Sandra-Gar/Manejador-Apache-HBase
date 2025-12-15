#!/bin/bash

# Script de instalación y configuración de Apache HBase
# Este script instala HBase en modo standalone para desarrollo local

echo "================================================"
echo "Apache HBase - Script de Instalación"
echo "================================================"

# Variables de configuración
HBASE_VERSION="2.5.7"
INSTALL_DIR="$HOME/hbase"
HBASE_URL="https://downloads.apache.org/hbase/${HBASE_VERSION}/hbase-${HBASE_VERSION}-bin.tar.gz"

# Verificar Java
echo "Verificando Java..."
if ! command -v java &> /dev/null; then
    echo "❌ Java no está instalado. Por favor instala Java 8+ primero."
    echo "   Ubuntu/Debian: sudo apt install openjdk-11-jdk"
    echo "   Mac: brew install openjdk@11"
    exit 1
fi

java -version
echo "✅ Java encontrado"

# Crear directorio de instalación
echo ""
echo "Creando directorio de instalación: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR" || exit

# Descargar HBase
echo ""
echo "Descargando Apache HBase ${HBASE_VERSION}..."
if [ ! -f "hbase-${HBASE_VERSION}-bin.tar.gz" ]; then
    curl -O "$HBASE_URL"
    echo "✅ Descarga completada"
else
    echo "✅ Archivo ya existe, omitiendo descarga"
fi

# Extraer archivos
echo ""
echo "Extrayendo archivos..."
tar -xzf "hbase-${HBASE_VERSION}-bin.tar.gz"
echo "✅ Extracción completada"

# Configurar HBase
HBASE_HOME="$INSTALL_DIR/hbase-${HBASE_VERSION}"
cd "$HBASE_HOME" || exit

echo ""
echo "Configurando HBase..."

# Crear directorios necesarios
mkdir -p "$HBASE_HOME/data/hbase"
mkdir -p "$HBASE_HOME/data/zookeeper"

# Crear archivo de configuración hbase-site.xml
cat > conf/hbase-site.xml <<EOF
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>file://$HBASE_HOME/data/hbase</value>
  </property>
  <property>
    <name>hbase.zookeeper.property.dataDir</name>
    <value>$HBASE_HOME/data/zookeeper</value>
  </property>
  <property>
    <name>hbase.unsafe.stream.capability.enforce</name>
    <value>false</value>
  </property>
  <property>
    <name>hbase.cluster.distributed</name>
    <value>false</value>
  </property>
</configuration>
EOF

echo "✅ Configuración completada"

# Agregar variables de entorno
echo ""
echo "Agregando variables de entorno..."
cat >> ~/.bashrc <<EOF

# Apache HBase
export HBASE_HOME=$HBASE_HOME
export PATH=\$PATH:\$HBASE_HOME/bin
EOF

echo "✅ Variables de entorno agregadas a ~/.bashrc"

# Mostrar instrucciones
echo ""
echo "================================================"
echo "✅ Instalación completada exitosamente!"
echo "================================================"
echo ""
echo "Para iniciar HBase, ejecuta los siguientes comandos:"
echo ""
echo "1. Cargar variables de entorno:"
echo "   source ~/.bashrc"
echo ""
echo "2. Iniciar HBase:"
echo "   cd $HBASE_HOME"
echo "   ./bin/start-hbase.sh"
echo ""
echo "3. Verificar que HBase esté corriendo:"
echo "   jps"
echo "   # Deberías ver: HMaster"
echo ""
echo "4. Acceder a HBase Shell:"
echo "   ./bin/hbase shell"
echo ""
echo "5. Crear tabla de usuarios:"
echo "   En HBase shell, ejecuta:"
echo "   create 'users', {NAME => 'info', VERSIONS => 5}, {NAME => 'contact', VERSIONS => 5}"
echo ""
echo "6. Acceder a la UI web:"
echo "   http://localhost:16010"
echo ""
echo "Para detener HBase:"
echo "   ./bin/stop-hbase.sh"
echo ""
echo "================================================"
