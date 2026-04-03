-- User Queries
-- INSERT (Magazine), Cassie
-- Insert a new Magazine in the database.
INSERT INTO Magazine
VALUES (:issn, :mname, :genre, :language, :pname, :country);

-- UPDATE (Magazine), Cassie
-- Update a magazine's information.
UPDATE Magazine 
SET mname = :mname, genre  = :genre, language = :language, pname = :pname, country = :country
WHERE issn = :issn;

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
SELECT w.sin, COUNT(*) AS issue_count
            FROM WorkedOn w
            GROUP BY w.sin
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
SELECT e.cname
    FROM Contributor_EmailDetails e
    JOIN Contributor c ON c.email = e.email
    JOIN Model m ON m.sin = c.sin
    WHERE EXISTS (
        SELECT DISTINCT cl1.designer
        FROM Clothes cl1
        WHERE NOT EXISTS (
            SELECT *
            FROM Clothes cl2
            WHERE cl2.designer = cl1.designer
            AND NOT EXISTS (
                SELECT *
                FROM Wears w
                WHERE w.sin = m.sin
                AND w.cid = cl2.cid
            )
        )
);
        
