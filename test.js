const { 
    testOracleConnection, 
    insertMagazine, 
    updateMagazine,
    deleteMagazineOlderThanDate,
    selectClothes,
    initializeConnectionPool  // add this
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

    process.exit();
}

runTests();