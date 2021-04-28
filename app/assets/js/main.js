// const root = "https://environment-test.data.gov.uk/linked-data/sparql?query=";	

let config = [];

fetch("/_data/site.json")
    .then((response) => {
        return response.json();
    }).then((data) => {
        config = data;
        constructQuery();
    }).catch(function (error) {
        console.log(error);
    })

constructQuery = () => {
    let selectRequest = "SELECT ";
    let whereRequest = "WHERE {?row ?p <" + config.sparqlConfig.rdfsType + "> .";
    let endRequest = "} ORDER BY asc (?" + config.structure[0].name + ") LIMIT " + config.sparqlConfig.limit;

    for (j = 0; j < config.structure.length; j++) {
        selectRequest = selectRequest + "?" + config.structure[j].name + " "
    };

    for (j = 0; j < config.structure.length; j++) {
        if (config.structure[j].label != null) {
            whereRequest = whereRequest + "?row <" + config.structure[j].uri + "> ?" + config.structure[j].name + "URI . ?" + config.structure[j].name + "URI " + config.structure[j].label + " ?" + config.structure[j].name + " ."
        } else {
            whereRequest = whereRequest + "?row <" + config.structure[j].uri + "> ?" + config.structure[j].name + " ."
        }
    };

    tableQuery = encodeURIComponent(config.sparqlConfig.prefix + selectRequest + whereRequest + endRequest);
    fetchData(tableQuery);
}

fetchData = (tableQuery) => {
    fetch(config.apiRoot + tableQuery, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        }).then((data) => {
            let rows = [];
            for (j = 0; j < config.structure.length; j++) {
                for (i = 0; i < data.results.bindings.length; i++) {
                    if (rows[i] != null) {
                        temp = rows[i]
                        temp[[config.structure[j].name]] = data.results.bindings[i][config.structure[j].name].value
                        rows[i] = temp
                    } else {
                        rows[i] = {
                            [config.structure[j].name]: data.results.bindings[i][config.structure[j].name].value
                        };
                    }
                }
            }
            populateTable(rows);
        }).catch(function (error) {
            console.log(error);
        });
}

populateTable = data => {
    for (i = 0; i < data.length; i++) {

        let tableRef = document.getElementById("table");
        let newRow = tableRef.insertRow(-1);

        for (j = 0; j < config.structure.length; j++) {
            let Cell = newRow.insertCell(j);
            let Text = document.createTextNode(data[i][config.structure[j].name]);
            Cell.appendChild(Text);
        }
    }
};