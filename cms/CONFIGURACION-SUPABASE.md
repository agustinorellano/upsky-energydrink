# UP SKY CMS · puesta en marcha

Panel de administración para que el cliente edite **Catálogo**, **Para negocios** (precios por mayor y "Cómo funciona") y **Eventos**.
Es independiente del sitio: HTML estático + Supabase (base de datos, login e imágenes).

## 1. Crear el proyecto en Supabase
1. Crear una cuenta en supabase.com y un proyecto nuevo (región São Paulo, la más cercana a Argentina).
2. **SQL Editor**: pegar `schema.sql` (cambiando `CAMBIAR_EMAIL` por el email del cliente) y ejecutar.
3. **Authentication > Users > Add user**: crear el usuario con ese email y una contraseña fuerte. Marcar "Auto confirm".
4. **Authentication > Providers > Email**: desactivar "Allow new users to sign up" (nadie más puede registrarse).
5. **Project Settings > API**: copiar la URL y la clave *publishable/anon*. **No usar la clave secret/service_role.**

## 2. Configurar el panel
Completar `supabase-config.js` con la URL, la clave anon, el email del cliente y la URL del sitio.

## 3. Publicar el panel
Subirlo a Netlify o Vercel (carpeta `cms/` o repositorio `upsky-cms`) en una dirección aparte del sitio, por ejemplo `panel.upsky.com.ar`. Tiene `noindex`: no aparece en buscadores.

## 4. Seguridad
- Las políticas RLS (en `schema.sql`) dejan al público **solo leer** lo marcado como visible. Escribir exige iniciar sesión con el email del administrador.
- La clave anon es pública por diseño. La clave secret nunca va en el panel ni en el sitio.
- Cambiar la contraseña desde Supabase si se comparte con alguien.

## Datos que maneja cada sección (tabla `items`, columna `data`)
| Sección | Campos |
|---|---|
| `productos` | nombre, presentacion, tipo, precio, max_por_pedido, desc_desde_5, desc_desde_10, etiqueta, colores, destacado, descripcion, imagen_1..4 |
| `mayorista` | nombre, presentacion, unidades, precio, nota, imagen_1 |
| `pasos_negocios` | titulo, texto |
| `eventos` | nombre, categoria, lugar, fecha, hora, etiquetas, descripcion, imagen_1 |

El sitio lee con: `GET {URL}/rest/v1/items?section=eq.eventos&order=position` (cabecera `apikey` con la clave anon). Solo devuelve lo visible.
