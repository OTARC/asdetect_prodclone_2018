function salesforceLogin() {
    if (window.device == null) {
        loginWeb();
    } else {
        loginDevice();
    }
}

function loginWeb() {
    window.open(getLoginUrl(), "_blank");
    window.addEventListener('message', messageListener, false);
}

function loginDevice() {
    var ref = window.open(getLoginUrl(), "_blank", 'location=yes');
    ref.addEventListener('loadstart', loadStartListener, false);
    window.browser = ref;
}

function tryToSaveAccessToken(url) {
    if (url.indexOf("access_token") != -1) {
        var url_params = [];
        var params = url.slice(url.indexOf('#') + 1);
        params = params.split('&');
        for (var i in params) {
            var item = params[i].split('=');
            url_params[item[0]] = item[1];
        }
        sessionStorage.setItem('salesforce_access_token', "Bearer " + decodeURI(url_params.access_token));
        sessionStorage.setItem('salesforce_instance_url', decodeURIComponent(url_params.instance_url));
        return true;
    }
    return false;
}

function messageListener(event) {
    var msg = event.data;
    sessionStorage.setItem('salesforce_access_token', msg['access_token']);
    sessionStorage.setItem('salesforce_instance_url', msg['instance_url']);
    putTokenToServiceSettings();
    window.removeEventListener('message', messageListener);
}

function loadStartListener(event) {
    if (tryToSaveAccessToken(event.url)) {
        putTokenToServiceSettings();
        window.browser.removeEventListener('loadstart', loadStartListener, false);
        window.browser.close();
        delete window.browser;
    }
}

function getLoginUrl() {
    var client_id = Salesforce_settings['client_id'];
    var redirect_url = Salesforce_settings['redirect_url'];
    var login_url = Salesforce_settings['login_url'];
    return login_url + "?response_type=token&display=touch&client_id=" + client_id + "&redirect_uri=" + encodeURI(redirect_url);
}

function putTokenToServiceSettings() {
    Salesforce_settings['salesforce_instance_url'] = sessionStorage.getItem('salesforce_instance_url');
    Salesforce_settings['salesforce_access_token'] = sessionStorage.getItem('salesforce_access_token');
}