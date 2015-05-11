/*
 * Service settings
 */
var Salesforce_settings = {
    "client_id": "3MVG9Y6d_Btp4xp6NR4mEa7XReexOcB3dNHEO0DHfpoC4gK3C1oR7iIvv74S0cKnO9.nMolTdVj4YsXmYboO",
    "redirect_url": "https://appery.io/app/salesforce/apperyio-salesforce-callback",
    "login_url": "https://login.salesforce.com/services/oauth2/authorize",
    "salesforce_instance_url": "https://mbplatformdemosp.my.salesforce.com",
    "salesforce_access_token": "Bearer 00D90000000qO5L!AR8AQNnlnj6kfG1hkF7s5EgbEaXAq2qILPo0gH0j6Ws3UPw.raxzTSuu2p.LyXR0w9gstU5tSho5kULrsDW8eCiOS9ZYucyH",
    "salesforce_api_version": "v33.0"
}

/*
 * Services
 */

var Salesforce_ASDetectResultsREST = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/apexrest/ASDetectREST/mary',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'get',

    'serviceSettings': Salesforce_settings
});

var Salesforce_ASDetectResultsRESTCreate = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/apexrest/ASDetectREST',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'post',
    'contentType': 'application/json',

    'serviceSettings': Salesforce_settings
});

var Salesforce_ASDetectResults__c_delete_service = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/data/{salesforce_api_version}/sobjects/ASDetectResults__c/{Id}',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'delete',

    'serviceSettings': Salesforce_settings
});

var Salesforce_ASDetectResults__c_update_service = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/data/{salesforce_api_version}/sobjects/ASDetectResults__c/{Id}',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'patch',
    'contentType': 'application/json',

    'serviceSettings': Salesforce_settings
});

var Salesforce_ASDetectResults__c_read_service = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/data/{salesforce_api_version}/sobjects/ASDetectResults__c/{Id}',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'get',

    'serviceSettings': Salesforce_settings
});

var Salesforce_ASDetectResults__c_create_service = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/data/{salesforce_api_version}/sobjects/ASDetectResults__c',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'post',
    'contentType': 'application/json',

    'serviceSettings': Salesforce_settings
});

var Salesforce_ASDetectResults__c_query_service = new Apperyio.RestService({
    'url': 'https://api.appery.io/rest/1/proxy/tunnel',
    'proxyHeaders': {
        'appery-proxy-url': '{salesforce_instance_url}/services/data/{salesforce_api_version}/query',
        'appery-transformation': 'checkTunnel',
        'appery-key': '1425453200903',
        'appery-rest': '3c493f2b-8e15-4d85-8b8d-942557da7c54'
    },
    'dataType': 'json',
    'type': 'get',

    'serviceSettings': Salesforce_settings
});