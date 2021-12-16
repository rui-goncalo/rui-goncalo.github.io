
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

function jsonToXLS() {
    fetch('https://raw.githubusercontent.com/rui-goncalo/rui-goncalo.github.io/main/GTM-PF47HNR_workspace39.json')
  .then(res => res.json()) // the .json() method parses the JSON response into a JS object literal
  .then(function(data) {
        const worksheet = XLSX.utils.json_to_sheet(data.containerVersion.trigger)
        const workbook = {
            Sheets:{
                'data':worksheet
            },
            SheetNames:['data']
        };
        const excelBuffer = XLSX.write(workbook, {bookType:'xlsx', type:'array'});
        console.log(data.containerVersion.tag)
        saveAsExcel(excelBuffer, 'myFile')
        })
}

function saveAsExcel(buffer, filename) {
    const data = new Blob([buffer], {type: EXCEL_TYPE });
    saveAs(data, filename+'_export_'+new Date().getTime()+EXCEL_EXTENSION)                                 
}
