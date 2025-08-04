# Formulario de Pacientes - Componente Pagina1

## Descripción
Este componente proporciona un formulario completo para agregar nuevos pacientes al sistema. Se conecta con el backend a través del endpoint `POST /api/pacientes`.

## Características

### Campos del Formulario
- **Nombre** (obligatorio): Máximo 100 caracteres
- **Apellido Paterno** (obligatorio): Máximo 100 caracteres  
- **Apellido Materno** (opcional): Máximo 100 caracteres
- **RUT** (obligatorio): Formato 12345678-9 o 1234567-K
- **Teléfono** (opcional): Formato internacional válido
- **Correo Electrónico** (opcional): Formato de email válido
- **Dirección** (opcional): Máximo 255 caracteres
- **Nacionalidad** (opcional): Por defecto "Chilena"

### Validaciones
- Validación en tiempo real con mensajes de error específicos
- Formateo automático del RUT mientras el usuario escribe
- Validación de formato de email y teléfono
- Campos obligatorios claramente marcados

### Funcionalidades
- **Guardar Paciente**: Envía los datos al endpoint `/api/pacientes`
- **Probar Conexión**: Verifica la conectividad con el backend
- **Limpiar Formulario**: Resetea todos los campos
- **Mensajes de Estado**: Muestra éxito o errores de forma clara

## Estructura de Archivos

```
pagina1/
├── pagina1.component.ts      # Lógica del componente
├── pagina1.component.html    # Template del formulario
├── pagina1.component.css     # Estilos del formulario
└── pagina1.component.spec.ts # Tests unitarios
```

## Servicios Utilizados

### PacienteService
Ubicado en `src/app/services/paciente.service.ts`

Métodos disponibles:
- `crearPaciente(paciente: Paciente)`: Crea un paciente adulto
- `crearPacienteSimple(datos)`: Crea un paciente con solo nombre y apellido
- `testConectividad(datos)`: Prueba la conexión con el backend
- `obtenerPacientes()`: Obtiene lista de pacientes (si existe el endpoint)

## Uso

1. **Navegación**: Ir al componente pagina1 en la aplicación
2. **Completar Formulario**: Llenar los campos obligatorios (marcados con *)
3. **Validación**: Los errores se muestran en tiempo real
4. **Envío**: Hacer clic en "Guardar Paciente"
5. **Confirmación**: El sistema mostrará un mensaje de éxito o error

## Configuración del Backend

El componente espera que el backend esté corriendo en:
```
http://localhost:3000/api
```

### Endpoints Utilizados
- `POST /api/pacientes` - Crear paciente completo
- `POST /api/pacientes/test` - Probar conectividad

## Ejemplo de Datos Enviados

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

## Respuesta Esperada del Backend

### Éxito (201 Created)
```json
{
  "message": "Paciente creado correctamente",
  "idPaciente": 123
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
Los servicios y componentes ya están configurados. Solo asegúrate de que el backend esté funcionando.

### Testing
Para probar la conectividad:
1. Hacer clic en "Probar Conexión"
2. Verificar la respuesta en la consola del navegador
3. Verificar que aparezca el mensaje de éxito

## Personalización

### Estilos
Los estilos están en `pagina1.component.css` y son completamente personalizables.

### Validaciones
Las validaciones se pueden modificar en el método `initializeForm()` del componente.

### Campos Adicionales
Para agregar nuevos campos:
1. Actualizar la interfaz `Paciente` en el servicio
2. Agregar el campo al FormGroup
3. Agregar el campo al template HTML
4. Actualizar las validaciones si es necesario

## Troubleshooting

### Error de Conexión
- Verificar que el backend esté corriendo en el puerto 3000
- Verificar que no haya problemas de CORS
- Revisar la consola del navegador para errores de red

### Errores de Validación
- Los mensajes de error se muestran debajo de cada campo
- Verificar que el formato del RUT sea correcto
- Verificar que los campos obligatorios estén completos

### Problemas de Estilo
- Los estilos están diseñados para ser responsivos
- En dispositivos móviles, el formulario se adapta a una columna
- Verificar que no hay conflictos con otros CSS globales
