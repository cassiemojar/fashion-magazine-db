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

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
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

    if (responseData.success) {
        messageElement.textContent = responseData.message;
        fetchTableData();
    } else {
        messageElement.textContent = responseData.message;
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

    const response = await fetch('/magazines/' + oldISSNValue, {
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

    if (responseData.success) {
        messageElement.textContent = "Magazine updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating magazine!";
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
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayMagazines();
}
