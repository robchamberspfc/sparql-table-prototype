// let tableQuery =
//     "prefix%20rdfs%3A%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0A%0ASELECT%20%3Frow%20%3Fmeasure_reference%20%3Factions%20%3Fambition%20%3Flead_organisation%20%3Fmeasure_text%20%3Fstatus%20%0AWHERE%20%7B%20%0A%20%20%3Frow%20%3Fp%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Faction%3E%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Factions%3E%20%3Factions%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fmeasure_reference%3E%20%3Fmeasure_reference%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fambition%3E%20%3FambitionURI%20.%0A%20%20%3FambitionURI%20rdfs%3Alabel%20%3Fambition%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Flead_organisation%3E%20%3Flead_organisation%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fmeasure_text%3E%20%3Fmeasure_text%20.%0A%20%20%3Frow%20%3Chttp%3A%2F%2Fenvironment.data.gov.uk%2Flinked-data%2Ffcerm%2Fstatus%3E%20%3FstatusURI%20.%0A%20%20%3FstatusURI%20rdfs%3Alabel%20%3Fstatus%20.%0A%20%20%20%20%20%20%7D%0AORDER%20BY%20asc%20(%3Fmeasure_reference)%0ALIMIT%2010000"

// const root = "https://environment-test.data.gov.uk/linked-data/sparql?query=";
const root = "http://localhost:3001/v1/sparql/live?query=";

const structure = [{"name":"licenceName","uri":"http://environment.data.gov.uk/linked-data/definition/licenceName"},{"name":"licenceUrl","uri":"http://environment.data.gov.uk/linked-data/definition/licenceUrl"}]
const id = "http://environment.data.gov.uk/linked-data/licence"
// const structure = [{"name":"measure_reference","uri":"http://environment.data.gov.uk/linked-data/fcerm/measure_reference"},{"name":"actions","uri":"http://environment.data.gov.uk/linked-data/fcerm/actions"},{"name":"ambition","uri":"http://environment.data.gov.uk/linked-data/fcerm/ambition"},{"name":"status","uri":"http://environment.data.gov.uk/linked-data/fcerm/status"}]
// const id = "http://environment.data.gov.uk/linked-data/fcerm/action"

const prefix = "prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#>"
const limit = 10000

let selectRequest = "SELECT "
for (j = 0; j < structure.length; j++) {
    selectRequest = selectRequest + "?" + structure[j].name + " "
}

let whereRequest = "WHERE {?row ?p <"+ id +"> ."
for (j = 0; j < structure.length; j++) {
    whereRequest = whereRequest + "?row <" + structure[j].uri +"> ?" + structure[j].name + " ."
    //todo add support for labels
}


let endRequest = "} ORDER BY asc (?" + structure[0].name + ") LIMIT " + limit

tableQuery = encodeURIComponent(prefix + selectRequest + whereRequest + endRequest);

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

    //todo add in table headers

    let tableRef = document.getElementById("table");
    let newRow = tableRef.insertRow(-1);

    for (j = 0; j < structure.length; j++) {   
            let Cell = newRow.insertCell(j);
            let Text = document.createTextNode(data[i][structure[j].name]);
            Cell.appendChild(Text);
    }
}
};