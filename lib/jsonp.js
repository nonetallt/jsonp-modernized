'use strict';

import JsonpRequest from './JsonpRequest';

function jsonp(url, options) {

    const request = new JsonpRequest(url, options);
    const promise = request.send();
    return promise;
}

export default jsonp;
