# ---- 1 portada
N[0]+=1
slides.append(f'''<section class="slide" style="display:flex;flex-direction:column;justify-content:center;padding:0 120px">
<div class="tag" style="margin-bottom:40px"><span>UP SKY Energy Drink · <b>Entregable de funcionalidades</b></span></div>
<h2 style="font-size:104px;line-height:.98;margin-bottom:26px">Todo lo que<br>tiene tu <span>web</span></h2>
<p style="color:#b4b4bd;font-size:24px;max-width:980px;line-height:1.5">Recorrido por cada sección del sitio: qué hace, cómo se usa y qué puede ver o hacer quien lo visita. Pensado para que ninguna función pase desapercibida.</p>
<img src="logo.png" style="height:84px;position:absolute;right:120px;top:80px">
<div class="foot"><span>PROTOTIPO · VERSIÓN DE REVISIÓN</span><span>NOVIEMBRE 2026 · 01</span></div></section>''')
# ---- 2 mapa
def c(k,t,p,pk=0,b=''): return f'<div class="card{" pk" if pk else ""}"><span class="k">{k}</span><h4>{t}{b}</h4><p>{p}</p></div>'
add(top('Mapa del sitio')+'<h2>Mapa del <span>sitio</span></h2><p class="sub">Seis áreas pensadas para el recorrido de compra, más dos herramientas que acompañan en todas las páginas.</p><div class="grid" style="grid-template-columns:repeat(4,1fr)">'+
 c('01','Inicio','Hero con la botella en 3D, productos destacados con compra directa, comunidad en video y preguntas frecuentes.')+
 c('02','Producto','Historia, fórmula e información de la bebida.',0,'<span class="badge">En desarrollo</span>')+
 c('03','Catálogo','Banner con compra rápida y grilla de productos con descuentos por cantidad.')+
 c('04','Eventos','Carrusel de eventos, agenda y una página propia por evento (6 en total).')+
 c('05','Para negocios','Compra mayorista primero: 30 packs o pallet completo. Después, cómo funciona.')+
 c('06','Carrito','Panel lateral con descuentos automáticos, datos de envío y pedido por WhatsApp.',1)+
 c('07','Asistente UP SKY','Chat guiado que responde preguntas, muestra precios y suma productos al carrito.',1)+
 c('08','Funciones transversales','Menú, botón de WhatsApp, compartir, animaciones y accesibilidad.',1)+'</div>','Mapa del sitio')
# ---- home
desk('Inicio','Inicio · <span>primera impresión</span>','Lo primero que ve quien entra: la promesa de la marca, la botella protagonista y el camino directo a comprar.','home-hero-d','home-hero-d','upsky.com.ar',[
('nav','Menú de navegación','Fijo arriba, con Inicio, Producto, Catálogo, Eventos y Para negocios. Se resalta la página actual.','tr',4),
('cta','Pedir por WhatsApp','Abre el chat con el mensaje de pedido ya escrito. Está en todas las páginas.','tl'),
('title','Título del hero','“Más energía para tu día”, con acento de color en la segunda línea.','tl'),
('photo','Foto interactiva','La imagen principal acompaña al mouse en escritorio. En celular se mueve sola y también responde al dedo.','tl',0),
('btns','Botones principales','“Comprá ahora” lleva al catálogo. “Conocé más” lleva a la página de producto.','tl'),
('cue','Indicador “Ver productos”','Invita a seguir bajando y lleva a los productos destacados.','tr'),
('bot','Asistente UP SKY','Botón fijo para abrir el chat de ayuda desde cualquier página.','tl')],'Inicio')
desk('Inicio','Productos <span>destacados</span>','Una muestra del catálogo dentro del inicio, con compra directa sin cambiar de página.','home-feat-d','home-feat-d','upsky.com.ar/#formatos',[
('pack','Pack de 6 botellas','Cantidad y “Agregar al carrito” en la misma card. El contador del menú sube al instante.','tl',0),
('vaso','Vaso con fotos','Galería de fotos que avanza sola, con flecha para cambiar manualmente.','tl',0),
('color','Selector de color','Negro o rosa: al elegir, cambia la foto y el producto que va al carrito.','tr'),
('remera','Remera','Fotos de frente y espalda, para ver el producto completo.','tl',0),
('more','Card “Ver todo el catálogo”','Lleva a la grilla completa, con remeras, más packs y precios por mayor.','tl',0),
('arrow','Flechas del carrusel','Permiten desplazar las cards cuando hay más productos que lugar en pantalla.','tr')],'Inicio')
desk('Inicio','Comunidad <span>UP SKY</span>','Videos de quienes toman UP SKY, para que la marca se vea viva y en uso.','home-comm-d','home-comm-d','upsky.com.ar/#lifestyle',[
('title','Título y presentación','Invita a sumarse a la comunidad con el hashtag de la marca.','tl'),
('tag','Hashtag copiable','Un toque copia el hashtag para usarlo al publicar (el valor final está pendiente de definir).','tr'),
('car','Carrusel de videos','Los videos del centro se reproducen y los laterales quedan en pausa, para que la página siga fluida. Se pasan con flechas o con el dedo.','tl',0),
('foot','Botón de Instagram','Lleva al perfil oficial de la marca.','tl')],'Inicio')
desk('Inicio','Preguntas <span>frecuentes</span>','Las dudas más comunes se responden sin salir del inicio.','home-faq-d','home-faq-d','upsky.com.ar/#faq-home',[
('title','Título','Presentación de la sección.','tl'),
('btn','“Ver todas las preguntas”','Lleva a la sección completa dentro de la página de producto.','tl'),
('list','Listado desplegable','Seis preguntas que se abren y cierran con un toque: alcohol, café, colorantes, beneficios, vidrio y dónde comprar.','tl',0)],'Inicio')
phones('Inicio','Inicio en <span>celular</span>','Misma estructura, reordenada para el pulgar: foto entre el texto y los botones, cards deslizables y botones a ancho completo.',[
('home-hero-m','home-hero-m','01 · Hero',[('title','Título','Mensaje principal en pantalla completa.'),('photo','Foto animada','Se mueve sola y reacciona al dedo.','tl',0),('btns','Botones','A ancho completo, fáciles de tocar.'),('bot','Asistente','Siempre disponible abajo a la derecha.')]),
('home-feat-m','home-feat-m','02 · Destacados',[('title','Título','Sección clara, para alternar con el fondo oscuro.'),('card','Card deslizable','Se pasan con el dedo, con compra en cada una.','tl',0),('bar','Ver todo el catálogo','Barra al final que lleva a la grilla completa.')]),
('home-comm-m','home-comm-m','03 · Comunidad',[('title','Título','Invitación a sumarse.'),('tag','Hashtag','Se copia con un toque.'),('car','Videos','Se deslizan de costado y solo se reproducen los del centro.','tl',0)])])
# ---- catálogo
desk('Catálogo','Catálogo · <span>banner y compra rápida</span>','Para quien ya sabe lo que quiere: puede comprar el producto estrella sin bajar a la grilla.','cat-d','cat-d','upsky.com.ar/catalogo',[
('nav','Menú con carrito','El carrito muestra la cantidad de productos agregados.','tr',4),
('title','Banner de la página','Mismo componente que usan Eventos y Para negocios, para mantener una sola identidad.','tl'),
('cta','Pedir por WhatsApp','Pedido directo, con el mensaje armado.','tl'),
('quick','Compra rápida','Foto, precio, cantidad y “Agregar al carrito” del pack de 6, a la vista apenas se entra.','tr',0)],'Catálogo')
desk('Catálogo','Catálogo · <span>productos y descuentos</span>','Cada card muestra precio sin envío y los descuentos por cantidad, que se aplican solos en el carrito.','cat-grid-d','cat-grid-d','upsky.com.ar/catalogo#productos',[
('pack','Pack de 6 botellas','$14.500. 5% OFF desde 5 packs, máximo 10 por pedido.','tl',0),
('vaso','Vaso UP SKY','$3.200. 5% OFF desde 5 y 10% OFF desde 10. Fotos con avance automático.','tl',0),
('color','Selector de color','Negro o rosa, con la foto correspondiente.','tr'),
('remera','Remera UP SKY','$36.500. 3% OFF desde 5 y 6% OFF desde 10. Fotos de frente y espalda que se arrastran.','tl',0),
('tiers','Escalas de descuento','Se leen en cada card antes de comprar; no hace falta calcular nada.','tl'),
('share','Compartir','Cada card se puede compartir con un toque, por ejemplo por WhatsApp.','tr')],'Catálogo')
phones('Catálogo','Catálogo en <span>celular</span>','Banner con compra rápida arriba y productos en cards compactas, con los mismos descuentos visibles.',[
('cat-m','cat-m','01 · Banner',[('title','Título','Mismo banner, ajustado al ancho.'),('cta','Pedir por WhatsApp','Botón a ancho completo.'),('quick','Compra rápida','Versión compacta del widget.','tl',0)]),
('cat-grid-m','cat-grid-m','02 · Productos',[('card','Card de producto','Foto, nombre, precio, cantidad y botón en la misma card.','tl',0),('tiers','Descuentos','Escalas visibles antes de agregar.')])],PW=330)
# ---- eventos
desk('Eventos','Eventos · <span>carrusel principal</span>','Contenido de demostración: los eventos, fechas y portadas reales se cargan cuando el cliente los defina.','ev-d','ev-d','upsky.com.ar/eventos',[
('title','Título','Invita a sumarse y a enterarse de las próximas fechas.','tl'),
('car','Carrusel de eventos','Las tarjetas se deslizan, la del centro se destaca y muestra fecha, lugar, etiquetas y “Ver evento”.','tl',0),
('prev','Flecha anterior','Cambia al evento anterior. También se puede deslizar con el dedo.','tr'),
('next','Flecha siguiente','Avanza al próximo evento.','tl')],'Eventos')
desk('Eventos','Eventos · <span>agenda</span>','Todos los eventos juntos, en un tablero con tarjetas de distinto tamaño.','ev-ag-d','ev-ag-d','upsky.com.ar/eventos#agenda',[
('title','Título de agenda','“Próximos eventos”.','tl'),
('feat','Tarjeta destacada','La primera es más grande. Muestra número, fecha, lugar y descripción.','tl',0),
('share','Compartir evento','Cada evento tiene su botón para compartirlo.','tr'),
('grid','Tablero de eventos','Cada tarjeta lleva a la página del evento.','tl',0)],'Eventos')
desk('Eventos','Página de <span>cada evento</span>','Cada evento tiene su propia página, lista para compartir por link. Hay 6 páginas de demostración.','evp-d','evp-d','upsky.com.ar/evento-noche-up-sky',[
('title','Información del evento','Nombre, fecha, lugar, descripción y etiquetas.','tl'),
('share','Compartir','Copia o comparte el link del evento.','tr')],'Eventos')
# ---- negocios
desk('Para negocios','Para negocios · <span>banner</span>','Pensada para comercios y distribuidores: la compra va primero y la explicación después.','neg-d','neg-d','upsky.com.ar/negocios',[
('title','Título','Propuesta directa para quien quiere vender UP SKY.','tl'),
('cta','“Ver precios y comprar”','Baja directo a los precios por mayor.','tl')],'Para negocios')
desk('Para negocios','Para negocios · <span>compra mayorista</span>','Dos formatos de volumen, con compra directa al carrito.','neg-buy-d','neg-buy-d','upsky.com.ar/negocios#mayorista',[
('c30','30 packs','$388.500 por 30 packs de 6 botellas.','tl',0),
('pallet','Pallet completo','$2.304.000 por 192 packs. La foto del pallet está pendiente de recibir.','tl',0),
('note','Condiciones','Pago por transferencia bancaria y precios sin envío.','tl')],'Para negocios')
desk('Para negocios','Para negocios · <span>cómo funciona</span>','Cuatro pasos para que el proceso se entienda de un vistazo.','neg-how-d','neg-how-d','upsky.com.ar/negocios#ya-podes',[
('title','“Comprar es simple.”','Título claro y breve.','tl'),
('steps','Cuatro pasos','Elegir volumen, agregar al carrito, completar datos y coordinar por WhatsApp.','tl',0),
('foot','Cierre','Nota final con el contacto para dudas.','tl')],'Para negocios')
phones('Eventos y negocios','Eventos y negocios en <span>celular</span>','Mismas secciones, con tarjetas apiladas y botones grandes.',[
('ev-m','ev-m','01 · Eventos',[('title','Título','Mismo banner claro de Eventos.'),('car','Carrusel','Se desliza con el dedo.','tl',0)]),
('neg-m','neg-m','02 · Negocios',[('title','Título','Propuesta para comercios.'),('cta','Ver precios y comprar','Baja a la compra mayorista.')]),
('neg-buy-m','neg-buy-m','03 · Compra mayorista',[('c30','Card de volumen','Precio, descripción y agregar al carrito.','tl',0)])])
# ---- carrito y asistente
desk('Carrito','Carrito de <span>compra</span>','Panel lateral disponible en todas las páginas. Guarda el pedido aunque se cierre el navegador.','cart-d','cart-d','upsky.com.ar/catalogo',[
('head','Encabezado','Título y botón para cerrar el panel.','tl'),
('items','Productos agregados','Cantidad editable, precio unitario, descuento aplicado automáticamente y opción de quitar.','tl',0),
('more','“Sumar productos”','Vuelve al catálogo para seguir eligiendo.','tl'),
('total','Total','Se actualiza con cada cambio.','tl'),
('form','Datos de envío','Nombre, dirección, localidad y código postal.','tl'),
('btn','Finalizar por WhatsApp','Arma el pedido completo y abre el chat con todo escrito.','tl')],'Carrito')
desk('Asistente UP SKY','Asistente <span>UP SKY</span>','Chat guiado, sin inteligencia artificial: responde con contenido definido por la marca y siempre ofrece hablar con una persona.','bot-d','bot-d','upsky.com.ar/catalogo',[
('head','Encabezado','Identifica al asistente, permite reiniciar la conversación y cerrarla.','tl'),
('log','Conversación','Responde consultas y muestra los precios con foto, descuento y botón para sumar al carrito.','tl',0),
('chips','Opciones rápidas','Atajos para continuar sin escribir, como “Quiero pedir” o “Precios por mayor”.','tl'),
('form','Escribir una consulta','También entiende preguntas escritas con sus propias palabras.','tl'),
('human','Hablar con una persona','Pasa a WhatsApp con el contexto del carrito ya escrito.','tl')],'Asistente UP SKY')
phones('Carrito y asistente','Carrito y asistente en <span>celular</span>','Ocupan la pantalla completa para trabajar cómodo con el pulgar.',[
('cart-empty-m','cart-empty-m','01 · Carrito vacío',[('plus','Botón “+”','Lleva al catálogo para sumar productos.'),('title','Mensaje','Explica qué hacer cuando todavía no hay nada.'),('cta','Ver el catálogo','Acción directa.')]),
('bot-m','bot-m','02 · Asistente',[('head','Encabezado','Reiniciar y cerrar siempre a mano.'),('log','Respuesta','Contesta y guía el siguiente paso.','tl',0),('chips','Opciones','Se acomodan en líneas, sin scroll lateral.'),('human','Persona por WhatsApp','Alternativa siempre visible.')])],PW=300)
# ---- transversales
add(top('Funciones transversales')+'<h2>Funciones <span>transversales</span></h2><p class="sub">Presentes en todas las páginas. Cuidan la experiencia aunque nadie las nombre.</p><div class="grid" style="grid-template-columns:repeat(3,1fr)">'+
 c('Compra','Pedir por WhatsApp','Botón en el menú con el mensaje de pedido ya escrito. En celular, el menú se abre en un panel con las mismas opciones.',1)+
 c('Compra','Descuentos automáticos','Las escalas por cantidad se calculan solas en el carrito, y el máximo por pedido se respeta.')+
 c('Compra','Pedido recordado','El carrito se guarda en el navegador, así quien vuelve más tarde no pierde lo que había elegido.')+
 c('Compartir','Compartir por card y por evento','Un toque comparte el link del producto o del evento, o lo copia si el dispositivo no tiene menú de compartir.',1)+
 c('Atención','Asistente y WhatsApp','Conviven: el asistente resuelve lo común y siempre ofrece derivar a una persona.')+
 c('Atención','Aviso de WhatsApp','Un aviso discreto invita a pedir por WhatsApp; al tocarlo abre el asistente. Hoy está desactivado y se puede reactivar.')+
 c('Experiencia','Animaciones suaves','Entradas, flechas animadas, conteos y carruseles. Pensadas para destacar sin entorpecer.',1)+
 c('Experiencia','Rendimiento','Videos livianos y pausa automática de lo que no se ve, para que el sitio responda rápido en celular.')+
 c('Accesibilidad','Reducir movimiento','Si el dispositivo lo pide, las animaciones se reducen. Los botones tienen nombre para lectores de pantalla.')+'</div>','Funciones transversales')
# ---- pendientes
add(top('Pendientes y próximos pasos')+'<h2>Qué falta y <span>próximos pasos</span></h2><p class="sub">Para pasar de prototipo a sitio publicado, necesitamos que el cliente nos acerque lo siguiente.</p><div class="grid" style="grid-template-columns:repeat(3,1fr)">'+
 c('Material','Contenido a cargar','<ul><li>Video o foto final del hero</li><li>Fotos de packs de 2 y 3 unidades</li><li>Foto del pallet</li><li>Portadas de cada evento</li></ul>',1)+
 c('Datos','Información a confirmar','<ul><li>Eventos reales: fechas, lugares y descripciones</li><li>Hashtag definitivo de la comunidad</li><li>Textos del asistente</li><li>Afirmaciones del producto (por ejemplo “sin gluten”)</li></ul>')+
 c('Sitio','Página de Producto','Todavía en desarrollo. Se suma a este documento cuando esté terminada.',0,'')+
 c('Siguiente','Publicación','Dominio, conexión de pedidos y revisión final de textos en el sitio publicado.')+
 c('Siguiente','Mejoras posibles','Guardar la conversación del asistente entre páginas y mostrar un mini resumen del carrito dentro del chat.')+
 c('Siguiente','Medición','Revisar qué consultas no entiende el asistente para ampliar sus respuestas.')+'</div>','Pendientes')
