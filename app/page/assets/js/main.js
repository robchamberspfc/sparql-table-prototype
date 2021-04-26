let tableQuery =
    "prefix%20rdfs%3A%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0A%0ASELECT%20%3Frow%20%3Fmeasure_reference%20%3Factions%20%3Fambition%20%3Flead_organisation%20%3Fmeasure_text%20%3Fstatus%20%0AWHERE%20%7B%20%0A%20%20%3Frow%20%3Fp%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Faction%3E%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Factions%3E%20%3Factions%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fmeasure_reference%3E%20%3Fmeasure_reference%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fambition%3E%20%3FambitionURI%20.%0A%20%20%3FambitionURI%20rdfs%3Alabel%20%3Fambition%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Flead_organisation%3E%20%3Flead_organisation%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fmeasure_text%3E%20%3Fmeasure_text%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fstatus%3E%20%3FstatusURI%20.%0A%20%20%3FstatusURI%20rdfs%3Alabel%20%3Fstatus%20.%0A%20%20%20%20%20%20%7D%0AORDER%20BY%20asc%20(%3Fmeasure_reference)%0ALIMIT%2010000"

const root = "https://environment-test.data.gov.uk/linked-data/sparql?query=";

const structure = [{"name":"row","uri":1},{"name":"measure_reference","uri":1},{"name":"actions","uri":1},{"name":"ambition","uri":1},{"name":"status","uri":1}]


fetch(root + tableQuery, {
    headers: {
        'Accept': 'application/json'
    }
})
.then((response) => {
    return response.json();
}).then((data) => {
    let rows = []
    for (j = 0; j < structure.length; j++) {
        for (i = 0; i < data.results.bindings.length; i++) {
            if (rows[i] != null){              
                temp = rows[i]
                temp[[structure[j].name]] = data.results.bindings[i][structure[j].name].value
                rows[i] = temp
            } else {
                rows[i] = {[structure[j].name]: data.results.bindings[i][structure[j].name].value}
            }
        }
    }
    populateTable(rows);
}).catch(function (error) {
    console.log(error);
});

populateTable = data => {
for (i = 0; i < data.length; i++) {

    let tableRef = document.getElementById("table");
    let newRow = tableRef.insertRow(-1);

    for (j = 0; j < structure.length; j++) {   
            let Cell = newRow.insertCell(j);
            let Text = document.createTextNode(data[i][structure[j].name]);
            Cell.appendChild(Text);
    }
}
};