# Formulario de Pacientes con Representantes - Componente Pagina1

## Descripción
Este componente proporciona un formulario completo para agregar nuevos pacientes al sistema, con la opción de incluir un representante legal. Se conecta con el backend a través de múltiples endpoints especializados.

## Características

### Campos del Paciente
- **Nombre** (obligatorio): Máximo 100 caracteres
- **Apellido Paterno** (obligatorio): Máximo 100 caracteres  
- **Apellido Materno** (opcional): Máximo 100 caracteres
- **RUT** (obligatorio): Formato 12345678-9 o 1234567-K
- **Teléfono** (opcional): Formato internacional válido
- **Correo Electrónico** (opcional): Formato de email válido
- **Dirección** (opcional): Máximo 255 caracteres
- **Nacionalidad** (opcional): Por defecto "Chilena"

### Campos del Representante (Condicionales)
- **Checkbox "¿Tiene Representante?"**: Activa/desactiva el formulario del representante
- **Nombre del Representante** (obligatorio si está marcado): Máximo 100 caracteres
- **Apellido del Representante** (obligatorio si está marcado): Máximo 100 caracteres
- **RUT del Representante** (obligatorio si está marcado): Formato 12345678-9 o 1234567-K
- **Relación con el Paciente** (obligatorio si está marcado): Padre, Madre, Tutor Legal, etc.
- **Teléfono del Representante** (opcional): Formato internacional válido
- **Correo del Representante** (opcional): Formato de email válido
- **Dirección del Representante** (opcional): Máximo 255 caracteres
- **Nacionalidad del Representante** (opcional): Por defecto "Chilena"

### Validaciones
- Validación en tiempo real con mensajes de error específicos
- Formateo automático de RUT para paciente y representante
- Validación de formato de email y teléfono
- Validaciones condicionales según el checkbox de representante
- Campos obligatorios claramente marcados

### Funcionalidades
- **Guardar Paciente Solo**: Envía los datos al endpoint `/api/pacientes`
- **Guardar Paciente con Representante**: Envía los datos al endpoint `/api/pacientes/con-representante`
- **Probar Conexión**: Verifica la conectividad con el backend
- **Limpiar Formulario**: Resetea todos los campos y validaciones
- **Mensajes de Estado**: Muestra éxito o errores de forma clara
- **Formulario Dinámico**: El formulario del representante aparece/desaparece según el checkbox

## Estructura de Archivos

```
pagina1/
├── pagina1.component.ts      # Lógica del componente con manejo de representantes
├── pagina1.component.html    # Template del formulario dinámico
├── pagina1.component.css     # Estilos con checkbox personalizado
├── pagina1.component.spec.ts # Tests unitarios
└── README.md                 # Esta documentación
```

## Servicios Utilizados

### PacienteService
Ubicado en `src/app/services/paciente.service.ts`

**Métodos disponibles:**
- `crearPaciente(paciente: Paciente)`: Crea un paciente adulto sin representante
- `crearPacienteConRepresentante(pacienteConRepresentante: PacienteConRepresentante)`: Crea paciente con representante
- `crearRepresentante(representante: Representante)`: Crea solo un representante
- `crearPacienteSimple(datos)`: Crea un paciente con solo nombre y apellido
- `testConectividad(datos)`: Prueba la conexión con el backend
- `obtenerPacientes()`: Obtiene lista de pacientes (si existe el endpoint)

**Interfaces TypeScript:**
- `Paciente`: Datos básicos del paciente
- `Representante`: Datos del representante
- `PacienteConRepresentante`: Datos combinados paciente + representante
- `PacienteResponse`: Respuesta del servidor

## Uso

### Paciente Sin Representante
1. Navegar al componente pagina1
2. Completar campos del paciente (no marcar checkbox)
3. Hacer clic en "Guardar Paciente"

### Paciente Con Representante
1. Navegar al componente pagina1
2. Completar campos del paciente
3. **Marcar checkbox "¿Tiene Representante?"**
4. Completar campos del representante que aparecen
5. Hacer clic en "Guardar Paciente"

## Configuración del Backend

El componente espera que el backend esté corriendo en:
```
http://localhost:3000/api
```

### Endpoints Utilizados
- `POST /api/pacientes` - Crear paciente sin representante
- `POST /api/pacientes/con-representante` - Crear paciente con representante
- `POST /api/representantes` - Crear solo representante
- `POST /api/pacientes/test` - Probar conectividad

### Base de Datos
Se requieren las siguientes tablas (ejecutar script SQL):
```sql
-- Tabla representantes
-- Tabla paciente_representante (relación)
-- Modificación a tabla paciente (campo idRepresentante)
```

## Ejemplos de Datos

### Paciente Sin Representante
```json
{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "González",
  "rut": "12345678-9",
  "telefono": "+56912345678",
  "correo": "juan.perez@email.com",
  "direccion": "Av. Principal 123, Santiago",
  "nacionalidad": "Chilena"
}
```

### Paciente Con Representante
```json
{
  "nombre": "María",
  "apellidoPaterno": "López",
  "apellidoMaterno": "Silva",
  "rut": "98765432-1",
  "telefono": "+56987654321",
  "correo": "maria.lopez@email.com",
  "direccion": "Calle Secundaria 456, Valparaíso",
  "nacionalidad": "Chilena",
  "nombreRepresentante": "Pedro",
  "apellidoRepresentante": "López",
  "rutRepresentante": "11111111-1",
  "telefonoRepresentante": "+56911111111",
  "correoRepresentante": "pedro.lopez@email.com",
  "direccionRepresentante": "Calle Secundaria 456, Valparaíso",
  "relacionRepresentante": "Padre",
  "nacionalidadRepresentante": "Chilena"
}
```

## Respuestas del Backend

### Paciente Sin Representante (201 Created)
```json
{
  "message": "Paciente creado correctamente",
  "idPaciente": 123
}
```

### Paciente Con Representante (201 Created)
```json
{
  "message": "Paciente y representante creados correctamente",
  "idPaciente": 124,
  "idRepresentante": 45,
  "relacion": "Padre"
}
```

### Error (400/409/500)
```json
{
  "error": "Mensaje de error específico"
}
```

## Desarrollo

### Prerrequisitos
- Angular 15+
- HttpClientModule
- ReactiveFormsModule

### Instalación
1. Ejecutar script SQL para crear tablas de representantes
2. Asegurar que el backend esté funcionando
3. Los servicios y componentes ya están configurados

### Testing
1. **Test de Conectividad**: Hacer clic en "Probar Conexión"
2. **Test Paciente Solo**: Completar formulario sin marcar checkbox
3. **Test Paciente + Representante**: Marcar checkbox y completar ambos formularios

## Características Avanzadas

### Validaciones Dinámicas
- Las validaciones del representante se activan/desactivan automáticamente
- Formateo de RUT independiente para paciente y representante
- Mensajes de error específicos para cada campo

### Interfaz Adaptativa
- Checkbox personalizado con animaciones
- Formulario de representante aparece con animación suave
- Responsive design para dispositivos móviles

### Manejo de Errores
- Errores específicos del backend (RUT duplicado, campos faltantes)
- Validaciones en tiempo real
- Mensajes claros para el usuario

## Personalización

### Relaciones Disponibles
Puedes modificar las opciones de relación en el HTML:
- Padre/Madre
- Tutor Legal
- Apoderado
- Cónyuge
- Hijo/a
- Hermano/a
- Otro Familiar
- Representante Legal

### Estilos del Checkbox
El checkbox está completamente personalizado en CSS y puede modificarse fácilmente.

### Validaciones Adicionales
Para agregar validaciones personalizadas, modificar el método `actualizarValidacionesRepresentante()`.

## Troubleshooting

### Checkbox No Funciona
- Verificar que el FormControl 'tieneRepresentante' esté configurado
- Revisar el método `actualizarValidacionesRepresentante()`

### Formulario No Aparece
- Verificar la variable `tieneRepresentante` en el componente
- Revisar la directiva `*ngIf="tieneRepresentante"` en el HTML

### Errores de Validación
- Campos del representante solo son obligatorios si el checkbox está marcado
- Verificar que las validaciones condicionales estén funcionando

### Problemas con RUT
- Cada RUT (paciente y representante) se formatea independientemente
- Verificar el método `formatearRut(event, campo)`
