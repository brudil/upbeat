

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


CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;



CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modified = now();
    RETURN NEW;   
END;
$$;


SET default_with_oids = false;


CREATE TABLE public.episodes (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    show_id uuid NOT NULL
);



CREATE TABLE public.organisations (
    name text NOT NULL,
    created timestamp without time zone NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);



CREATE TABLE public.shows (
    name text DEFAULT public.gen_random_uuid() NOT NULL,
    id uuid NOT NULL,
    organisation_id uuid NOT NULL
);



CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password_hash text NOT NULL,
    email_address text NOT NULL,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



CREATE TRIGGER update_user_modified BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();



ALTER TABLE ONLY public.episodes
    ADD CONSTRAINT episodes_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.shows(id);



ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES public.organisations(id);



