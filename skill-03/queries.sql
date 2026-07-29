-- revenue per month
SELECT DATE_TRUNC('month', created_at) AS Month, SUM (total) AS Revenue
FROM Orders
GROUP BY DATE_TRUNC('month', created_at)

-- top 5 customers by spend
SELECT customers.name, SUM (orders.total) AS Total_spending
FROM customers
    JOIN orders 
        ON customers.id = orders.customer_id
GROUP BY customers.id
LIMIT 5;

-- products never ordered
SELECT products.name
FROM products LEFT JOIN order_items
    ON products.id = order_items.product_id
WHERE order_items.id IS NULL 

-- average order value per customer
SELECT customers.name, AVG (orders.total) AS Total_spending
FROM customers
    LEFT JOIN orders 
        ON customers.id = orders.customer_id
GROUP BY customers.id

--customers never ordered
SELECT customer.name
FROM customers LEFT JOIN orders
    ON customers.id = orders.customer_id
WHERE order.id IS NULL


