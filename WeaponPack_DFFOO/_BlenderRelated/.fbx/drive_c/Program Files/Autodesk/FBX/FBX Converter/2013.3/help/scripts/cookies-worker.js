// The constructor function: creates a Cookie object for the specified
// document, with a specified name and optional attributes.
// Arguments:
//   document: The Document object for which the cookie is stored. Required.
//   name:     A string that specifies a name for the cookie. Required.
//   hours:    An optional number that specifies the number of hours from now
//             after which the cookie should expire.
//   path:     An optional string that specifies the cookie path attribute.
//   domain:   An optional string that specifies the cookie domain attribute.
//   secure:   An optional boolean value that, if true, requests a secure cookie.
//

function CookieWorker(document, name, hours, path, domain, secure) {
    // All the predefined properties of this object begin with '$'
    // to distinguish them from other properties, which are the values to
    // be stored in the cookie
    this.$document = document;
    this.$name = name;
	this.$is_webkit = RegExp(" AppleWebKit/").test(navigator.userAgent);

    if (hours) {
        this.$expiration = new Date((new Date()).getTime(  ) + hours*3600000);
    } else {
        this.$expiration = null;
    }
    if (path) {
        this.$path = path;
    } else {
        this.$path = null;
    }
    if (domain) {
        this.$domain = domain;
    } else {
        this.$domain = null;
    }
    if (secure) {
        this.$secure = true;
    } else {
        this.$secure = false;
    }
}

// This function is the store(  ) method of the Cookie object
CookieWorker.prototype.store = function ( object ) {
    // First, loop through the properties of the Cookie object and
    // put together the value of the cookie. Since cookies use the
    // equals sign and semicolons as separators, we'll use colons
    // and ampersands for the individual state variables we store
    // within a single cookie value. Note that we escape the value
    // of each state variable, in case it contains punctuation or other
    // illegal characters.

    var cookieval = "";
    for(var prop in object) {
        // Ignore properties with names that begin with '$' and also methods
        if ((prop.charAt(0) == '$') || ((typeof object[prop]) == 'function')) {
            continue;
        }
        if (cookieval != "") {
            cookieval += '&';
        }
        cookieval += prop + ':' + escape(object[prop]);
    }

    // Now that we have the value of the cookie, put together the
    // complete cookie string, which includes the name and the various
    // attributes specified when the Cookie object was created
    var cookie = this.$name + '=' + cookieval;
    if (this.$expiration) {
        cookie += '; expires=' + this.$expiration.toGMTString(  );
    }
    if (this.$path) {
        cookie += '; path=' + this.$path;
    }
    if (this.$domain) {
        cookie += '; domain=' + this.$domain;
    }
    if (this.$secure) {
        cookie += '; secure';
    }

    // Now store the cookie by setting the magic Document.cookie property
    //this.$document.cookie = cookie;
	if (this.$is_webkit) {
		try {
			localStorage.setItem(this.$name, cookie);
		} catch (e) { }
	} else {
		this.$document.cookie = cookie;
	}
};


// This function is the load(  ) method of the Cookie object
CookieWorker.prototype.load = function( object ) {
    // First, get a list of all cookies that pertain to this document
    // We do this by reading the magic Document.cookie property
	var allcookies;
	if (this.$is_webkit) {
		allcookies = localStorage.getItem(this.$name);
	} else {
		allcookies = this.$document.cookie;
	}
    if (allcookies == "" || allcookies === undefined || allcookies == null) return false;

    // Now extract just the named cookie from that list
    var start = allcookies.indexOf(this.$name + '=');
    if (start == -1) return false;   // Cookie not defined for this page
    start += this.$name.length + 1;  // Skip name and equals sign
    var end = allcookies.indexOf(';', start);
    if (end == -1) end = allcookies.length;
    var cookieval = allcookies.substring(start, end);

    // Now that we've extracted the value of the named cookie, we
    // must break that value down into individual state variable
    // names and values. The name/value pairs are separated from each
    // other by ampersands, and the individual names and values are
    // separated from each other by colons. We use the split(  ) method
    // to parse everything.

    var a = cookieval.split('&');    // Break it into an array of name/value pairs
    for(var i1=0; i1 < a.length; i1++)  // Break each pair into an array
        a[i1] = a[i1].split(':');

    // Now that we've parsed the cookie value, set all the names and values
    // of the state variables in this Cookie object. Note that we unescape(  )
    // the property value, because we called escape(  ) when we stored it.
    for(var i2 = 0; i2 < a.length; i2++) {
        object[a[i2][0]] = unescape(a[i2][1]);
    }

    // We're done, so return the success code
    return true;
};

// This function is the remove(  ) method of the Cookie object
CookieWorker.prototype.remove = function(  ) {
    var cookie;
    cookie = this.$name + '=';
    if (this.$path) cookie += '; path=' + this.$path;
    if (this.$domain) cookie += '; domain=' + this.$domain;
    cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';

    if (this.$is_webkit) {
        try {
			localStorage.setItem(this.$name, cookie);
		} catch (e) { }
    } else {
        this.$document.cookie = cookie;
    }
};
// SIG // Begin signature block
// SIG // MIIMzQYJKoZIhvcNAQcCoIIMvjCCDLoCAQExDjAMBggq
// SIG // hkiG9w0CBQUAMGYGCisGAQQBgjcCAQSgWDBWMDIGCisG
// SIG // AQQBgjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIB
// SIG // AAIBAAIBAAIBAAIBADAgMAwGCCqGSIb3DQIFBQAEEDSB
// SIG // qeJn5QupK/NFhGKTxg+gggoPMIIE/DCCBGWgAwIBAgIQ
// SIG // ZVIm4bIuGOFZDymFrCLnXDANBgkqhkiG9w0BAQUFADBf
// SIG // MQswCQYDVQQGEwJVUzEXMBUGA1UEChMOVmVyaVNpZ24s
// SIG // IEluYy4xNzA1BgNVBAsTLkNsYXNzIDMgUHVibGljIFBy
// SIG // aW1hcnkgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcN
// SIG // MDkwNTIxMDAwMDAwWhcNMTkwNTIwMjM1OTU5WjCBtjEL
// SIG // MAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJ
// SIG // bmMuMR8wHQYDVQQLExZWZXJpU2lnbiBUcnVzdCBOZXR3
// SIG // b3JrMTswOQYDVQQLEzJUZXJtcyBvZiB1c2UgYXQgaHR0
// SIG // cHM6Ly93d3cudmVyaXNpZ24uY29tL3JwYSAoYykwOTEw
// SIG // MC4GA1UEAxMnVmVyaVNpZ24gQ2xhc3MgMyBDb2RlIFNp
// SIG // Z25pbmcgMjAwOS0yIENBMIIBIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAQ8AMIIBCgKCAQEAvmcdtGCqEElvVhd8Zslehg3V
// SIG // 8ayncYOOi4n4iASJFQa6LYQhleTRnFBM+9IivdrysjU7
// SIG // Ho/DCfv8Ey5av4l8PTslHvbzWHuc9AG1xgq4gM6+J3Rh
// SIG // ZydNauXsgWFYeaPgFxASFSew4U00fytHIES53mYkZorN
// SIG // T7ofxTjIVJDhcvYZZnVquUlozzh5DaowqNssYEie16oU
// SIG // AamD1ziRMDkTlgM6fEBUtq3gLxuD3KgRUj4Cs9cr/SG2
// SIG // p1yjDwupphBQDjQuTafOyV4l1Iy88258KbwBXfwxh1rV
// SIG // jIVnWIgZoL818OoroyHnkPaD5ajtYHhee2CD/VcLXUEN
// SIG // Y1Rg1kMh7wIDAQABo4IB2zCCAdcwEgYDVR0TAQH/BAgw
// SIG // BgEB/wIBADBwBgNVHSAEaTBnMGUGC2CGSAGG+EUBBxcD
// SIG // MFYwKAYIKwYBBQUHAgEWHGh0dHBzOi8vd3d3LnZlcmlz
// SIG // aWduLmNvbS9jcHMwKgYIKwYBBQUHAgIwHhocaHR0cHM6
// SIG // Ly93d3cudmVyaXNpZ24uY29tL3JwYTAOBgNVHQ8BAf8E
// SIG // BAMCAQYwbQYIKwYBBQUHAQwEYTBfoV2gWzBZMFcwVRYJ
// SIG // aW1hZ2UvZ2lmMCEwHzAHBgUrDgMCGgQUj+XTGoasjY5r
// SIG // w8+AatRIGCx7GS4wJRYjaHR0cDovL2xvZ28udmVyaXNp
// SIG // Z24uY29tL3ZzbG9nby5naWYwHQYDVR0lBBYwFAYIKwYB
// SIG // BQUHAwIGCCsGAQUFBwMDMDQGCCsGAQUFBwEBBCgwJjAk
// SIG // BggrBgEFBQcwAYYYaHR0cDovL29jc3AudmVyaXNpZ24u
// SIG // Y29tMDEGA1UdHwQqMCgwJqAkoCKGIGh0dHA6Ly9jcmwu
// SIG // dmVyaXNpZ24uY29tL3BjYTMuY3JsMCkGA1UdEQQiMCCk
// SIG // HjAcMRowGAYDVQQDExFDbGFzczNDQTIwNDgtMS01NTAd
// SIG // BgNVHQ4EFgQUl9BrqCZwyKE/lB8ILcQ1m6ShHvIwDQYJ
// SIG // KoZIhvcNAQEFBQADgYEAiwPA3ZTYQaJhabAVqHjHMMaQ
// SIG // PH5C9yS25INzFwR/BBCcoeL6gS/rwMpE53LgULZVECCD
// SIG // bpaS5JpRarQ3MdylLeuMAMcdT+dNMrqF+E6++mdVZfBq
// SIG // vnrKZDgaEBB4RXYx84Z6Aw9gwrNdnfaLZnaCG1nhg+W9
// SIG // SaU4VuXeQXcOWA8wggULMIID86ADAgECAhAjTaBL0kKF
// SIG // PErLmuhhwhm7MA0GCSqGSIb3DQEBBQUAMIG2MQswCQYD
// SIG // VQQGEwJVUzEXMBUGA1UEChMOVmVyaVNpZ24sIEluYy4x
// SIG // HzAdBgNVBAsTFlZlcmlTaWduIFRydXN0IE5ldHdvcmsx
// SIG // OzA5BgNVBAsTMlRlcm1zIG9mIHVzZSBhdCBodHRwczov
// SIG // L3d3dy52ZXJpc2lnbi5jb20vcnBhIChjKTA5MTAwLgYD
// SIG // VQQDEydWZXJpU2lnbiBDbGFzcyAzIENvZGUgU2lnbmlu
// SIG // ZyAyMDA5LTIgQ0EwHhcNMDkwODI3MDAwMDAwWhcNMTIw
// SIG // OTIwMjM1OTU5WjCByDELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCkNhbGlmb3JuaWExEzARBgNVBAcTClNhbiBSYWZh
// SIG // ZWwxFjAUBgNVBAoUDUF1dG9kZXNrLCBJbmMxPjA8BgNV
// SIG // BAsTNURpZ2l0YWwgSUQgQ2xhc3MgMyAtIE1pY3Jvc29m
// SIG // dCBTb2Z0d2FyZSBWYWxpZGF0aW9uIHYyMR8wHQYDVQQL
// SIG // FBZEZXNpZ24gU29sdXRpb25zIEdyb3VwMRYwFAYDVQQD
// SIG // FA1BdXRvZGVzaywgSW5jMIGfMA0GCSqGSIb3DQEBAQUA
// SIG // A4GNADCBiQKBgQC1R1YKdvQF2Rj4+knWfj81afUtVyep
// SIG // GF2P4tcYD53qlYmYi9t9Csc6PMWlUZhMGbOceQKYcBjc
// SIG // mWvyghJnoaEQ6796ZcsLD0pMH2R4SpV/SjxiQ280beig
// SIG // NerJS5X+ftOMCs1qSQ1LXlRFEohaewkNWsIp/+f1Y0vE
// SIG // dGzggnEKOQIDAQABo4IBgzCCAX8wCQYDVR0TBAIwADAO
// SIG // BgNVHQ8BAf8EBAMCB4AwRAYDVR0fBD0wOzA5oDegNYYz
// SIG // aHR0cDovL2NzYzMtMjAwOS0yLWNybC52ZXJpc2lnbi5j
// SIG // b20vQ1NDMy0yMDA5LTIuY3JsMEQGA1UdIAQ9MDswOQYL
// SIG // YIZIAYb4RQEHFwMwKjAoBggrBgEFBQcCARYcaHR0cHM6
// SIG // Ly93d3cudmVyaXNpZ24uY29tL3JwYTATBgNVHSUEDDAK
// SIG // BggrBgEFBQcDAzB1BggrBgEFBQcBAQRpMGcwJAYIKwYB
// SIG // BQUHMAGGGGh0dHA6Ly9vY3NwLnZlcmlzaWduLmNvbTA/
// SIG // BggrBgEFBQcwAoYzaHR0cDovL2NzYzMtMjAwOS0yLWFp
// SIG // YS52ZXJpc2lnbi5jb20vQ1NDMy0yMDA5LTIuY2VyMB8G
// SIG // A1UdIwQYMBaAFJfQa6gmcMihP5QfCC3ENZukoR7yMBEG
// SIG // CWCGSAGG+EIBAQQEAwIEEDAWBgorBgEEAYI3AgEbBAgw
// SIG // BgEBAAEB/zANBgkqhkiG9w0BAQUFAAOCAQEAIfxkh8Fd
// SIG // IHK+qtTf+9Eq5fjkk5gMMTQCOa+2aR7mqDzLfIFRGQzr
// SIG // tcc5/izsb/wPLUwdw1cRpnxO8/qLA2Ol+b99FONTOyyc
// SIG // Y8unwviYhdEjuFmqHkyC5MUYroZEjvTObFkkgN98Y48h
// SIG // C+mG2hdlVKXR0zr9r5q/rmmivVWbojvcYKHoW31O5OcM
// SIG // PsrWuOD305Ygmpck/91iopE3UN4tfeWYhzNj1F6Ai4Xa
// SIG // 5KiaMcs3zmoZ+6SePyI2YUgtff6yvy/rk8KVT41KGD2h
// SIG // fC+QrtVSkoDWP/MDtLjbTPCWElC1NWSEKowRI8t2x594
// SIG // Skjnzu/W5Lh97ixircOuM4IvBzGCAigwggIkAgEBMIHL
// SIG // MIG2MQswCQYDVQQGEwJVUzEXMBUGA1UEChMOVmVyaVNp
// SIG // Z24sIEluYy4xHzAdBgNVBAsTFlZlcmlTaWduIFRydXN0
// SIG // IE5ldHdvcmsxOzA5BgNVBAsTMlRlcm1zIG9mIHVzZSBh
// SIG // dCBodHRwczovL3d3dy52ZXJpc2lnbi5jb20vcnBhIChj
// SIG // KTA5MTAwLgYDVQQDEydWZXJpU2lnbiBDbGFzcyAzIENv
// SIG // ZGUgU2lnbmluZyAyMDA5LTIgQ0ECECNNoEvSQoU8Ssua
// SIG // 6GHCGbswDAYIKoZIhvcNAgUFAKCBsDAZBgkqhkiG9w0B
// SIG // CQMxDAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4w
// SIG // DAYKKwYBBAGCNwIBFTAfBgkqhkiG9w0BCQQxEgQQoLSi
// SIG // z5LlV67KlZaiv5ZvfzBUBgorBgEEAYI3AgEMMUYwRKAm
// SIG // gCQAQQB1AHQAbwBkAGUAcwBrACAAQwBvAG0AcABvAG4A
// SIG // ZQBuAHShGoAYaHR0cDovL3d3dy5hdXRvZGVzay5jb20g
// SIG // MA0GCSqGSIb3DQEBAQUABIGABEY2q54mzPVRlSJgK3oK
// SIG // 9Y/u5C+9ftbTvKKkummkxbZZ8x/vxustVW+YAFZAgD8X
// SIG // pCt3hh6BeS9VpeOpPnBguXzpV6QtTVj5da5QesT/W7Yb
// SIG // EGPoRfizVVEYHcboi7ctaCPVWuWkNKwTeZiHe8jMoo2L
// SIG // Xa8ScEqKTl446hpYoN4=
// SIG // End signature block
