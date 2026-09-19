-- The admin saves a whole tab at once. Rebuilding each list inside one function
-- keeps a failed save from leaving half a list behind; RLS still applies because
-- the function runs as the caller.
--
-- `where true` is not redundant: Supabase rejects an unqualified DELETE.
create or replace function save_portfolio(payload jsonb)
returns void
language plpgsql
as $$
begin
  if payload ? 'aboutBody' then
    update sections set body = payload->>'aboutBody' where key = 'about';
  end if;

  if payload ? 'facts' then
    delete from facts where true;
    insert into facts (label, value, sort_order)
    select item->>'label', item->>'value', ord
    from jsonb_array_elements(payload->'facts') with ordinality as t(item, ord);
  end if;

  if payload ? 'work' then
    delete from work_files where true;
    insert into work_files (period, role, org, image, detail, tags, sort_order)
    select
      item->>'period',
      item->>'role',
      coalesce(item->>'org', ''),
      coalesce(item->>'image', ''),
      coalesce(item->>'detail', ''),
      coalesce(
        (select array_agg(value) from jsonb_array_elements_text(item->'tags')),
        '{}'::text[]),
      ord
    from jsonb_array_elements(payload->'work') with ordinality as t(item, ord);
  end if;

  if payload ? 'hobbies' then
    delete from hobbies where true;
    insert into hobbies (name, note, sort_order)
    select item->>'name', coalesce(item->>'note', ''), ord
    from jsonb_array_elements(payload->'hobbies') with ordinality as t(item, ord);
  end if;

  if payload ? 'movies' then
    delete from movies where true;
    insert into movies (title, kind, quote, poster, voice, sort_order)
    select
      item->>'title',
      coalesce(item->>'kind', ''),
      coalesce(item->>'quote', ''),
      coalesce(item->>'poster', ''),
      coalesce(item->>'voice', ''),
      ord
    from jsonb_array_elements(payload->'movies') with ordinality as t(item, ord);
  end if;
end $$;
