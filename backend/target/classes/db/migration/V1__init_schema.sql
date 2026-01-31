CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT categories_name_not_blank CHECK (length(trim(name)) > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_categories_name ON categories (name);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description_summary TEXT NULL,
    image_url TEXT NULL,
    price_amount NUMERIC(12,2) NULL,
    price_currency CHAR(3) NULL,
    is_available BOOLEAN NOT NULL DEFAULT false,
    category_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT products_name_not_blank CHECK (length(trim(name)) > 0),
    CONSTRAINT products_price_amount_non_negative CHECK (price_amount IS NULL OR price_amount >= 0),
    CONSTRAINT products_price_currency_required CHECK (price_amount IS NULL OR price_currency IS NOT NULL),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS ix_products_available ON products (is_available);
CREATE INDEX IF NOT EXISTS ix_products_available_category ON products (is_available, category_id);
