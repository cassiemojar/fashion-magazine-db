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


// Fetches and displays all articles
async function fetchAndDisplayArticles() {
    const tableElement = document.getElementById('articlesTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/articles', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches and displays all contributors
async function fetchAndDisplayContributors() {
    const tableElement = document.getElementById('contributorsTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/contributors', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Helper to format dates as YYYY-MM-DD
// Citation: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
function formatField(field) {
    if (typeof field === 'string') {
        return field.slice(0, 10);
    }
    return field;
}

// Fetches and displays all issues
async function fetchAndDisplayIssues() {
    const tableElement = document.getElementById('issuesTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/issues', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = formatField(field);
        });
    });
}

// Fetches and displays all clothes
async function fetchAndDisplayClothes() {
    const tableElement = document.getElementById('clothesTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/clothes', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches and displays all workedon
async function fetchAndDisplayWorkedOn() {
    const tableElement = document.getElementById('workedOnTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/workedon', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}


// Fetches and displays all authors
async function fetchAndDisplayAuthors() {
    const tableElement = document.getElementById('authorsTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/authors-table', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches and displays all models
async function fetchAndDisplayModels() {
    const tableElement = document.getElementById('modelsTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/models', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches and displays all photographers
async function fetchAndDisplayPhotographers() {
    const tableElement = document.getElementById('photographersTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/photographers', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches and displays all Birthday
async function fetchAndDisplayBirthday() {
    const tableElement = document.getElementById('birthdayTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch('/birthday', { method: 'GET' });
    const responseData = await response.json();
    if (tableBody) tableBody.innerHTML = '';
    responseData.data.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = tr.insertCell(index);
            cell.textContent = formatField(field);
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
            cell.textContent = formatField(field);
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
            cell.textContent = formatField(field);
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

async function insertContributor(event) {
    event.preventDefault();

    const sin      = document.getElementById('insertSIN').value;
    const email    = document.getElementById('insertEmail').value;
    const cname    = document.getElementById('insertCname').value || null;
    const agency   = document.getElementById('insertAgency').value || null;
    const address  = document.getElementById('insertAddress').value || null;
    const birthday = document.getElementById('insertBirthday').value || null;
    const role     = document.getElementById('insertRole').value;
    const height   = document.getElementById('insertHeight').value || null;

    const response = await fetch('/contributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sin, email, cname, agency, address, birthday, role, height })
    });

    const responseData = await response.json();
    document.getElementById('insertContribResultMsg').textContent = responseData.message;

    if (responseData.success) {
        fetchTableData();
    }
}

async function insertDemotable(event) {
    event.preventDefault();

    const issnValue = document.getElementById('insertISSN').value;
    const nameValue = document.getElementById('insertName').value || null;
    const genreValue = document.getElementById('insertGenre').value || null;
    const langValue = document.getElementById('insertLanguage').value || null;
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
    document.getElementById('insertResultMsg').textContent = responseData.message;
    
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
    const cutoff = document.getElementById('deleteDate').value;

    const response = await fetch(`/magazines/${ISSNValue}?cutoff_date=${cutoff}`, {
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
    let attributeArray = attributeString.trim().split(/\,\s*/)

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
async function authorPerMagazineIssue() {
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
async function publishedGreaterAvgMag() {
    const response = await fetch('/published-greater-avg-mag', { 
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
async function contributorHighestNumIssues() {
    const response = await fetch('/contributor-highest-num-issues', { 
        method: "GET"
    });

    const responseData = await response.json();

    if (responseData.success) {
        displayNestedAgg(responseData.data);
    } else {
        messageElement.textContent = responseData.message;
    }
}

// Query 10: Division
async function modelsWearAllDesigner() {
    const response = await fetch('/models-wear-all-designer', { 
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
    document.getElementById("resetDB").addEventListener("click", resetDB);
    document.getElementById("insertContributor").addEventListener("submit", insertContributor);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updateMagDemotable").addEventListener("submit", updateMagDemotable);
    document.getElementById("deleteOldMags").addEventListener("submit", deleteMag);
    document.getElementById("selectClothes").addEventListener("submit", selectClothes);
    document.getElementById("projectContrib").addEventListener("submit", projectClothes);
    document.getElementById("joinArticle").addEventListener("submit", joinArticle);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayMagazines();
    fetchAndDisplayArticles();
    fetchAndDisplayContributors();
    fetchAndDisplayIssues();
    fetchAndDisplayClothes();
    fetchAndDisplayWorkedOn();
    fetchAndDisplayAuthors();
    fetchAndDisplayModels();
    fetchAndDisplayPhotographers();
    fetchAndDisplayBirthday();
}
