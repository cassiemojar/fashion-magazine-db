-- User Queries
-- INSERT (Article), Cassie
-- Insert a new article in the database.
INSERT INTO Article
VALUES (:doi, :header, :pagestart, :pageend, :issuenum, :ISSN);

-- UPDATE (Contributor_EmailDetails), Cassie
-- Update a contributor's private information and agency. 
UPDATE Contributor_EmailDetails 
SET agency = :agency, cname = :cname, address  = :address, birthday = :birthday
WHERE email = :email;

-- DELETE (Magazine), Radhika
-- Delete magazine only if all its issues are older than a given date.
DELETE FROM Magazine m
WHERE m.ISSN = :ISSN
  AND NOT EXISTS (
      SELECT *
      FROM Issue i
      WHERE i.ISSN = m.ISSN
        AND i.pdate >= :cutoff_date
  );


-- SELECT, (Clothes), Radhika
-- Search for clothing items based on type, fit, and/or designer preferences.
-- Needs to be implemented in JS, appService.js
SELECT cid, ctype, cfit, designer
FROM Clothes
WHERE ${conditions};


-- PROJECT (Contributor_EmailDetails), Isaac
-- Display selected contributor details based on user's selection.
-- Needs to be implimented in JS, appService.js
SELECT ${selected_attributes} 
FROM Contributor_EmailDetails


-- JOIN (Magazine + Issue + Article), Isaac
-- Find all first page articles in a given magazine, in descending order of issue date
SELECT a.header, i.pdate
FROM Article a LEFT JOIN Issue i ON a.issuenum = i.issuenum
WHERE a.pagestart = 1 AND i.ISSN = :ISSN
ORDER BY i.pdate DESC;

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
SELECT c.sin, c.cname, COUNT(*) AS issue_count
FROM Contributor c
JOIN WorkedOn w
  ON c.sin = w.sin
GROUP BY c.sin, c.cname
HAVING COUNT(*) = (
    SELECT MAX(issue_total)
    FROM (
        SELECT COUNT(*) AS issue_total
        FROM WorkedOn
        GROUP BY sin
    )
);

-- DIVISION (Wears), Isaac 
-- Find models who have worn every clothing item by a designer.

SELECT cname
FROM Contributor_EmailDetails e JOIN Contributor c ON c.email = e.email
WHERE EXISTS (
    SELECT sin
    FROM model m
    WHERE c.sin = m.sin
    AND EXISTS (
        SELECT designer
        FROM Clothes cl1
        WHERE NOT EXISTS (
            SELECT cl2.cid
            FROM Clothes cl2
            WHERE cl1.designer = cl2.designer
            AND NOT EXISTS (
                SELECT w.cid
                FROM Wears w
                WHERE m.sin = w.sin
                AND w.cid = cl2.cid
            )
        )
    )
);
        
