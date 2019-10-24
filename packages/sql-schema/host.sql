

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_with_oids = false;


CREATE TABLE public.organisations (
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    id uuid NOT NULL
);



CREATE TABLE public.shows (
    name text NOT NULL,
    id uuid NOT NULL
);



CREATE TABLE public.shows_to_organisations (
    id integer NOT NULL,
    show uuid NOT NULL,
    organisation uuid NOT NULL
);



CREATE SEQUENCE public.shows_to_organisations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.shows_to_organisations_id_seq OWNED BY public.shows_to_organisations.id;



CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password_hash text NOT NULL,
    email_address text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



ALTER TABLE ONLY public.shows_to_organisations ALTER COLUMN id SET DEFAULT nextval('public.shows_to_organisations_id_seq'::regclass);



ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.shows_to_organisations
    ADD CONSTRAINT shows_to_organisations_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.shows_to_organisations
    ADD CONSTRAINT shows_to_organisations_organisation_fkey FOREIGN KEY (organisation) REFERENCES public.organisations(id);



ALTER TABLE ONLY public.shows_to_organisations
    ADD CONSTRAINT shows_to_organisations_show_fkey FOREIGN KEY (show) REFERENCES public.shows(id);



