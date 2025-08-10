# 🏥 Hospital Médico - Sistema de Gestión Hospitalaria

## 📋 Descripción del Sistema

**Hospital Médico** es un sistema integral de gestión hospitalaria que permite administrar pacientes, servicios médicos, productos farmacéuticos, facturación y descargos médicos. El sistema implementa patrones de diseño avanzados y arquitectura REST para proporcionar una API robusta y escalable.

## 🎯 Funcionalidades Principales

### 👥 Gestión de Pacientes
- Registro y actualización de información personal
- Seguimiento del estado médico del paciente
- Aplicación de tratamientos médicos
- Sistema de estados del paciente con patrón State

### 🏥 Servicios Médicos
- Catálogo de servicios médicos especializados
- Gestión de tratamientos y procedimientos
- Control de estados de servicios

### 💊 Gestión de Productos
- Inventario de productos farmacéuticos
- Control de stock y descargos
- Trazabilidad de productos médicos

### 📊 Facturación y Contabilidad
- Generación de facturas médicas
- Documentos contables
- Líneas de transacción
- Sistema de descargos

## 🏗️ Arquitectura del Sistema

### Backend (Spring Boot)
- **Framework**: Spring Boot 2.3.0
- **Java Version**: 11+
- **Base de Datos**: SQLite con Hibernate JPA
- **Arquitectura**: REST API con controladores, servicios y repositorios
- **Patrones de Diseño**: State Pattern, Repository Pattern, Service Layer

### Frontend (React)
- **Framework**: React 18.2.0
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Estilos**: Emotion (CSS-in-JS)

## 🛠️ Tecnologías Utilizadas

### Backend
- **Spring Boot Starter Web**: Servicios web REST
- **Spring Boot Starter Data JPA**: Persistencia de datos
- **Spring Security Core**: Seguridad básica
- **Hibernate**: ORM para base de datos
- **SQLite**: Base de datos ligera
- **SpringDoc OpenAPI**: Documentación de API
- **Jackson**: Serialización JSON
- **BouncyCastle**: Criptografía

### Frontend
- **React**: Biblioteca de interfaz de usuario
- **Material-UI**: Componentes de diseño
- **React Router**: Navegación entre páginas
- **Axios**: Cliente HTTP
- **Date-fns**: Manipulación de fechas

### Base de Datos
- **SQLite**: Base de datos relacional embebida
- **Hibernate Dialect**: Configuración específica para SQLite

## 🚀 Instalación y Configuración

### Prerrequisitos
- Java 11 o superior
- Node.js 16+ (para el frontend)
- Maven 3.6+

### Backend
1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Hospital_Medico
   ```

2. **Configurar la base de datos**
   - El sistema usa SQLite por defecto
   - La base de datos se crea automáticamente en `mydb.sqlite`
   - Configuración en `src/main/resources/application.properties`

3. **Ejecutar la aplicación**
   ```bash
   # Windows
   mvnw.cmd spring-boot:run
   
   # Unix/Linux/Mac
   ./mvnw spring-boot:run
   ```

4. **Acceder a la API**
   - URL: `http://localhost:8080`
   - Documentación Swagger: `http://localhost:8080/swagger-ui.html`

### Frontend
1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

3. **Acceder a la aplicación**
   - URL: `http://localhost:3000`

## 📚 Estructura del Proyecto

```
Hospital_Medico/
├── src/main/java/com/example/demo/
│   ├── controllers/          # Controladores REST
│   ├── models/              # Entidades JPA
│   ├── repositories/        # Repositorios de datos
│   ├── services/           # Lógica de negocio
│   └── config/             # Configuraciones
├── src/main/resources/      # Recursos y configuración
├── frontend/               # Aplicación React
│   ├── src/               # Código fuente React
│   └── public/            # Archivos estáticos
└── pom.xml                # Configuración Maven
```

## 🔌 Endpoints de la API

### Pacientes
- `GET /api/pacientes` - Obtener todos los pacientes
- `POST /api/pacientes` - Crear nuevo paciente
- `PUT /api/pacientes/{id}` - Actualizar paciente
- `DELETE /api/pacientes/{id}` - Eliminar paciente

### Servicios Médicos
- `GET /api/servicios-medicos` - Listar servicios
- `POST /api/servicios-medicos` - Crear servicio
- `PUT /api/servicios-medicos/{id}` - Actualizar servicio

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto

### Facturación
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `GET /api/descargos` - Listar descargos

## 🎨 Características del Frontend

- **Interfaz moderna** con Material-UI
- **Responsive design** para diferentes dispositivos
- **Navegación intuitiva** con React Router
- **Tablas de datos** con MUI Data Grid
- **Selectores de fecha** para fechas médicas
- **Formularios validados** para entrada de datos

## 🔒 Seguridad

- Spring Security Core integrado
- Criptografía con BouncyCastle
- Validación de entrada en frontend y backend
- Autenticación y autorización configurable

## 📖 Patrones de Diseño Implementados

- **State Pattern**: Para manejo de estados de pacientes
- **Repository Pattern**: Para acceso a datos
- **Service Layer**: Para lógica de negocio
- **DTO Pattern**: Para transferencia de datos
- **MVC Pattern**: Separación de responsabilidades

## 🚀 Despliegue

### Producción
- **Backend**: JAR ejecutable con `mvn clean package`
- **Frontend**: Build optimizado con `npm run build`
- **Base de datos**: SQLite portable o migrar a MySQL/PostgreSQL

### Docker (Recomendado)
```bash
# Backend
docker build -t hospital-medico-backend .
docker run -p 8080:8080 hospital-medico-backend

# Frontend
cd frontend
docker build -t hospital-medico-frontend .
docker run -p 3000:3000 hospital-medico-frontend
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de la API

---

**Desarrollado con ❤️ para la gestión hospitalaria moderna**






