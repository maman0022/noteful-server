drop table if exists notes;
drop table if exists folders;

create table folders(
 id integer primary key generated by default as identity,
 "name" text not null
);

create table notes(
 id integer primary key generated by default as identity,
 "name" text not null,
 modified timestamptz default now(),
 content text not null,
 folderid integer references folders(id) on delete cascade not null
);