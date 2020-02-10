# jsonp-modernized

A modernized package for sending [jsonp](https://en.wikipedia.org/wiki/JSONP) requests based on promises.

This package is based on the [original npm jsonp package](https://www.npmjs.com/package/jsonp) and is ment to resolve some of its shortcomings:

* At the time of writing, the original jsonp package has been not been updated since 2016
* The original jsonp package does not handle errors properly, only waiting for timeout even if server error is encountered
* The original jsonp package does not support promises

## Features

* Requests based on ES6 promises
* Proper error handling and clear error messages
* Support query parameters with optional encoding
* Fully customizable callback function and parameter names

## Installation

```
npm i jsonp-modernized --save
```

## Usage

Import package

```javascript
// Common js
const jsonp = require('jsonp-modernized');

// ES
import jsonp from 'jsonp-modernized';

// CDN
<script src="https://unpkg.com/jsonp-modernized/dist/jsonp.min.js"></script>
```

Basic usage
```javascript
jsonp(url, options)
    .then(function(responseData) {
        // Response is parsed json
        console.log(responseData);
    })
    .catch(function(error) {
        // Error contains message and previous if applicable
        console.log(error);
    });
```

## Options

All options are optional

| option            | type                     | default    |
|-------------------|--------------------------|------------|
| callbackFunction  | string (min:1)           | "__jp[ID]" |
| callbackParameter | string (min:1)           | "callback" |
| timeout           | integer (min:0) or false | 60000      |
| parameters        | object                   | {}         |
| encodeParameters  | boolean                  | true       |

#### callbackFunction

Generated callback function signature. [ID] is a placeholder that will be
replaced with an unique id generated by the library.

#### callbackParameter
Name of the callback query parameter.

#### timeout
Request timeout in milliseconds

#### parameters
Request GET parameters

#### encodeParameters
Whether URL parameters should be url encoded

## Server side implementation

The external server should look for the presence of the "callback" parameter and return a response 
consisting of the callback followed by parenthesis wrapped around the json response string

Simple example using php
```php
$callback = $_GET['callback'] ?? null;

// Assume that this is a jsonp request based on the callback parameter and GET http method
if($callback !== null) {
    header('Content-Type', 'application/javascript');

    // Some response data
    $json = json_encode([
        'foo' => 'bar'
    ]);

    echo "$callback($json)";
    exit();
}
```

## Compatibility

Since JSONP is a relatively old protocol, it should generally be more widely
supported by older browsers when compared to CORS.

The following browsers have been tested manually:

| browser | version               |
|---------|-----------------------|
| Chrome  | 80.0.3987.87 (64-bit) |
| Firefox | 72.0.2 (64-bit)       |
| Edge    | 44.18362.449.0        |
