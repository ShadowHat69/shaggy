document.addEventListener('DOMContentLoaded', () => {
    loadCSV('https://raw.githubusercontent.com/ShadowHat69/shaggy/main/Classes.csv');
});

document.getElementById('file-input').addEventListener('change', handleFile, false);

function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            workbook = XLSX.read(data, { type: 'array' });

            // Assuming we want to display the first sheet
            const firstSheetName = workbook.SheetNames[0];
            worksheet = workbook.Sheets[firstSheetName];
            displaySheet(worksheet);
        };
        reader.readAsArrayBuffer(file);
    }
}

function loadCSV(url) {
    fetch(url)
        .then(response => response.text())
        .then(csv => {
            const workbook = XLSX.read(csv, { type: 'string' });

            // Assuming we want to display the first sheet
            const firstSheetName = workbook.SheetNames[0];
            worksheet = workbook.Sheets[firstSheetName];
            displaySheet(worksheet);
        })
        .catch(error => console.error('Error loading the file:', error));
}

function displaySheet(sheet) {
    const htmlString = XLSX.utils.sheet_to_html(sheet);
    document.getElementById('output').innerHTML = htmlString;
}

function filterFile() {
    const filterText = document.getElementById('filter-input').value.trim(); // Trim leading/trailing whitespace

    // Check if filterText consists only of numeric characters
    const isNumeric = /^\d+$/.test(filterText);

    if (filterText && worksheet) {
        const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        let found = false;

        for (let rowIndex = 0; rowIndex < jsonSheet.length; rowIndex++) {
            const row = jsonSheet[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const cellValue = row[colIndex];

                // Convert cellValue to string and trim any leading/trailing whitespace
                const stringValue = (cellValue !== undefined && cellValue !== null) ? String(cellValue).trim() : '';

                // Use different comparison based on the type of filterText
                if (isNumeric) {
                    // Treat both values as integers if filterText is numeric
                    const intValue = parseInt(filterText, 10);
                    if (parseInt(stringValue, 10) === intValue) {
                        //console.log('Row:', row.join(', '));
                        rowstring = (row + ""); // Converts the row into a string by appending nothing to it.
                        answer = rowstring.split(',') //splits the row by each comma and puts it into answer array
                        console.log(answer[5]) //logs the 6th element of the array. The classroom
                        document.getElementById("maintitle").innerHTML = answer[5]  //sets the h2 to the classroom
                        document.getElementById("subtitle").innerHTML = answer[8]  //sets the h2 to the classroom
                        console.log(answer[8])
                        found = true;
                        break;
                    }
                } else {
                    // Treat both values as strings for case-insensitive search
                    if (stringValue.toLowerCase().includes(filterText.toLowerCase())) {
                        //console.log('Row:', row.join(', '));
                        rowstring = (row + ""); // Converts the row into a string by appending nothing to it.
                        answer = rowstring.split(',') //splits the row by each comma and puts it into answer array
                        console.log(answer[5]) //logs the 6th element of the array. The classroom
                        document.getElementById("maintitle").innerHTML = answer[5]  //sets the h2 to the classroom
                        document.getElementById("subtitle").innerHTML = answer[8]  //sets the h2 to the classroom
                        console.log(answer[8])
                        found = true;
                        break;
                    }
                }
            }
            if (found) break;
        }

        if (!found) {
            console.log('No matches found');
            document.getElementById("maintitle").innerHTML = "No Matches" //sets the h2 to the classroom
            document.getElementById("subtitle").innerHTML = ""  //sets the h2 to the classroom

        }
 
    }
    setTimeout(filterFile, 2000);
}

filterFile();

