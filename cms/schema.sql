-- UP SKY CMS · esquema de base de datos (Supabase / Postgres)
-- Ejecutar completo en: Supabase > SQL Editor.
-- ANTES: reemplazar CAMBIAR_EMAIL por el email del usuario administrador (el mismo de supabase-config.js).

create table if not exists public.items (
  id         uuid primary key default gen_random_uuid(),
  section    text not null check (section in ('productos','mayorista','pasos_negocios','eventos')),
  data       jsonb not null default '{}'::jsonb,
  active     boolean not null default true,   -- true = visible en el sitio
  position   int not null default 0,          -- orden dentro de la sección
  created_at timestamptz not null default now()
);
create index if not exists items_section_position on public.items (section, position, created_at);

alter table public.items enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable as $$ select coalesce(auth.jwt() ->> 'email', '') = 'CAMBIAR_EMAIL' $$;

-- El sitio público (clave anon) solo puede LEER lo que está visible.
drop policy if exists "lectura publica" on public.items;
create policy "lectura publica" on public.items for select to anon, authenticated using (active = true);

-- El administrador puede ver y modificar todo.
drop policy if exists "admin lee todo" on public.items;
create policy "admin lee todo" on public.items for select to authenticated using (public.is_admin());
drop policy if exists "admin inserta" on public.items;
create policy "admin inserta" on public.items for insert to authenticated with check (public.is_admin());
drop policy if exists "admin actualiza" on public.items;
create policy "admin actualiza" on public.items for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin borra" on public.items;
create policy "admin borra" on public.items for delete to authenticated using (public.is_admin());

-- Imágenes: bucket público de lectura, escritura solo del administrador.
insert into storage.buckets (id, name, public) values ('upsky-images', 'upsky-images', true) on conflict (id) do nothing;
drop policy if exists "imagenes lectura" on storage.objects;
create policy "imagenes lectura" on storage.objects for select to anon, authenticated using (bucket_id = 'upsky-images');
drop policy if exists "imagenes admin" on storage.objects;
create policy "imagenes admin" on storage.objects for all to authenticated
  using (bucket_id = 'upsky-images' and public.is_admin()) with check (bucket_id = 'upsky-images' and public.is_admin());
