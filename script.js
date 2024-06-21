let workbook, worksheet;

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

function displaySheet(sheet) {
    const htmlString = XLSX.utils.sheet_to_html(sheet);
    document.getElementById('output').innerHTML = htmlString;
}

function filterFile() {
    const filterText = document.getElementById('filter-input').value;
    if (filterText && worksheet) {
        const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        let found = false;

        for (let rowIndex = 0; rowIndex < jsonSheet.length; rowIndex++) {
            const row = jsonSheet[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const cellValue = row[colIndex];
                if (cellValue && cellValue.toString().includes(filterText)) {
                    console.log('Row:', row.join(', '));
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (!found) {
            console.log('No matches found');
        }
    }
}
