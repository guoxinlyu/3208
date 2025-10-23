
create table if not exists users (
  id serial primary key,
  username text unique not null,
  password_hash text not null,
  created_at timestamp default now()
);

create table if not exists posts (
  id serial primary key,
  title text not null,
  content text not null,
  author text,
  created_at timestamp default now()
);

insert into users (username, password_hash)
values ('admin', '$2a$10$8J2h1U7fev4p8Q5m7t9sS.uQy2jV1eIuJt1q9i4Z9Qqkq0J5z7z9a')
on conflict (username) do nothing;

insert into posts (title, content, author) values
('First Build: MX-5 NA', 'Coilovers + Headers + ECU tune.', 'alex'),
('WRX Wheel Fitment',   '18x9.5 +38, 245/40.',            'blake');
