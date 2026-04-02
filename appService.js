const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// Get full magazine table
async function fetchMagtableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM MAGAZINE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Get full article table
async function fetchArticlesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Article');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Get full Contributor_EmailDetails table
async function fetchContributorsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Contributor_EmailDetails');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Get full Issues table
async function fetchIssuesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Issue');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Get full clothes table
async function fetchClothesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Clothes');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Get full authors table
async function fetchAuthorsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM WorkedOn');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//Initialize Database
async function initiateDatabase() {
    return await withOracleDB(async (connection) => {
        await dropTables(connection);
        await createTables(connection);
        await insertData(connection);
        return true;
    }).catch(() => {
        return false;
    });
}


// Helper for dropping tables
async function dropTables(connection) {
    const tables = [
        'Branded', 'Brand', 'Wears', 'AppearsIn', 'Clothes', 'Clothes_Price',
        'WorkedOn', 'Photographed', 'Model', 'Photographer', 'Author',
        'Contributor', 'Contributor_EmailDetails', 'Birthday_Age',
        'Contains', 'Photo', 'Photo_FileType', 'Article', 'Article_PageRange',
        'Issue', 'Magazine', 'Publisher', 'Publisher_Location'
    ];
    for (const table of tables) {
        try {
            await connection.execute(`DROP TABLE ${table} CASCADE CONSTRAINTS`);
        } catch (err) {
            console.log(`${table} might not exist, proceeding...`);
        }
    }
}

// helper for creating tables
async function createTables(connection) {
await connection.execute(`CREATE TABLE Publisher_Location (
        address  VARCHAR2(30) PRIMARY KEY,
        city     VARCHAR2(20),
        country  CHAR(2) NOT NULL
    )`);
    await connection.execute(`CREATE TABLE Publisher (
        pname       VARCHAR2(20),
        country     CHAR(2),
        address     VARCHAR2(30),
        established DATE,
        PRIMARY KEY (pname, country),
        FOREIGN KEY (address) REFERENCES Publisher_Location(address)
        ON DELETE SET NULL
    )`);
    await connection.execute(`CREATE TABLE Magazine (
        ISSN     CHAR(8) PRIMARY KEY,
        mname    VARCHAR2(200),
        genre    VARCHAR2(20),
        language VARCHAR2(20),
        pname    VARCHAR2(20) NOT NULL,
        country  CHAR(2) NOT NULL,
        UNIQUE (mname, pname, country),
        FOREIGN KEY (pname, country) REFERENCES Publisher(pname, country)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Issue (
        issuenum   INTEGER,
        ISSN       CHAR(8),
        issuetitle VARCHAR2(200),
        length     INTEGER,
        pdate      DATE,
        PRIMARY KEY (issuenum, ISSN),
        UNIQUE (issuetitle, pdate, ISSN),
        FOREIGN KEY (ISSN) REFERENCES Magazine(ISSN)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Article_PageRange (
        pagestart INTEGER,
        pageend   INTEGER,
        pagecount INTEGER,
        PRIMARY KEY (pagestart, pageend)
    )`);
    await connection.execute(`CREATE TABLE Article (
        doi       VARCHAR2(20) PRIMARY KEY,
        header    VARCHAR2(200),
        pagestart INTEGER,
        pageend   INTEGER,
        issuenum  INTEGER NOT NULL,
        ISSN      CHAR(8) NOT NULL,
        FOREIGN KEY (issuenum, ISSN) REFERENCES Issue(issuenum, ISSN)
        ON DELETE CASCADE,
        FOREIGN KEY (pagestart, pageend) REFERENCES Article_PageRange(pagestart, pageend)
        ON DELETE SET NULL
    )`);
    await connection.execute(`CREATE TABLE Photo_FileType (
        filename VARCHAR2(20) PRIMARY KEY,
        filetype CHAR(5)
    )`);
    await connection.execute(`CREATE TABLE Photo (
        pid      INTEGER PRIMARY KEY,
        filename VARCHAR2(20),
        filesize INTEGER,
        FOREIGN KEY (filename) REFERENCES Photo_FileType(filename)
        ON DELETE SET NULL
    )`);
    await connection.execute(`CREATE TABLE Contains (
        doi    VARCHAR2(20),
        pid    INTEGER,
        PRIMARY KEY (doi, pid),
        FOREIGN KEY (doi) REFERENCES Article(doi)
        ON DELETE CASCADE,
        FOREIGN KEY (pid) REFERENCES Photo(pid)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Birthday_Age (
        birthday DATE PRIMARY KEY,
        age      INTEGER
    )`);
    await connection.execute(`CREATE TABLE Contributor_EmailDetails (
        email    VARCHAR2(20) PRIMARY KEY,
        agency   VARCHAR2(20),
        cname    VARCHAR2(20),
        address  VARCHAR2(30),
        birthday DATE,
        FOREIGN KEY (birthday) REFERENCES Birthday_Age(birthday)
        ON DELETE SET NULL
    )`);
    await connection.execute(`CREATE TABLE Contributor (
        sin   CHAR(9) PRIMARY KEY,
        email VARCHAR2(20) NOT NULL,
        UNIQUE (email),
        FOREIGN KEY (email) REFERENCES Contributor_EmailDetails(email)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Author (
        sin CHAR(9) PRIMARY KEY,
        FOREIGN KEY (sin) REFERENCES Contributor(sin)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Photographer (
        sin CHAR(9) PRIMARY KEY,
        FOREIGN KEY (sin) REFERENCES Contributor(sin)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Model (
        sin    CHAR(9) PRIMARY KEY,
        height INTEGER,
        FOREIGN KEY (sin) REFERENCES Contributor(sin)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Photographed (
        sin     CHAR(9),
        pid     INTEGER,
        camtype VARCHAR2(20),
        PRIMARY KEY (sin, pid),
        FOREIGN KEY (sin) REFERENCES Photographer(sin)
        ON DELETE CASCADE,
        FOREIGN KEY (pid) REFERENCES Photo(pid)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE WorkedOn (
        sin      CHAR(9),
        issuenum INTEGER,
        ISSN     CHAR(8),
        PRIMARY KEY (sin, issuenum, ISSN),
        FOREIGN KEY (sin) REFERENCES Contributor(sin)
        ON DELETE CASCADE,
        FOREIGN KEY (issuenum, ISSN) REFERENCES Issue(issuenum, ISSN)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Clothes_Price (
        designer VARCHAR2(20),
        ctype    VARCHAR2(20),
        price    INTEGER,
        PRIMARY KEY (designer, ctype)
    )`);
    await connection.execute(`CREATE TABLE Clothes (
        cid      INTEGER PRIMARY KEY,
        ctype    VARCHAR2(20),
        cfit     VARCHAR2(20),
        designer VARCHAR2(20),
        FOREIGN KEY (designer, ctype) REFERENCES Clothes_Price(designer, ctype)
        ON DELETE SET NULL
    )`);
    await connection.execute(`CREATE TABLE AppearsIn (
        cid      INTEGER,
        issuenum INTEGER,
        ISSN     CHAR(8),
        PRIMARY KEY (cid, issuenum, ISSN),
        FOREIGN KEY (cid) REFERENCES Clothes(cid)
        ON DELETE CASCADE,
        FOREIGN KEY (issuenum, ISSN) REFERENCES Issue(issuenum, ISSN)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Wears (
        sin   CHAR(9),
        cid   INTEGER,
        csize CHAR(20),
        fit   VARCHAR2(20),
        PRIMARY KEY (sin, cid),
        FOREIGN KEY (sin) REFERENCES Model(sin)
        ON DELETE CASCADE,
        FOREIGN KEY (cid) REFERENCES Clothes(cid)
        ON DELETE CASCADE
    )`);
    await connection.execute(`CREATE TABLE Brand (
        bname       VARCHAR2(20) PRIMARY KEY,
        established DATE,
        country     CHAR(2),
        owner       VARCHAR2(20)
    )`);
    await connection.execute(`CREATE TABLE Branded (
        bname VARCHAR2(20),
        cid   INTEGER,
        PRIMARY KEY (bname, cid),
        FOREIGN KEY (bname) REFERENCES Brand(bname)
        ON DELETE CASCADE,
        FOREIGN KEY (cid) REFERENCES Clothes(cid)
        ON DELETE CASCADE
    )`);
}

// helper for inserting values into tables

async function insertData(connection) {
// Publisher_Location
    await connection.execute(`INSERT INTO Publisher_Location VALUES ('1st St','New York','US')`);
    await connection.execute(`INSERT INTO Publisher_Location VALUES ('2nd St','Vancouver','CA')`);
    await connection.execute(`INSERT INTO Publisher_Location VALUES ('3rd St','London','UK')`);
    await connection.execute(`INSERT INTO Publisher_Location VALUES ('4th St','Paris','FR')`);
    await connection.execute(`INSERT INTO Publisher_Location VALUES ('5th St','Tokyo','JP')`);

    // Publisher
    await connection.execute(`INSERT INTO Publisher VALUES ('Vogue','US','1st St',DATE '2012-01-01')`);
    await connection.execute(`INSERT INTO Publisher VALUES ('Marie Claire','CA','2nd St',DATE '2020-03-26')`);
    await connection.execute(`INSERT INTO Publisher VALUES ('Elle','UK','3rd St',DATE '1995-11-29')`);
    await connection.execute(`INSERT INTO Publisher VALUES ('Glamour','FR','4th St',DATE '2025-07-28')`);
    await connection.execute(`INSERT INTO Publisher VALUES ('InStyle','JP','5th St',DATE '2000-12-25')`);

    // Magazine
    await connection.execute(`INSERT INTO Magazine VALUES ('12345678','The American Vogue','Fashion','English','Vogue','US')`);
    await connection.execute(`INSERT INTO Magazine VALUES ('87654321','Trending Accessories','Trends','English','Marie Claire','CA')`);
    await connection.execute(`INSERT INTO Magazine VALUES ('92096390','Elle Couture','Style','English','Elle','UK')`);
    await connection.execute(`INSERT INTO Magazine VALUES ('82371382','La Semaine de Choissures','Shoes','French','Glamour','FR')`);
    await connection.execute(`INSERT INTO Magazine VALUES ('10293847','InStyle Japan','Fashion','Japanese','InStyle','JP')`);

    // Issue
    await connection.execute(`INSERT INTO Issue VALUES (1,'12345678','January 2025 Issue',120,DATE '2025-01-01')`);
    await connection.execute(`INSERT INTO Issue VALUES (2,'12345678','February 2025 Issue',110,DATE '2025-02-01')`);
    await connection.execute(`INSERT INTO Issue VALUES (2,'10293847','February 2025 Issue',110,DATE '2025-02-01')`);
    await connection.execute(`INSERT INTO Issue VALUES (1,'87654321','March 2025 Accessories',95,DATE '2025-03-01')`);
    await connection.execute(`INSERT INTO Issue VALUES (1,'92096390','Spring Couture',130,DATE '2025-04-01')`);
    await connection.execute(`INSERT INTO Issue VALUES (1,'82371382','Summer Shoes Special',80,DATE '2026-06-01')`);

    // Article_PageRange
    await connection.execute(`INSERT INTO Article_PageRange VALUES (1,5,5)`);
    await connection.execute(`INSERT INTO Article_PageRange VALUES (6,10,5)`);
    await connection.execute(`INSERT INTO Article_PageRange VALUES (11,15,5)`);
    await connection.execute(`INSERT INTO Article_PageRange VALUES (16,20,5)`);
    await connection.execute(`INSERT INTO Article_PageRange VALUES (21,25,5)`);

    // Article
    await connection.execute(`INSERT INTO Article VALUES ('001A','Fashion Trends 2026',1,5,1,'12345678')`);
    await connection.execute(`INSERT INTO Article VALUES ('002B','Designer Spotlight',6,10,2,'10293847')`);
    await connection.execute(`INSERT INTO Article VALUES ('003C','Spring Accessories',11,15,1,'87654321')`);
    await connection.execute(`INSERT INTO Article VALUES ('004D','Couture Highlights',16,20,1,'92096390')`);
    await connection.execute(`INSERT INTO Article VALUES ('005E','Summer Shoes Must-Haves',21,25,1,'82371382')`);

    // Photo_FileType
    await connection.execute(`INSERT INTO Photo_FileType VALUES ('img001.jpg','JPEG')`);
    await connection.execute(`INSERT INTO Photo_FileType VALUES ('img002.png','PNG')`);
    await connection.execute(`INSERT INTO Photo_FileType VALUES ('img003.tif','TIFF')`);
    await connection.execute(`INSERT INTO Photo_FileType VALUES ('img004.bmp','BMP')`);
    await connection.execute(`INSERT INTO Photo_FileType VALUES ('img005.gif','GIF')`);

    // Photo
    await connection.execute(`INSERT INTO Photo VALUES (101,'img002.png',2)`);
    await connection.execute(`INSERT INTO Photo VALUES (102,'img003.tif',3)`);
    await connection.execute(`INSERT INTO Photo VALUES (103,'img004.bmp',4)`);
    await connection.execute(`INSERT INTO Photo VALUES (104,'img005.gif',5)`);
    await connection.execute(`INSERT INTO Photo VALUES (105,'img001.jpg',1)`);

    // Contains
    await connection.execute(`INSERT INTO Contains VALUES ('001A',101)`);
    await connection.execute(`INSERT INTO Contains VALUES ('002B',102)`);
    await connection.execute(`INSERT INTO Contains VALUES ('003C',103)`);
    await connection.execute(`INSERT INTO Contains VALUES ('004D',104)`);
    await connection.execute(`INSERT INTO Contains VALUES ('005E',105)`);

    // Birthday_Age
    const birthdays = [
        `(DATE '1990-05-12',36)`, `(DATE '1985-09-23',41)`, `(DATE '1992-11-30',33)`,
        `(DATE '2000-01-15',26)`, `(DATE '1998-07-08',28)`, `(DATE '1991-02-14',35)`,
        `(DATE '1993-06-18',33)`, `(DATE '1994-09-02',32)`, `(DATE '1995-12-11',31)`,
        `(DATE '1996-03-21',30)`, `(DATE '1997-08-19',29)`, `(DATE '1999-04-10',27)`,
        `(DATE '2001-07-07',25)`, `(DATE '2002-10-22',24)`, `(DATE '2003-05-30',23)`
    ];
    for (const b of birthdays) {
        await connection.execute(`INSERT INTO Birthday_Age VALUES ${b}`);
    }

    // Contributor_EmailDetails
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('alice@gmail.com','FashionAgency','Alice','1st Ave',DATE '1990-05-12')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('bob@gmail.com','StyleCorp','Bob','2nd Ave',DATE '1985-09-23')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('carol@gmail.com','Trendsetters','Carol','3rd Ave',DATE '1992-11-30')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('dave@gmail.com','PhotoWorld','Dave','4th Ave',DATE '2000-01-15')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('eve@gmail.com','ModellingPro','Eve','5th Ave',DATE '1998-07-08')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('a@gmail.com','AgencyA','Anna','6th Ave',DATE '1991-02-14')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('b@gmail.com','AgencyB','Ben','7th Ave',DATE '1993-06-18')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('c@gmail.com','AgencyC','Chris','8th Ave',DATE '1994-09-02')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('d@gmail.com','AgencyD','Dana','9th Ave',DATE '1995-12-11')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('e@gmail.com','AgencyE','Eli','10th Ave',DATE '1996-03-21')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('f@gmail.com','AgencyF','Finn','11th Ave',DATE '1997-08-19')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('g@gmail.com','AgencyG','Grace','12th Ave',DATE '1999-04-10')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('h@gmail.com','AgencyH','Hugo','13th Ave',DATE '2001-07-07')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('i@gmail.com','AgencyI','Ivy','14th Ave',DATE '2002-10-22')`);
    await connection.execute(`INSERT INTO Contributor_EmailDetails VALUES ('j@gmail.com','AgencyJ','Jack','15th Ave',DATE '2003-05-30')`);

    // Contributor
    const contributors = [
        `('111111111','alice@gmail.com')`, `('222222222','bob@gmail.com')`,
        `('333333333','carol@gmail.com')`, `('444444444','dave@gmail.com')`,
        `('555555555','eve@gmail.com')`,   `('666666666','a@gmail.com')`,
        `('777777777','b@gmail.com')`,     `('888888888','c@gmail.com')`,
        `('999999999','d@gmail.com')`,     `('123456789','e@gmail.com')`,
        `('987654321','f@gmail.com')`,     `('876543210','g@gmail.com')`,
        `('765432109','h@gmail.com')`,     `('654321098','i@gmail.com')`,
        `('543210987','j@gmail.com')`
    ];
    for (const c of contributors) {
        await connection.execute(`INSERT INTO Contributor VALUES ${c}`);
    }

    // Author
    for (const sin of [`'111111111'`,`'222222222'`,`'333333333'`,`'444444444'`,`'555555555'`]) {
        await connection.execute(`INSERT INTO Author VALUES (${sin})`);
    }

    // Photographer
    for (const sin of [`'666666666'`,`'777777777'`,`'888888888'`,`'999999999'`,`'123456789'`]) {
        await connection.execute(`INSERT INTO Photographer VALUES (${sin})`);
    }

    // Model
    await connection.execute(`INSERT INTO Model VALUES ('987654321',175)`);
    await connection.execute(`INSERT INTO Model VALUES ('876543210',180)`);
    await connection.execute(`INSERT INTO Model VALUES ('765432109',178)`);
    await connection.execute(`INSERT INTO Model VALUES ('654321098',172)`);
    await connection.execute(`INSERT INTO Model VALUES ('543210987',182)`);

    // Photographed
    await connection.execute(`INSERT INTO Photographed VALUES ('777777777',101,'DSLR')`);
    await connection.execute(`INSERT INTO Photographed VALUES ('888888888',102,'Mirrorless')`);
    await connection.execute(`INSERT INTO Photographed VALUES ('999999999',103,'Film')`);
    await connection.execute(`INSERT INTO Photographed VALUES ('123456789',104,'DSLR')`);
    await connection.execute(`INSERT INTO Photographed VALUES ('666666666',105,'Smartphone')`);

    // WorkedOn
    await connection.execute(`INSERT INTO WorkedOn VALUES ('111111111',2,'12345678')`);
    await connection.execute(`INSERT INTO WorkedOn VALUES ('111111111',1,'12345678')`);
    await connection.execute(`INSERT INTO WorkedOn VALUES ('222222222',2,'10293847')`);
    await connection.execute(`INSERT INTO WorkedOn VALUES ('333333333',1,'87654321')`);
    await connection.execute(`INSERT INTO WorkedOn VALUES ('444444444',1,'92096390')`);
    await connection.execute(`INSERT INTO WorkedOn VALUES ('555555555',1,'82371382')`);

    // Clothes_Price
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Gucci','Dress',1200)`);
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Gucci','Plastic Bag',1200)`);
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Prada','Shoes',800)`);
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Prada','Purse',800)`);
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Versace','Jacket',1500)`);
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Dior','Hat',400)`);
    await connection.execute(`INSERT INTO Clothes_Price VALUES ('Chanel','Bag',2000)`);

    // Clothes
    await connection.execute(`INSERT INTO Clothes VALUES (201,'Dress','Slim','Gucci')`);
    await connection.execute(`INSERT INTO Clothes VALUES (202,'Shoes','Regular','Prada')`);
    await connection.execute(`INSERT INTO Clothes VALUES (203,'Jacket','Loose','Versace')`);
    await connection.execute(`INSERT INTO Clothes VALUES (204,'Hat','OneSize','Dior')`);
    await connection.execute(`INSERT INTO Clothes VALUES (205,'Bag','Medium','Chanel')`);
    await connection.execute(`INSERT INTO Clothes VALUES (206,'Plastic Bag','Slim','Gucci')`);
    await connection.execute(`INSERT INTO Clothes VALUES (207,'Purse','Slim','Prada')`);
    

    // AppearsIn
    await connection.execute(`INSERT INTO AppearsIn VALUES (201,1,'12345678')`);
    await connection.execute(`INSERT INTO AppearsIn VALUES (202,2,'10293847')`);
    await connection.execute(`INSERT INTO AppearsIn VALUES (203,1,'87654321')`);
    await connection.execute(`INSERT INTO AppearsIn VALUES (204,1,'92096390')`);
    await connection.execute(`INSERT INTO AppearsIn VALUES (205,1,'82371382')`);

    // Wears
    await connection.execute(`INSERT INTO Wears VALUES ('987654321',201,'M','Slim')`);
    await connection.execute(`INSERT INTO Wears VALUES ('876543210',202,'L','Regular')`);
    await connection.execute(`INSERT INTO Wears VALUES ('765432109',203,'XL','Loose')`);
    await connection.execute(`INSERT INTO Wears VALUES ('654321098',204,'OneSize','OneSize')`);
    await connection.execute(`INSERT INTO Wears VALUES ('543210987',205,'M','Medium')`);
    

    // Brand
    await connection.execute(`INSERT INTO Brand VALUES ('Gucci',DATE '1921-03-01','IT','Kering')`);
    await connection.execute(`INSERT INTO Brand VALUES ('Prada',DATE '1913-05-02','IT','Prada Group')`);
    await connection.execute(`INSERT INTO Brand VALUES ('Versace',DATE '1978-12-02','IT','Versace')`);
    await connection.execute(`INSERT INTO Brand VALUES ('Dior',DATE '1946-12-16','FR','LVMH')`);
    await connection.execute(`INSERT INTO Brand VALUES ('Chanel',DATE '1910-08-19','FR','Chanel')`);

    // Branded
    await connection.execute(`INSERT INTO Branded VALUES ('Gucci',201)`);
    await connection.execute(`INSERT INTO Branded VALUES ('Prada',202)`);
    await connection.execute(`INSERT INTO Branded VALUES ('Versace',203)`);
    await connection.execute(`INSERT INTO Branded VALUES ('Dior',204)`);
    await connection.execute(`INSERT INTO Branded VALUES ('Chanel',205)`);

    await connection.execute(`COMMIT`);
}



// Query 1: Insert
// Create a new magazine
async function insertMagazine(issn, mname, genre, language, pname, country) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Magazine
            VALUES (:issn, :mname, :genre, :language, :pname, :country)`,
            [issn, mname, genre, language, pname, country],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Query 2: Update
// Update a magazine's information.
async function updateMagazine(mname, genre, language, pname, country, issn) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Magazine 
            SET mname = :mname, genre  = :genre, language = :language, pname = :pname, country = :country
            WHERE issn = :issn`,
            [mname, genre, language, pname, country, issn],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


// Query 3: DELETE
// delete all magazines with issues older with given date
async function deleteMagazineOlderThanDate(issn, cutoff_date) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Magazine m
            WHERE m.issn = :issn
            AND NOT EXISTS (
                SELECT *
                FROM Issue i
                WHERE i.issn = m.issn
                AND i.pdate >= TO_DATE(:cutoff_date, 'YYYY-MM-DD')
            )`,
            [issn, cutoff_date],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
        }).catch((err) => {
            throw Error('Error deleting magazine: ' + err.message);
        });
}


// make structure for options look like:
// {
//     ctype: 'shirt',
//     cfit: 'slim',
//     cfitOp: 'AND',
//     designer: 'gucci',
//     designerOp: 'OR'
// }

// Query 4: SELECT
// Search for clothing items based on type, fit, and/or designer preferences.
async function selectClothes(options) {
    return await withOracleDB(async (connection) => {
        let conds = [];
        let val = {};
        
        if (options.ctype) {
            conds.push({op: null, sql: 'UPPER(ctype) LIKE UPPER(:ctype)'});
            val.ctype = `%${options.ctype}%`;
        }
        if (options.cfit) {
            conds.push({op: options.cfitOp,  sql: 'UPPER(cfit) LIKE UPPER(:cfit)'}); // in ui, make sure to guarantee selection of and/or
            val.cfit = `%${options.cfit}%`;
        }
        if (options.designer) {
            conds.push({op: options.designerOp,  sql: 'UPPER(designer) = UPPER(:designer)'});
            val.designer = options.designer;
        }

        const whereParts = conds.map((content, index) => {
            if (index == 0) {
                return content.sql;

            } else {
                return `${content.op} ${content.sql}`; // ex: AND cfit LIKE :cfit
            }
        });

        let fullWhereStatement = ' ';

        if (whereParts.length > 0) {
            fullWhereStatement = `WHERE ${whereParts.join(' ')}`;
        } 

        const result = await connection.execute(
            `SELECT cid, ctype, cfit, designer
             FROM Clothes ${fullWhereStatement}`,
            val
        );
        
        return { success: true, data: result.rows };
    }).catch(err => ({ success: false, message: err.message }));
}


// Query 5: PROJECTION
// Display selected contributor details based on user's selection.

// make structure for options look like:
// {
//    attributes: ['email', 'cname']
// }
async function projectContributorDetails(options) {
    return await withOracleDB(async (connection) => {
        const attributes = ['email', 'agency', 'cname', 'address', 'birthday'];
        const selected = options.attributes.filter(attribute => attributes.includes(attribute)); // change later, can remove if make ui selection thru fixed buttons, not typed out
        
        if (selected.length === 0) {
            return { success: false, message: "No valid attributes selected", data: [] }; // omit if changes r made
        }
        
        const fullSelectStatement= selected.join(', ');
        
        const result = await connection.execute(
            `SELECT ${fullSelectStatement} FROM Contributor_EmailDetails`
        );
        
        return { success: true, data: result.rows };
    }).catch(err => ({ success: false, message: err.message, data: [] }));
}

// Query 6: JOIN
// Find all first page articles in a given magazine, in descending order of issue date
async function joinArticleIssue(options) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT a.header, i.pdate
                FROM Article a LEFT JOIN Issue i ON a.issuenum = i.issuenum
                WHERE a.pagestart = 1 AND i.issn = :issn
                ORDER BY i.pdate DESC `,
            {  issn: options.issn }
        );
        
        return { success: true, data: result.rows };
    }).catch(err => ({ success: false, message: err.message, data: [] }));
}

// Query 7: GROUP BY
// Count how many authors worked on each magazine issue.
async function countAuthorsPerMagazineIssue() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT issn, COUNT(*) FROM WorkedOn w, Author a WHERE w.sin = a.sin GROUP BY issn');
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

// Query 8: HAVING
// Find publishers publishing more magazines than the average per country.
async function publishedMoreMagazinesThanAvgCountry() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT pname, country, COUNT(*)
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
                )`
        );
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

// Query 9: NESTED AGGREGATION
// Find the contributors who worked on the highest number of issues.
async function contributorHighestNumIssues() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT w.sin, COUNT(*) AS issue_count
            FROM WorkedOn w
            GROUP BY w.sin
            HAVING COUNT(*) = (
                SELECT MAX(issue_total)
                FROM (
                    SELECT COUNT(*) AS issue_total
                    FROM WorkedOn
                    GROUP BY sin
                )
            )`
        );
        
        return { success: true, data: result.rows };
    }).catch(err => ({ success: false, message: err.message, data: [] }));
}

// Query 10: DIVISION
// Find models who have worn every clothing item by a designer.
async function modelsWearingAllOfDesigner() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
    `SELECT e.cname
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
    )`
        );

        return { success: true, data: result.rows };
    }).catch(err => ({ success: false, message: err.message, data: [] }));
}


module.exports = {
    testOracleConnection,
    closePoolAndExit,
    withOracleDB,
    fetchMagtableFromDb,
    fetchArticlesFromDb,
    fetchContributorsFromDb,
    fetchIssuesFromDb,
    fetchClothesFromDb,
    fetchAuthorsFromDb,
    initiateDatabase,
    insertMagazine,
    updateMagazine,
    deleteMagazineOlderThanDate,
    selectClothes,
    projectContributorDetails,
    joinArticleIssue,
    countAuthorsPerMagazineIssue,
    publishedMoreMagazinesThanAvgCountry,
    contributorHighestNumIssues,
    modelsWearingAllOfDesigner,
    initializeConnectionPool
};
