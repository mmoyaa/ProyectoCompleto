# Modal de Lista de Pacientes - Componente Pagina1

## 📋 Descripción
Modal interactivo que muestra una tabla completa de todos los pacientes registrados en el sistema, incluyendo información de tutores y representantes.

## ✨ Características

### 🔍 **Información Mostrada**
- **ID del Paciente**
- **Nombre Completo** (nombre + apellidos)
- **RUT** (formato mono-espaciado)
- **Teléfono** (opcional)
- **Correo Electrónico** (opcional)
- **Tutor/Representante** (con badges de estado)
- **Fecha de Creación**

### 🏷️ **Sistema de Badges**
- **🟢 ADULTO**: Paciente sin tutor ni representante
- **🔵 TUTOR**: Paciente menor con tutor asignado
- **🟣 REPRESENTANTE**: Paciente con representante legal

### 📱 **Características Responsive**
- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Tabla adaptada con espaciado optimizado
- **Móvil**: Oculta columnas de teléfono y correo para mejor legibilidad

## 🚀 Funcionalidades

### **Botón "Ver Pacientes"**
- Icono de usuarios (👥)
- Abre el modal automáticamente
- Carga los datos al abrir

### **Modal Interactivo**
- **Cerrar**: Click en overlay, botón X, o botón "Cerrar"
- **Actualizar**: Botón para recargar la lista
- **Scroll**: Contenido desplazable si hay muchos pacientes

### **Estados del Modal**
1. **Cargando**: Spinner animado mientras se cargan los datos
2. **Con Datos**: Tabla completa con información
3. **Sin Datos**: Mensaje cuando no hay pacientes registrados

## 🛠️ Implementación Técnica

### **Endpoint Utilizado**
```
GET /api/pacientes/con-info-tutor
```

**Respuesta esperada:**
```json
[
  {
    "idPaciente": 1,
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "González",
    "rut": "12345678-9",
    "telefono": "+56912345678",
    "correo": "juan.perez@email.com",
    "direccion": "Av. Principal 123",
    "nacionalidad": "Chilena",
    "tutor": 0,
    "idTutor": null,
    "idRepresentante": 2,
    "fechaCreacion": "2025-08-04T02:00:00.000Z",
    "fechaModificacion": "2025-08-04T02:00:00.000Z",
    "nombreTutor": "Sin tutor",
    "correoTutor": null,
    "telefonoTutor": null,
    "direccionTutor": null,
    "nombreRepresentante": "Pedro López",
    "correoRepresentante": "pedro.lopez@email.com",
    "telefonoRepresentante": "+56911111111",
    "direccionRepresentante": "Av. Principal 123",
    "relacionRepresentante": "Padre"
  }
]
```

### **Métodos del Componente**

#### `abrirModalPacientes()`
- Abre el modal
- Inicia la carga de datos automáticamente

#### `cerrarModalPacientes()`
- Cierra el modal
- Limpia la lista de pacientes

#### `cargarListaPacientes()`
- Llama al servicio para obtener pacientes
- Maneja estados de loading y error

#### `formatearFecha(fecha: string)`
- Convierte fechas ISO a formato chileno (dd/mm/aaaa)

#### `formatearNombreCompleto(paciente: any)`
- Concatena nombre y apellidos
- Maneja casos donde faltan apellidos

## 🎨 Estilos y Diseño

### **Modal**
- **Overlay**: Fondo semi-transparente con blur
- **Container**: Bordes redondeados, sombra elevada
- **Animación**: Aparición suave desde el centro

### **Header**
- **Gradiente**: Azul a púrpura (consistente con el diseño)
- **Botón Cerrar**: Hover con fondo semi-transparente

### **Tabla**
- **Header Sticky**: Se mantiene visible al hacer scroll
- **Filas Alternadas**: Mejor legibilidad
- **Hover Effects**: Resalta la fila al pasar el mouse

### **Badges**
- **Tutor**: Azul (#17a2b8)
- **Representante**: Púrpura (#6f42c1)
- **Adulto**: Verde (#28a745)

## 📋 Casos de Uso

### **1. Consultar Lista Completa**
```typescript
// El usuario hace clic en "Ver Pacientes"
abrirModalPacientes() {
  this.mostrarModalPacientes = true;
  this.cargarListaPacientes();
}
```

### **2. Actualizar Información**
```typescript
// El usuario hace clic en "Actualizar"
cargarListaPacientes() {
  this.loadingPacientes = true;
  this.pacienteService.obtenerPacientesCompletos().subscribe(...)
}
```

### **3. Navegación por Teclado**
- **ESC**: Cierra el modal
- **Click en Overlay**: Cierra el modal
- **Scroll**: Navega por la tabla

## 🔧 Configuración

### **Servicio Requerido**
```typescript
// En paciente.service.ts
obtenerPacientesCompletos(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/pacientes/con-info-tutor`);
}
```

### **Variables del Componente**
```typescript
// Variables para el modal
mostrarModalPacientes = false;
listaPacientes: any[] = [];
loadingPacientes = false;
```

## 🎯 Ventajas

### **Para el Usuario**
- ✅ Vista rápida de todos los pacientes
- ✅ Información completa en un solo lugar
- ✅ Fácil identificación de tipos de pacientes
- ✅ Búsqueda visual por badges de color

### **Para el Desarrollador**
- ✅ Reutilizable en otros componentes
- ✅ Responsive y accesible
- ✅ Manejo robusto de errores
- ✅ Performance optimizada

## 📱 Responsive Breakpoints

### **Desktop (>768px)**
- Tabla completa con todas las columnas
- Botones horizontales en footer

### **Tablet (768px - 480px)**
- Tabla con espaciado reducido
- Botones en columna

### **Móvil (<480px)**
- Oculta columnas de teléfono y correo
- Modal ocupa 98% del ancho
- Tabla más compacta

## 🚨 Manejo de Errores

### **Error de Conexión**
```typescript
error: (error) => {
  console.error('Error al cargar pacientes:', error);
  this.loadingPacientes = false;
  this.mensaje = 'Error al cargar la lista de pacientes';
  this.tipoMensaje = 'error';
}
```

### **Sin Datos**
```html
<div *ngIf="!loadingPacientes && listaPacientes.length === 0" class="no-data">
  <p>No se encontraron pacientes registrados.</p>
</div>
```

## 🔮 Posibles Mejoras Futuras

1. **Paginación**: Para manejar grandes cantidades de datos
2. **Filtros**: Por tipo de paciente, fecha, etc.
3. **Búsqueda**: Campo de búsqueda por nombre o RUT
4. **Ordenamiento**: Click en headers para ordenar columnas
5. **Exportar**: Botón para exportar a CSV/PDF
6. **Edición Rápida**: Modal o drawer para editar paciente
7. **Eliminación**: Opción para eliminar pacientes

## 🧪 Testing

### **Casos de Prueba**
1. ✅ Modal se abre correctamente
2. ✅ Datos se cargan desde el endpoint
3. ✅ Tabla muestra información correcta
4. ✅ Badges se muestran según el tipo de paciente
5. ✅ Modal se cierra correctamente
6. ✅ Responsive funciona en diferentes tamaños
7. ✅ Manejo de errores funciona
8. ✅ Estado de loading se muestra

### **Comandos de Prueba**
```bash
# Probar endpoint desde terminal
Invoke-WebRequest -Uri "http://localhost:3000/api/pacientes/con-info-tutor" -Method GET

# Verificar respuesta JSON
curl http://localhost:3000/api/pacientes/con-info-tutor | jq '.'
```

¡El modal de pacientes está listo para usar! 🎉
