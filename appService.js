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

//initializeConnectionPool();

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

// Query 1: Insert
// Create a new article
async function insertArticle(doi, header, pagestart, pageend, issuenum, issn) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Article VALUES (:doi, :header, :pagestart, :pageend, :issuenum, :ISSN)`,
            [doi, header, pagestart, pageend, issuenum, issn],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// Query 2: Update
// Update a contributor's contact and agency information.
async function updateContributorContact(email, agency, cname, address, birthday) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Contributor_EmailDetails 
            SET agency = :agency, cname = :cname, address = :address, birthday = TO_DATE(:birthday, 'YYYY-MM-DD')
            WHERE email = :email`,
            [agency, cname, address, birthday, email],
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
            WHERE m.ISSN = :issn
            AND NOT EXISTS (
                SELECT *
                FROM Issue i
                WHERE i.ISSN = m.ISSN
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
// For this to work need at least one selection from user
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

module.exports = {
    testOracleConnection,
    closePoolAndExit,
    withOracleDB,
    insertArticle,
    updateContributorContact,
    deleteMagazineOlderThanDate,
    selectClothes,
    initializeConnectionPool
};