export const messageschema = {
  "$id": "messageSchema",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Message",
  "type": "object",
  "format": "categories",
  "basicCategoryTitle": "Main",
  "properties": {
    "label": {
      "type": "string",
      "description": "the label for the item"
    },
    "color": {
      "type": "string",
      "format":"color",
      "description": "the color"
    },
    "type": {
      "title": "I should be changed to 'foo'",
      "type": "string",
      "enum": ["text","number","date"],
      "default": "text"
    },
    "textsettings": {
      "title": "I depend on type to be 'text'",
      "type": "object",
      "properties": {
        "txtlabel": {
          "type": "string",
          "description": "the label for the text type question"
        },
      },
      "options": {
        "dependencies": {
          "type": "text"
        }
      },
      "default":{
        "txtlabel" : 'default label for text elememnt'
      }
    },
    "numbersettings": {
      "title": "I depend on type to be 'number'",
      "type": "object",
      "properties": {
        "numlabel": {
          "type": "string",
          "description": "the label for the numeric type question"
        },
      },
      "default":{
        "numlabel" : 'default label for numeric elememnt'
      },
      "options": {
        "dependencies": {
          "type": "number"
        }
      }
    },

    "ports": {
      "type": "array",
      "format": "table",
      "title": "Ports",
      "minItems": 1,
      "maxItems": 5,
      "uniqueItems": true,
      "items": {
        "type": "object",
        "title": "Port",
        "properties": {
          "id": {
            "type": "string",
            "description": "id of the port"
          },
          "label": {
            "type": "string",
            "description": "text of the port"
          }
        }
      },
      "default": [
        {
          "id": "default",
          "label": "default"
        }
      ]
    },
  }
}