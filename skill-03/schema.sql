DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE Customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE Products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name TEXT NOT NULL,
    unit_price NUMERIC(12, 6) DEFAULT 0,

    CHECK (unit_price >= 0)
);

CREATE TABLE Orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    total NUMERIC(12, 6) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_orders_customers
        FOREIGN KEY (customer_id) REFERENCES customers (id),

    CHECK (total >= 0)
);

CREATE TABLE Order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,

    CONSTRAINT FK_orderItems_orders
        FOREIGN KEY (order_id) REFERENCES orders (id),
        
    CONSTRAINT FK_orderItems_products
        FOREIGN KEY (product_id) REFERENCES products (id),

    CHECK (quantity > 0)
);