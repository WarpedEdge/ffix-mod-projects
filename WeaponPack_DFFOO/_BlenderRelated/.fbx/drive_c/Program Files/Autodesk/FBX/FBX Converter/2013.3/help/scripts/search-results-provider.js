function SearchResultsProvider(theName, theFullName) {
    var name = theName != "" ? theName : "default";
    var fullName = theFullName;
    var enabled = true;

    var data = {
        dataProviders : new Array(),
        topicInfoList: new Array()
    };

    var providerState = new CookieWorker(top.document, "autodesk_search_state" + name, 24000);
    loadState();

    function saveState() {
        var state = {enabled: enabled};
        providerState.store(state);
    };

    function loadState() {
        var state = {enabled: enabled};
        providerState.load(state);
        enabled = state.enabled == "false" ? false : true;
    };

    function PrepeareResults(result, query) {
        var results = new top.HlpSys.search.ResultList();
        for (var i in result)
        {
            if (data.topicInfoList[i])
            {
                var info = data.topicInfoList[i];
                var title = info.title;
                var href = info.href;
                var rank = result[i][0];
                var res = new top.HlpSys.search.SearchResult(href, title, rank, fullName, info.description, info.ancestry);
                results.addResult(res);
            }
        }

        var queryString = "";
        for (var j = 0; j < query.length; j++) {
            queryString += query[j];
            if (j < query.length - 1) {
                queryString += "|";
            }
        }
        queryString = "highlighting=" + encodeURIComponent(queryString);
        results.sortResults();
        results.addSearchQuery(queryString);
        return results;
    };

    function getWordOccurences(word) {
        var occurences = new Array();
        for (var i = 0; i < data.dataProviders.length; i++) {
            var dataProvider = data.dataProviders[i];
            SearchResultsProvider.mergeResult(occurences, dataProvider(word));
        }

        return occurences;
    };

    function getSmallestDifference(array1, array2) {
        var min = 32000;
        var stopWord = 1;
        for (var i1 = 0; i1 < array1.length; i1++) {
            for (var i2 = 0; i2 < array2.length; i2++) {
                if ((Math.abs(Math.abs(array1[i1]) - Math.abs(array2[i2])) < min) && (Math.abs(array2[i2]) < Math.abs(array1[i1]))) {
                    min = Math.abs(Math.abs(array1[i1]) - Math.abs(array2[i2]));
                    stopWord = ((array1[i1] < 0) || (Math.abs(array2[i2]) > Math.abs(array1[i1]))) ? -1 : 1;
                }
            }
        }
        if (min == 0) {
            //		alert("SOMETHING Wrong")
        }
        return stopWord * min;
    };

    function compactOccurences(array) {
        array.sort(function (a, b) {return a[0] - b[0];});

        var result = new Array();
        for (var i = 0; i < array.length; i++) {
            var currentEntry = array[i];
            while (array[i+1] && currentEntry[0] == array[i+1][0]) {
                currentEntry[1] += array[i+1][1];
                currentEntry[2] = currentEntry[2].concat(array[i+1][2]);
                i++;
            }
            currentEntry[2].sort(function(a,b) {return a-b;});
            result[result.length] = currentEntry;
        }

        return result;
    };

    return {

        getName : function() {
            return name;
        },

        getFullName : function() {
            return fullName;
        },

        switchState : function() {
            enabled = !enabled;
            saveState();
        },

        isEnabled : function() {
            loadState();
            return enabled;
        },

        registerDataProvider: function(dataProvider) {
            data.dataProviders[data.dataProviders.length] = dataProvider;
        },

        setTopicInfoList: function(infoList) {
            data.topicInfoList = infoList;
        },

        SearchString: function(regexpArr, queryArr, searchMethod) {
            var topicNumber = 0;
            var topicRank = 0;
            var occurences;
            var searchResults = new Array();

            for (var j1 = 0; j1 < regexpArr.length; j1++)
            {
                occurences = getWordOccurences(regexpArr[j1]);
                occurences = compactOccurences(occurences);
                for (i = 0; i < occurences.length; i++) {
                    topicNumber = occurences[i][0];
                    topicRank = occurences[i][1];
                    if (searchResults[topicNumber] == null) {
                        searchResults[topicNumber] = new Array(4);
                        searchResults[topicNumber][0] = topicRank;
                        searchResults[topicNumber][1] = 1;
                        searchResults[topicNumber][2] = occurences[i][2];
                        searchResults[topicNumber][3] = 0;
                    } else {
                        searchResults[topicNumber][0] += topicRank;
                        searchResults[topicNumber][1] += 1;
                        var diff = getSmallestDifference(occurences[i][2], searchResults[topicNumber][2]);
                        searchResults[topicNumber][3] = Math.abs(searchResults[topicNumber][3]) < Math.abs(diff) ? diff : searchResults[topicNumber][3];
                        searchResults[topicNumber][2] = occurences[i][2];
                    }
                }
            }


            var currentResult;
            for (var i in searchResults)
            {
                currentResult = searchResults[i];
                if (searchMethod == 'phrase'){
                    if ((Math.abs(currentResult[3]) > 2) || (currentResult[1] < queryArr.length)) {
                        delete searchResults[i];
                    }
                } else if (searchMethod == 'and') {
                    if (currentResult[1] < queryArr.length) {
                        delete searchResults[i];
                    }
                } else if (searchMethod == 'or') {

                }
            }

            return PrepeareResults(searchResults, queryArr);
        }
    };
}

SearchResultsProvider.mergeResult = function (array1, array2) {
    if (!array1) {
        array1 = new Array();
    } else if (!array2) {
        return array1;
    }

    for (var i3 = 0; i3 < array2.length; i3++)
    {
        var t2 = array1.length;
        array1[t2] = new Array(3);
        array1[t2][0] = array2[i3][0];
        array1[t2][1] = array2[i3][1];
//      array1[t2][2] = new Array(array2[i3][2].length);
        array1[t2][2] = array2[i3][2];
    }
    return array1;
};
// SIG // Begin signature block
// SIG // MIIMzQYJKoZIhvcNAQcCoIIMvjCCDLoCAQExDjAMBggq
// SIG // hkiG9w0CBQUAMGYGCisGAQQBgjcCAQSgWDBWMDIGCisG
// SIG // AQQBgjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIB
// SIG // AAIBAAIBAAIBAAIBADAgMAwGCCqGSIb3DQIFBQAEEClY
// SIG // HZ5eTiXti/x698sD3vWgggoPMIIE/DCCBGWgAwIBAgIQ
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
// SIG // DAYKKwYBBAGCNwIBFTAfBgkqhkiG9w0BCQQxEgQQ1oxi
// SIG // 7XoPjuPp1pHmKpYGiDBUBgorBgEEAYI3AgEMMUYwRKAm
// SIG // gCQAQQB1AHQAbwBkAGUAcwBrACAAQwBvAG0AcABvAG4A
// SIG // ZQBuAHShGoAYaHR0cDovL3d3dy5hdXRvZGVzay5jb20g
// SIG // MA0GCSqGSIb3DQEBAQUABIGAntxbRGBNxDeCe19fkD2c
// SIG // XLRrueXmp2w4YsS10KFM+JNgiYuxx8fwgE0jIxNAfTDB
// SIG // PbenhTNnk94zR1z2/wJny87fo707rx17sgyhl0ItLZJt
// SIG // yfy9+BFFYxhVSqPMD+qj6j481IOsZGzyoN+AMOb/ZSRf
// SIG // cD9c7QpNSLZ/QVd0Beg=
// SIG // End signature block
