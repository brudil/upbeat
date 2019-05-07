CREATE EXTENSION IF NOT EXISTS moddatetime;

create table account (
    id bigserial primary key,
    display_name text not null,
    email_address text not null,
    password_hash text not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

drop trigger if exists account_updated_at on account;
CREATE TRIGGER account_updated_at
    BEFORE UPDATE ON account
    FOR EACH ROW
EXECUTE PROCEDURE moddatetime (updated_at);
