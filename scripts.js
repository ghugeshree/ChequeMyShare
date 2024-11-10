let entries = [];
let initials = [];

function addInitial() {
    const initialInput = document.getElementById('newInitial');
    const initial = initialInput.value.trim().toUpperCase();

    if (initial && initial != "ALL" && !initials.includes(initial)) {
        initials.push(initial);
        displayInitials();
        initialInput.value = '';
        initialInput.parentElement.MaterialTextfield.change('');
    } else {
        alert("Please enter a valid and unique initial.");
    }
}

function displayInitials() {
    const initialsCheckboxesDiv = document.getElementById('initialsCheckboxes');
    initialsCheckboxesDiv.innerHTML = ''; // Clear existing checkboxes

    // Add "ALL" checkbox only if there are 2 or more initials
    if (initials.length >= 2) {
        const allCheckboxLabel = document.createElement('label');
        allCheckboxLabel.className = 'checkbox-circle mdl-js-ripple-effect';
        allCheckboxLabel.setAttribute('for', 'checkbox-ALL');

        const allCheckboxInput = document.createElement('input');
        allCheckboxInput.type = 'checkbox';
        allCheckboxInput.id = 'checkbox-ALL';
        allCheckboxInput.className = 'checkbox-circle-input';
        allCheckboxInput.value = 'ALL';

        const allCheckboxSpan = document.createElement('span');
        allCheckboxSpan.className = 'checkbox-circle-label';
        allCheckboxSpan.textContent = 'ALL';

        allCheckboxLabel.appendChild(allCheckboxInput);
        allCheckboxLabel.appendChild(allCheckboxSpan);
        initialsCheckboxesDiv.appendChild(allCheckboxLabel);
        componentHandler.upgradeElement(allCheckboxLabel); // Upgrade the newly added element to MDL
    }

    initials.forEach(initial => {
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'checkbox-circle mdl-js-ripple-effect';
        checkboxLabel.setAttribute('for', 'checkbox-' + initial);

        const checkboxInput = document.createElement('input');
        checkboxInput.type = 'checkbox';
        checkboxInput.id = 'checkbox-' + initial;
        checkboxInput.className = 'checkbox-circle-input';
        checkboxInput.value = initial;

        const checkboxSpan = document.createElement('span');
        checkboxSpan.className = 'checkbox-circle-label';
        checkboxSpan.textContent = initial;

        checkboxLabel.appendChild(checkboxInput);
        checkboxLabel.appendChild(checkboxSpan);
        initialsCheckboxesDiv.appendChild(checkboxLabel);
        componentHandler.upgradeElement(checkboxLabel); // Upgrade the newly added element to MDL
    });
}

function addEntry() {
    const amountInput = document.getElementById('amount');
    const detailsInput = document.getElementById('details');
    let amountInputValue = amountInput.value.trim();
    const details = detailsInput.value.trim();
    let amount = 0;

    // Check if amount contains + or - and perform calculation
    if (amountInputValue.includes('+')) {
        const parts = amountInputValue.split('+').map(part => parseFloat(part.trim()));
        amount = parts.reduce((acc, val) => acc + val, 0);
    } else if (amountInputValue.includes('-')) {
        const parts = amountInputValue.split('-').map(part => parseFloat(part.trim()));
        amount = parts.reduce((acc, val) => acc - val, 0);
    } else {
        amount = parseFloat(amountInputValue);
    }

    // Validate parsed amount
    if (isNaN(amount) || !isFinite(amount)) {
        alert("Please enter a valid numeric amount.");
        return;
    }

    // Validate details and checked initials
    const checkedInitials = Array.from(document.querySelectorAll('#initialsCheckboxes input:checked')).map(cb => cb.value);
    if (details && checkedInitials.length > 0) {
        entries.push({ amount, details, initials: checkedInitials.join(',') });
        displayEntries();
        amountInput.value = '';
        detailsInput.value = '';
        amountInput.parentElement.MaterialTextfield.change('');
        detailsInput.parentElement.MaterialTextfield.change('');

        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('#initialsCheckboxes input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.parentElement.classList.remove('is-checked'); // Remove MDL checked style
        });

    } else {
        alert("Please enter valid details and select at least one initial.");
    }
}


function displayEntries() {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = '<h2 class="mdl-typography--title"></h2>';
    
    const table = document.createElement('table');
    table.className = 'mdl-data-table mdl-js-data-table mdl-shadow--2dp';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Name', 'Details', 'Amount', '', ''];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.className = 'mdl-data-table__cell--non-numeric';
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    entries.forEach((entry, index) => {
        const row = document.createElement('tr');

        const initialsCell = document.createElement('td');
        initialsCell.className = 'mdl-data-table__cell--non-numeric';
        initialsCell.textContent = entry.initials;

        const detailsCell = document.createElement('td');
        detailsCell.className = 'mdl-data-table__cell--non-numeric';
        detailsCell.textContent = entry.details;
        
        const amountCell = document.createElement('td');
        amountCell.className = 'mdl-data-table__cell--non-numeric';
        amountCell.textContent = `$${entry.amount.toFixed(2)}`;
        
        const editCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="material-icons">edit</i>';
        editButton.onclick = () => editEntry(index);
        editCell.appendChild(editButton);
        
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="material-icons">delete</i>';
        deleteButton.onclick = () => deleteEntry(index);
        deleteCell.appendChild(deleteButton);

        row.appendChild(initialsCell);
        row.appendChild(detailsCell);
        row.appendChild(amountCell);
        row.appendChild(editCell);
        row.appendChild(deleteCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    entriesDiv.appendChild(table);
    componentHandler.upgradeElement(table);  // Upgrade the table element to MDL
}

function editEntry(index) {
    const entry = entries[index];
    const newAmount = prompt("Enter new amount:", entry.amount);
    const newDetails = prompt("Enter new notes:", entry.details);
    const newInitials = prompt("Enter new initials (e.g., A,B,C):", entry.initials);

    if (newAmount !== null && newDetails !== null && newInitials !== null) {
        const amount = parseFloat(newAmount);
        const details = newDetails.trim();
        const initials = newInitials.trim();

        if (!isNaN(amount) && details && initials) {
            entries[index] = { amount, details, initials };
            displayEntries();
        } else {
            alert("Please enter a valid amount, details, and initials.");
        }
    }
}

function deleteEntry(index) {
    entries.splice(index, 1);
    displayEntries();
}

function calculateTotal() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    let totals = {};
    let masterTotal = 0;
    
    initials.forEach(initial => {
        totals[initial] = 0;
    });

    entries.forEach(entry => {
        const { amount, initials: entryInitials } = entry;
        let initialsArray = entryInitials.split(',').map(initial => initial.trim()).filter(initial => initial);

        if (initialsArray.includes('ALL')) {
            // Use all defined initials except 'ALL'
            initialsArray = initials.filter(initial => initial !== 'ALL');
        }

        if (initialsArray.length === 0) {
            alert("No valid initials are present to split the amount. Please add valid initials.");
            return;
        }

        const share = amount / initialsArray.length;

        initialsArray.forEach(initial => {
            totals[initial] += share;
        });
    });

    resultsDiv.innerHTML = '<h2 class="mdl-typography--title">Totals</h2>';
    for (const [initial, total] of Object.entries(totals)) {
        const result = document.createElement('div');
        result.textContent = `${initial}: $${total.toFixed(2)}`;
        resultsDiv.appendChild(result);
        masterTotal += total;
    }

    const total = document.createElement('div');
    total.textContent = `Total = $${masterTotal.toFixed(2)}`;
    resultsDiv.appendChild(total);
}


document.getElementById('download-pdf').addEventListener('click', function() {
    const element = document.createElement('div');
    const shoppedAtPlace = document.getElementById('placeShoppedName')
    const shoppedAtDate = document.getElementById('placeShoppedDate')
    const entriesDiv = document.getElementById('entries').cloneNode(true);
    const resultsDiv = document.getElementById('results').cloneNode(true);
    
    element.appendChild(shoppedAtPlace);
    element.appendChild(shoppedAtDate);
    element.appendChild(entriesDiv);
    element.appendChild(resultsDiv);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const timestamp = `${year}-${month}-${day}`;
    const filename = `ChequeMyShare_${shoppedAtPlace}_${timestamp}.pdf`;
    
    html2pdf().from(element).save(filename);
});