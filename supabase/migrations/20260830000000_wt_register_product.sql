-- Writing Tower registers itself in the shared Project Skyline `products`
-- table. Per Project Skyline convention (see project-skyline-admin's
-- docs/products-registration-notes.md), each product's own repo owns
-- inserting its own row — idempotent so it's safe to re-run.
insert into products (product_code, name)
values ('writing-tower', 'Writing Tower')
on conflict (product_code) do nothing;
