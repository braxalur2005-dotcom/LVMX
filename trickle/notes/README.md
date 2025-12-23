# Ligas Virtuales MX - Sistema de Gestión de Ligas de Fútbol

## Descripción del Proyecto
Plataforma web completa para gestión de ligas de fútbol virtuales con sistema profesional de competencia, simulación de partidos, y gestión de ascensos/descensos.

## Estructura del Sistema
- **6 Ligas** independientes
- **20 Equipos** por liga (120 equipos totales)
- **19 Jornadas** regulares por temporada
- **Sistema de Liguilla** con cuartos, semifinales y final
- **Ascensos y Descensos** automáticos

## Características Principales

### Para Usuarios
- Visualizar todas las ligas y equipos
- Consultar enfrentamientos de todas las 19 jornadas
- Ver resultados de jornadas jugadas
- Ver tabla de posiciones actualizada
- Revisar bracket de liguilla
- Acceder a información detallada de equipos
- Sistema de autenticación con registro e inicio de sesión

### Para Administradores
- Seleccionar temporada (Clausura/Apertura) y año
- Simular jornadas completas
- Gestionar nombres y logos de ligas
- Editar equipos (nombres, escudos y títulos)
- Configurar enfrentamientos del calendario
- Simular fases de liguilla por liga
- Reiniciar sistema completo
- Navegación persistente con sesión de administrador

## Páginas Principales
1. **index.html** - Página principal con selector de ligas
2. **league.html** - Vista detallada de liga con 5 pestañas
3. **admin.html** - Panel de administración (password: admin123)

## Tecnologías
- React 18
- TailwindCSS
- Lucide Icons
- LocalStorage para persistencia

## Sistema de Puntuación
- Victoria: 3 puntos
- Empate: 1 punto
- Derrota: 0 puntos

## Criterios de Desempate
1. Puntos totales
2. Diferencia de goles
3. Goles a favor