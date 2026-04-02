// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the magazine table and displays it.
async function fetchAndDisplayMagazines() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/magtable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(magazine => {
        const row = tableBody.insertRow();
        magazine.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Displays table for query 4
async function displaySelectClothes(data) {
    const tableElement = document.getElementById("selectTable");
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Displays table for query 5
async function displayProjectContributors(data, selected) {
    const tableElement = document.getElementById("projectTable");
    const tableHead = tableElement.querySelector('thead');
    const tableBody = tableElement.querySelector('tbody');

    if (tableHead) {
        tableHead.innerHTML = '';
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    let headRow = tableHead.insertRow();
    selected.forEach(attribute => {
        const cell = headRow.insertCell();
        cell.textContent = attribute;
    });

    data.forEach(person => {
        const row = tableBody.insertRow();
        person.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Display for query 6
async function displayJoinArticles(data) {
    const tableElement = document.getElementById("joinTable");
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(article => {
        const row = tableBody.insertRow();
        article.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Display for query 7
async function displayGroupByIssue(data) {
    const tableElement = document.getElementById("groupByTable");
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(issue => {
        const row = tableBody.insertRow();
        issue.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Display for query 8
async function displayHaving(data) {
    const tableElement = document.getElementById("havingTable");
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(issue => {
        const row = tableBody.insertRow();
        issue.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Display for query 9
async function displayNestedAgg(data) {
    const tableElement = document.getElementById("aggregationTable");
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(issue => {
        const row = tableBody.insertRow();
        issue.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Display for query 10
async function displayDivision(data) {
    const tableElement = document.getElementById("divisionTable");
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    data.forEach(issue => {
        const row = tableBody.insertRow();
        issue.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the database.
async function resetDB() {
    const response = await fetch("/init-db", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "database initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating database!");
    }
}

// QUERY 1
// Inserts new records into the table.
async function insertDemotable(event) {
    event.preventDefault();

    const issnValue = document.getElementById('insertISSN').value;
    const nameValue = document.getElementById('insertName').value;
    const genreValue = document.getElementById('insertGenre').value;
    const langValue = document.getElementById('insertLanguage').value;
    const pubValue = document.getElementById('insertPublisher').value;
    const countryValue = document.getElementById('insertCountry').value;


    const response = await fetch('/magazines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            issn: issnValue,
            mname: nameValue,
            genre: genreValue,
            language: langValue,
            pname: pubValue,
            country: countryValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    messageElement.textContent = responseData.message;
    
    if (responseData.success) {
        fetchTableData();
    }
}

//QUERY 2
// Updates names in the demotable.
async function updateMagDemotable(event) {
    event.preventDefault();

    const oldISSNValue = document.getElementById('updateOldISSN').value;
    const nameValue = document.getElementById('updateName').value;
    const genreValue = document.getElementById('updateGenre').value;
    const langValue = document.getElementById('updateLanguage').value;
    const pubValue = document.getElementById('updatePublisher').value;
    const countryValue = document.getElementById('updateCountry').value;

    const response = await fetch(`/magazines/${oldISSNValue}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mname: nameValue,
            genre: genreValue,
            language: langValue,
            pname: pubValue,
            country: countryValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    messageElement.textContent = responseData.message;
    
    if (responseData.success) {
        fetchTableData();
    }
}

// QUERY 3
// Delete row from demotable
async function deleteMag(event) {
    event.preventDefault();

    const ISSNValue = document.getElementById('deleteISSN').value;
    const cuttoff = document.getElementById('deleteDate').value;

    const response = await fetch(`/magazines/${ISSNValue}?cuttoff_date=${cuttoff}`, {
        method: 'DELETE'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    messageElement.textContent = responseData.message;

    if (responseData.success) {
        fetchTableData();
    }
}


// QUERY 4: select
async function selectClothes(event) {
    event.preventDefault();

    const ctype = document.getElementById("selectType").value;
    const cfit = document.getElementById("selectFit").value;
    const cfitOp = document.getElementById("selectOption1").value;
    const designer = document.getElementById("selectDesigner").value;
    const designerOp = document.getElementById("selectOption2").value;

    const response = await fetch('/clothes/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ctype: ctype,
            cfit: cfit,
            cfitOp: cfitOp,
            designer: designer,
            designerOp: designerOp
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('selectResultMsg');

    if (responseData.success) {
        displaySelectClothes(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 5: Project
async function projectClothes(event) {
    event.preventDefault();

    const attributeString = document.getElementById("attributeEntry").value;
    let attributeArray = attributeString.trim().split(/\'\s*/)

    const response = await fetch('/contributors/project', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            attributes: attributeArray
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('projectResultMsg');

    if (responseData.success) {
        displayProjectContributors(responseData.data, attributeArray);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 6: Join
async function joinArticle(event) {
    event.preventDefault();
    
    const issnValue = document.getElementById("joinGetMag").value;
    
    const response = await fetch(`/articles/first-page?issn=${issnValue}`, {
        method: "GET"
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('joinResultMsg');

    if (responseData.success) {
        displayJoinArticles(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 7: Group By
async function query7() {
    const response = await fetch('/analytics/authors-per-magazine-issue', {
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        displayGroupByIssue(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 8: Having
async function query8() {
    const response = await fetch('/placeholder', { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        displayHaving(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 9: Nested Aggregation
async function query9() {
    const response = await fetch('/placeholder', { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        displayNestedAgg(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 10: division
async function query10() {
    const response = await fetch('/placeholder', { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        displayDivision(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDB").addEventListener("click", resetDB());
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("deleteOldMags").addEventListener("submit", deleteMag());
    document.getElementById("selectClothes").addEventListener("submit", selectClothes());
    document.getElementById("projectContrib").addEventListener("submit", projectClothes());
    document.getElementById("joinArticle").addEventListener("submit", joinArticle());
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayMagazines();
}
