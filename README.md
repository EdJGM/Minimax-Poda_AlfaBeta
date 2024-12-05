# Minimax Y Poda Alfa-Beta Visualizador

Minimax  Y Poda Alfa-Beta Visualizador es una herramienta diseñada para poder visualizar y comprender mejor los algoritmos de Minimax y Poda Alfa-Beta.

## Cómo Usar

1. **Crear un Árbol**:
   - Puedes hacer clic en los nodos y usar el menú resultante para cambiar sus valores o agregar/eliminar hijos.
   - Alternativamente, ve a `Ver Ejemplo` y selecciona una de las opciones para cargar un árbol de ejemplo.

2. **Ejecutar Algoritmos**:
   - Una vez que todos los nodos hoja tengan valores asignados, selecciona `Ejecutar` para ver `Minimax` o `Poda Alfa-Beta`.
   - Puedes controlar la velocidad y presionar `Pausa`/`Reproducir` para detener o reanudar la animación.
   - Usa los dos botones internos, o las teclas de flecha izquierda/derecha, para moverte hacia adelante o hacia atrás paso a paso.
   - Usa los dos botones externos para saltar al inicio o al final.

4. **Editar el Árbol**:
   - Una vez que hayas terminado de animar, ve a `Editar`.
   - Selecciona `Limpiar Padres` si deseas editar el árbol. Esto borrará cualquier cambio hecho por la animación y mostrará el árbol en su forma original.

## Características

### Animaciones

- **Nodos**:
  - Consulta la clave en la esquina superior derecha para aprender las representaciones simbólicas de los nodos.
  - Un nodo delineado en negro indica que no ha sido buscado.
  - Un nodo resaltado en rojo indica que está siendo buscado/actualizado.
  - Un nodo delineado en rojo indica que está siendo evaluado y espera una actualización de uno de sus subárboles.
  - Un nodo delineado en azul indica que ya ha sido buscado y contendrá su valor asignado.

- **Aristas**:
  - Una arista negra indica que no ha sido recorrida.
  - Una arista roja indica que ha sido recorrida hacia abajo, pero no hacia arriba.
  - Una arista azul indica que ha sido recorrida en ambos sentidos.

- **Poda Alfa-Beta**:
  - Cuando se recorre una arista, se etiqueta con el intervalo *(α, β)* que se pasa originalmente.
  - Un intervalo resaltado en azul indica que se está comparando con un valor.
  - Cuando un nodo recibe una actualización, su acción se indica mediante la celda resaltada de la tabla en la esquina superior izquierda.
  - Una vez que un nodo ha sido podado, su valor está precedido por "≥" si es un nodo Maxie, y "≤" si es un nodo Minnie. Esto indica un límite en el valor del nodo si se realizara una búsqueda completa de minimax.
  - Un nodo con fuente gris o interior claro indica que ha sido descartado como resultado de la poda.
  - Una arista gris indica que ha sido descartada como resultado de la poda.
  - Una arista gris cortada indica que su nodo inferior ha sido podado y el subárbol correspondiente ha sido descartado.


## Archivos Principales

### index.html

Este archivo contiene la estructura HTML de la página, incluyendo el menú de navegación, el área de dibujo del árbol y los controles para la animación.

### style.css

Este archivo contiene los estilos CSS para la página, incluyendo la apariencia del menú de navegación, las tablas y otros elementos de la interfaz de usuario.

### tree.js

Este archivo contiene la lógica para la creación y manipulación de los nodos del árbol, incluyendo la representación gráfica de los nodos y las aristas.

### animations.js

Este archivo contiene la lógica para la animación de los algoritmos de Minimax y poda alfa-beta, incluyendo la gestión de los pasos de la animación y los controles de reproducción.

### utilities.js

Este archivo contiene funciones auxiliares para la manipulación del árbol y la interfaz de usuario, incluyendo la carga y guardado de árboles, y la gestión de eventos.

### parserSML.js y parsertree.js

Estos archivos contienen los analizadores sintácticos generados por PEG.js para interpretar las representaciones textuales de los árboles y convertirlas en estructuras de datos utilizables por la aplicación.

## Enlaces

- [GitHub Pages Link](https://github.com/EdJGM/Minimax-Poda_AlfaBeta.git/)

Construido con HTML, CSS, JavaScript.
