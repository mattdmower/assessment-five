--Problem 1
SELECT email 
FROM customers 
ORDER BY email ASC;

--Problem 2
SELECT id 
FROM orders 
WHERE customer_id IN (
    SELECT id 
    FROM customers 
    WHERE fname = 'Elizabeth' AND lname = 'Crocker'
);

--Problem 3
SELECT SUM(num_cupcakes) AS total_unprocessed_cupcakes
FROM orders
WHERE processed = FALSE;

--Problem 4
SELECT c.name, COALESCE(SUM(o.num_cupcakes), 0) AS total_ordered
FROM cupcakes c
LEFT JOIN orders o ON c.id = o.cupcake_id
GROUP BY c.name
ORDER BY c.name ASC;

--Problem 5
SELECT c.email, COALESCE(SUM(o.num_cupcakes), 0) AS total_cupcakes_ordered
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.email
ORDER BY total_cupcakes_ordered DESC;

--Problem 6
SELECT DISTINCT cus.fname, cus.lname, cus.email
FROM customers cus
JOIN orders ord ON cus.id = ord.customer_id
JOIN cupcakes cup ON ord.cupcake_id = cup.id
WHERE cup.name = 'funfetti' AND ord.processed = TRUE;