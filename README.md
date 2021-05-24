# sparql-table-prototype

Used to create a table of data for a specific `rdfs:type` via a sparql query and present this on a page.

[app/_data/site.json](app/_data/site.json) is used to define the contents of the table and build the query.

## Example

```
{
    "title": "Animals",
    "feedback": "rob@swirrl.com",
    "introText": "This page shows a simple table based on a SPARQL query to PMD",
    "tableTitle": "Fish",
    "tableHeaders": ["Name", "Colour", "Knows", "Number of fins"],
    "apiRoot": "http://localhost:3001/v1/sparql/live?query=",
    "sparqlConfig": {
        "limit": "100",
        "prefix": "prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#>",
        "rdfsType": "http://muttnik.gov/ontologies/animals/fish"
    },
    "structure": [{
        "name": "Name",
        "uri": "http://www.w3.org/2000/01/rdf-schema#label"
    }, {
        "name": "Colour",
        "uri": "http://muttnik.gov/ontologies/animals/colour",
        "label": "rdfs:label"
    }, {
        "name": "Knows",
        "uri": "http://xmlns.com/foaf/0.1/knows",
        "optional": "y"
    }, {
        "name": "Fins",
        "uri": "http://muttnik.gov/ontologies/animals/numberOfFins",
        "optional": "y"
    }],
    "filters":["Knows", "Colour", "Fins"]
}
```

## 'sparqlConfig' section
Used to set some defaults and set the rdfs:type for the table.

## Structure section
name: gives the variable used in the sparql query
uri: Unique identifier for this value
label: Add the label type, e.g. `"rdfs:label"`
optional: If can be missing values, include as optional with `y`

```
    "structure": [{
        "name": "Colour",
        "uri": "http://muttnik.gov/ontologies/animals/colour",
        "label": "rdfs:label"
        "optional": "y"
    }]
```

## Filters section
Leave blank or remove to exclude filters