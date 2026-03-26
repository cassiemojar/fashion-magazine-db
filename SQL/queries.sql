-- User Queries
-- INSERT (Article), Cassie
-- Insert a new article in the database.
INSERT INTO Article
VALUES (:doi, :header, :pagestart, :pageend, :issuenum, :ISSN);

-- UPDATE (Contributor_EmailDetails), Cassie
-- Update a contributor's contact and agency information. **CHANGE LATER
UPDATE Contributor_EmailDetails c
SET agency = :agency, address = :address
WHERE email = :email;

-- DELETE (Magazine), Radhika
-- Delete magazine only if all its issues are older than a given date.



-- SELECT, (Clothes), Radhika
-- Search for clothing items based on type, fit, and/or designer preferences.


-- PROJECT (Contributor_EmailDetails), Isaac
-- Display selected contributor details based on user's selection.


-- JOIN (Magazine + Issue + Article), Isaac
-- Find all issues and articles in a given magazine, in descending order of issue date


-- Hard-coded Queries

-- GROUP BY (WorkedOn), Cassie
-- Count how many authors worked on each magazine issue. **CHANGE LATER
SELECT ISSN, COUNT(*)
FROM WorkedOn w, Author a
WHERE w.sin = a.sin
GROUP BY ISSN;



-- HAVING (Magazine), Cassie
-- Find publishers publishing more magazines than the average per country.
SELECT pname, country, COUNT(*)
FROM Magazine m2
GROUP BY m2.pname, m2.country
HAVING COUNT(*) >  (
    SELECT avg(sum)
    FROM (
        SELECT COUNT(*) AS sum
        FROM Magazine m1
        WHERE country = m1.country
        GROUP BY m1.pname
    )
);


-- NESTED AGGREGATION (Contributor + WorkedOn), Radhika
-- Find the contributors who worked on the highest number of issues.


-- DIVISION (Wears), Isaac 
-- Find models who have worn every clothing item.

SELECT cname
FROM Contributor_EmailDetails e JOIN Contributor c ON c.email = e.email
WHERE EXISTS (
    SELECT sin
    FROM model m
    WHERE c.sin = m.sin
    AND NOT EXISTS (
        SELECT cid
        FROM Clothes cl
        WHERE NOT EXISTS (
            SELECT w.cid
            FROM Wears w
            WHERE m.sin = w.sin
            AND w.cid = cl.cid
        )
    )
);
        
