const { 
    testOracleConnection, 
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
    withOracleDB,
    initializeConnectionPool
} = require('./appService');

async function runTests() {
    // Wait for pool to initialize first
    await initializeConnectionPool();

    // Test 1: Check connection
    console.log('Testing connection...');
    const connected = await testOracleConnection();
    console.log('Connected:', connected);

    

    // Test 2: Insert a magazine
    console.log('\nTesting insertMagazine...');
    const inserted = await insertMagazine('12345678', 'Test Magazine', 'Fashion', 'English', 'Vogue', 'US');
    console.log('Insert success:', inserted);

    // Test 3: Update a magazine
    console.log('\nTesting updateMagazine...');
    const updated = await updateMagazine('Updated Magazine', 'Technology', 'English', 'Marie Claire', 'CA', '12345678');
    console.log('Update success:', updated);

    // Test 4: Delete a magazine
    console.log('\nTesting deleteMagazineOlderThanDate...');
    const deleted = await deleteMagazineOlderThanDate('12345678', '2030-01-01');
    console.log('Delete success:', deleted);

    // Test 5: Select clothes - ctype only
    console.log('\nTesting selectClothes - ctype only...');
    const result1 = await selectClothes({ ctype: 'dreSs' });
    console.log('Select ctype only:', result1);

    // Test 6: Select clothes - ctype AND cfit
    console.log('\nTesting selectClothes - ctype AND cfit...');
    const result2 = await selectClothes({ ctype: 'shirt', cfit: 'slim', cfitOp: 'AND' });
    console.log('Select ctype AND cfit:', result2);

    // Test 7: Select clothes - ctype OR designer
    console.log('\nTesting selectClothes - ctype OR designer...');
    const result3 = await selectClothes({ ctype: 'Shirt', designer: 'Gucci', designerOp: 'OR' });
    console.log('Select ctype OR designer:', result3);

    // Test 8: Select clothes - no filters (return all)
    console.log('\nTesting selectClothes - no filters...');
    const result4 = await selectClothes({});
    console.log('Select all:', result4);

    // Test 9: Project contributor - valid attributes
    console.log('\nTesting projectContributorDetails - email and cname...');
    const proj1 = await projectContributorDetails({ attributes: ['email', 'cname'] });
    console.log('Project email, cname:', proj1);

    // Test 10: Project contributor - all attributes
    console.log('\nTesting projectContributorDetails - all attributes...');
    const proj2 = await projectContributorDetails({ attributes: ['email', 'agency', 'cname', 'address', 'birthday'] });
    console.log('Project all:', proj2);

    // Test 11: Project contributor - invalid attribute (should be filtered out)
    console.log('\nTesting projectContributorDetails - invalid attribute...');
    const proj3 = await projectContributorDetails({ attributes: ['email', 'DROP TABLE'] });
    console.log('Project with invalid attr:', proj3);

    // Test 12: Project contributor - no valid attributes
    console.log('\nTesting projectContributorDetails - no valid attributes...');
    const proj4 = await projectContributorDetails({ attributes: ['INVALID', 'GARBAGE'] });
    console.log('Project no valid attrs:', proj4);

    // Test 13: Join - first page articles for a specific magazine
    console.log('\nTesting joinArticleIssue - existing magazine...');
    const join1 = await joinArticleIssue({ issn: '87654321' });
    console.log('Join result:', join1);

    // Test 14: Join - magazine with no articles
    console.log('\nTesting joinArticleIssue - magazine with no articles...');
    const join2 = await joinArticleIssue({ issn: '00000000' });
    console.log('Join no results:', join2);

    // Test 15: Group by - count authors per magazine issue
    console.log('\nTesting countAuthorsPerMagazineIssue...');
    const groupBy = await countAuthorsPerMagazineIssue();
    console.log('Authors per issue:', groupBy);

    // Test 16: Having - publishers with more magazines than avg
    console.log('\nTesting publishedMoreMagazinesThanAvgCountry...');
    const having = await publishedMoreMagazinesThanAvgCountry();
    console.log('Publishers above avg:', having);

    // Test 17: Nested aggregation - contributors with most issues
    console.log('\nTesting contributorHighestNumIssues...');
    const nested = await contributorHighestNumIssues();
    console.log('Top contributors:', nested);

    // Test 18: Division - models wearing all clothes by a designer
    console.log('\nTesting modelsWearingAllOfDesigner...');
    const division = await modelsWearingAllOfDesigner();
    console.log('Models wearing all:', division);


    process.exit();
}

runTests();