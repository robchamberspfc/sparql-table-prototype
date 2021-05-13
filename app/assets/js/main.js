// const root = "https://environment-test.data.gov.uk/linked-data/sparql?query=";	

let config = [];
const tableRef = document.getElementById("table");
const tr = tableRef.getElementsByTagName("tr");

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
        let optionalStart = " ";
        let optionalEnd = " ";

        if (config.structure[j].optional != null) {
            optionalStart = " OPTIONAL { "
            optionalEnd = "}"
        }

        if (config.structure[j].label != null) {
            whereRequest = whereRequest + optionalStart + "?row <" + config.structure[j].uri + "> ?" + config.structure[j].name + "URI . ?" + config.structure[j].name + "URI " + config.structure[j].label + " ?" + config.structure[j].name + optionalEnd + " ."
        } else {
            whereRequest = whereRequest + optionalStart + "?row <" + config.structure[j].uri + "> ?" + config.structure[j].name + optionalEnd + " ."
        }
    };

    for (j = 0; j < config.filters.length; j++) {
        let temp = config.structure
        let index = temp.findIndex(temp => temp.name === config.filters[j]); 
        if (config.structure[index].label != null) {
            filterWhere = " WHERE {?row ?p <" + config.sparqlConfig.rdfsType + "> ." + "?row <" + config.structure[index].uri + "> ?" + config.filters[j] + "URI . ?" + config.filters[j] + "URI " + config.structure[index].label + " ?" + config.filters[j] + " ."
        } else {
            filterWhere = " WHERE {?row ?p <" + config.sparqlConfig.rdfsType + "> ." + "?row <" + config.structure[index].uri + "> ?" + config.filters[j] + " ."
        }
        console.log(encodeURIComponent(config.filters[j]))
        filterRequest = encodeURIComponent(config.sparqlConfig.prefix + "SELECT DISTINCT ?" + encodeURIComponent(config.filters[j]) + filterWhere + "} LIMIT " + config.sparqlConfig.limit)
        fetchFilters(filterRequest, config.filters[j])
    }

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
                    //add a default so that we can cope with missing values
                    let result = ""
                    //if the data for this specific value exists then add it
                    if (data.results.bindings[i][config.structure[j].name] != null) {
                        result = data.results.bindings[i][config.structure[j].name].value
                    }
                    if (rows[i] != null) {
                        temp = rows[i]
                        temp[[config.structure[j].name]] = result
                        rows[i] = temp
                    } else {
                        rows[i] = {
                            [config.structure[j].name]: result
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
        let newRow = tableRef.insertRow(-1);
        for (j = 0; j < config.structure.length; j++) {
            let Cell = newRow.insertCell(j);
            let Text = document.createTextNode(data[i][config.structure[j].name]);
            Cell.appendChild(Text);
        }
    }
};

filterRows = (tr, data, column) => {
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[column];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(data) != 0) {
                tr[i].style.display = "none";
            }
        }
    }
}

filterTable = () => {
    for (i = 0; i < tr.length; i++) {
        tr[i].style.display = "";
    }
    for (j = 0; j < config.filters.length; j++)  {
        let selectMenu = document.getElementById("choose"+[config.filters[j]]);
        text = selectMenu.selectedOptions[0].text.toUpperCase();
        if (text != "SELECT "+ config.filters[j].toUpperCase()) {
            let temp = config.structure  
            const index = temp.findIndex(temp => temp.name === config.filters[j]);
            filterRows(tr, text, index)
        }
    }
}

fetchFilters = (filterQuery, filter) => {
    fetch(config.apiRoot + filterQuery, {
            headers: {
                'Accept': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        }).then((data) => {
            let selections = [];
            for (i = 0; i < data.results.bindings.length; i++) {
                selections.push(data.results.bindings[i][filter].value)
            }
            populateSelect(selections, filter)
        }).catch(function (error) {
            console.log(error);
        });
}

populateSelect = (data, select) => {
    let selectMenu = document.getElementById("choose"+[select]);
    for (i = 0; i < data.length; i++) {
        selectMenu.options[selectMenu.options.length] = new Option(data[i], data[i]);
    }
};