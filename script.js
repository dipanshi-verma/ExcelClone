let sheetCount = 0;
let cellData = {};
let currentCell = null;

function createNewSheet(containerId) 
{
    const container = document.getElementById(containerId);
    const spreadsheet = document.createElement('div');
    spreadsheet.className = 'spreadsheet';
    spreadsheet.dataset.sheetId=+sheetCount;

    spreadsheet.appendChild(document.createElement('div'));

    // to maintain column
    for(let col=0;col<20;col++)
    {
      const colHeader = document.createElement('div');
        colHeader.className = 'header';
        colHeader.textContent = String.fromCharCode(65 + col); // A, B, C, ...
        spreadsheet.appendChild(colHeader);
    }  

    // to maintain rows  
    for(let row=1;row<=25;row++)
    {
      const rowHeader = document.createElement('div');
        rowHeader.className = 'row-header';
        rowHeader.textContent = row; // 1, 2, 3, ...
        spreadsheet.appendChild(rowHeader);

        for(let col=0;col<20;col++)
        {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.contentEditable = true;
            const cellId = `S${sheetCount}_${String.fromCharCode(65 + col)}${row}`;
            cell.dataset.id = cellId;
            cell.addEventListener('click',()=>currentCell = cell);
            cell.addEventListener('input', ()=>{
                cellData[cellId] = {
                    value:cell.innerText,
                    color: cell.style.color,
                    bg:cell.style.backgroundColor
                }
            })
            
            spreadsheet.appendChild(cell);

        }  
    }
    container.appendChild(spreadsheet);

}

function format(command)
{
    document.execCommand(command, false, null);

}

function applyColor(color,type){
    if(currentCell)
    { 
       currentCell.style[type] = color;
       const cellId = currentCell.dataset.id;
       cellData[cellId] = cellData[cellId] || {};
       cellData[cellId][type === 'color' ? 'color':'bg'] = color;
    }
}


document.getElementById('fontSelect').addEventListener('change', function() {
    document.execCommand('fontName', false, this.value);
})

document.getElementById('fontSizeSelect').addEventListener('change',function(){
    document.execCommand('fontSize', false, this.value);
})


function addNewSheet() {
    createNewSheet('spreadsheetContainer');
}

function exportToCSV()
{
    const sheet = document.querySelector('.spreadsheet:last-of-type');
    let csv = '';
    let rows = 25;
    let cols = 20;

    for(let row=1;row<=rows;row++)
    {
        let rowData = [];
        for(let col=0;col<cols;col++)
        {
            const cellId = `S${sheetCount}_${String.fromCharCode(65 + col)}${row}`;
            
                rowData.push(cellData[cellId]?.value ||'');
        }  
        csv += rowData.join(',') + '\n';
    }

    // blob => Binary Large Object 
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spreadsheet.csv`;
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL object
}   

createNewSheet('sheetContainer');