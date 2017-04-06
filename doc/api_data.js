define({ "api": [
  {
    "type": "post",
    "url": "/new",
    "title": "Adding an item",
    "name": "Add_new",
    "group": "Items",
    "description": "<p>A sequence which happens when the Add-form's submit is triggered</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "FormData",
            "optional": false,
            "field": "A",
            "description": "<p>FormData object containing all the information from the Add-form</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "doc/server.js",
    "groupTitle": "Items"
  },
  {
    "type": "get",
    "url": "/post/:search",
    "title": "Getting an item/items",
    "name": "Search",
    "group": "Items",
    "description": "<p>Get items from database with a search query</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "search",
            "description": "<p>User's query for the search</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "Array",
            "description": "<p>List of the items matching the query</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n\"_id\":\"58e2190793d2433b162979b8\",\n\"category\":\"Wizard\",\n\"title\":\"merlin\",\n\"details\":\"asd\",\n\"thumbnail\":\"thumb/1491212551665.jpg\",\n\"image\":\"img/1491212551665.jpg\",\n\"original\":\"original/1491212551665.jpg\",\n\"time\":\"2017-04-03T09:42:31.708Z\",\n\"__v\":0\n}]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "doc/server.js",
    "groupTitle": "Items"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "doc/main.js",
    "group": "_home_arttu_WebstormProjects_week3_doc_main_js",
    "groupTitle": "_home_arttu_WebstormProjects_week3_doc_main_js",
    "name": ""
  }
] });