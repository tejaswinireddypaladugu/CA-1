CREATE TABLE contact_messages
(
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
)

CREATE TABLE feedback
(
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT feedback_pkey PRIMARY KEY (id),
    CONSTRAINT feedback_rating_check CHECK (rating >= 1 AND rating <= 5)
)

CREATE TABLE menu_items
(
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    availability boolean DEFAULT true,
    CONSTRAINT menu_items_pkey PRIMARY KEY (id)
)

CREATE TABLE orders
(
    id integer NOT NULL,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_amount numeric(10,2) NOT NULL,
    quantity integer,
    order_items text,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
)

CREATE TABLE prebookings
(
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    phone character varying(15) NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    item_name character varying(20) NOT NULL,
    quantity integer NOT NULL,
    special_requests text,
    CONSTRAINT prebookings_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(10) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['user'::character varying, 'admin'::character varying]::text[]))
)

