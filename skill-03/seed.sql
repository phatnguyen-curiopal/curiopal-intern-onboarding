INSERT INTO Customers (name, email, password_hash)
    VALUES ('Nguyen Van A', 'nguyenvana@gmail.com', '123456'),
            ('Nguyen Van B', 'nguyenvanb@gmail.com', '123456'),
            ('Nguyen Van C', 'nguyenvanc@gmail.com', '123456'),
            ('Nguyen Van D', 'nguyenvand@gmail.com', '123456');
            
INSERT INTO Products (name, unit_price)
    VALUES ('Word', 100000),
            ('Excel', 200000),
            ('Power Point', 250000.99),
            ('Outlook', 150000),
            ('Edge', 170000);

INSERT INTO Orders (customer_id, total)
    VALUES (1, 100000),
            (2, 250000);

INSERT INTO Order_items (order_id, product_id, quantity)
    VALUES (1, 1, 1),
            (2, 1, 1),
            (2, 4, 1);

     