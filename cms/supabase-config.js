// UP SKY · configuración del panel (independiente de la web).
// La clave "publishable/anon" es pública por diseño: la seguridad la dan las políticas RLS de la base.
// NUNCA pegar acá la clave "service_role" / "secret".
window.UPSKY_SUPABASE = {
  url:        'PEGAR_URL_DEL_PROYECTO',          // ej: https://xxxx.supabase.co
  anonKey:    'PEGAR_CLAVE_PUBLISHABLE',         // Project Settings > API > publishable / anon
  adminEmail: 'PEGAR_EMAIL_DEL_CLIENTE',         // el panel solo pide la contraseña de este usuario
  bucket:     'upsky-images',
  siteUrl:    'https://PEGAR-URL-DEL-SITIO/',    // la URL final de la web
};
