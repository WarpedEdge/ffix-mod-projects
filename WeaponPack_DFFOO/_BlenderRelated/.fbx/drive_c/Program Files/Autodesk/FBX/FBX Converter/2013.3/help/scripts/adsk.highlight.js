if (top.HlpSys === undefined) {
    top.HlpSys = new Object();
}

top.HlpSys.highlight = function(){
    var searchObj;
    var highlightObj;

    function decodeReferrer(q, config) {
        var query = new Array();

        if (q != null && q.length > 0) {
            query[0] = q[0];
            for (var i1 = 0; i1 < q.length; i1++) {
                query[query.length] = q[i1];
                if (i1 != 0) {
                    query[0] += "[^\\w]+" + q[i1];
                }
            }

        } else {
            return null;
        }

        var caseSens = config.caseSensitive;
        var exact = config.wholeWords;
        var qre = new Array();
        for (var i2 = 0; i2 < query.length; i2 ++) {
            query[i2] = caseSens ? query[i2] : query[i2].toLowerCase();
            if (exact)
                qre.push('\\b' + query[i2] + '\\b');
            else
                qre.push(query[i2]);
        }

        for (var i3 = 0; i3 < qre.length; i3 ++) {
            qre[i3] = new RegExp(qre[i3], caseSens ? "" : "i");
        }

        return qre;

    };

    function hiliteElement(elm, query) {
        if (!query || elm.childNodes.length == 0)
            return;

        var qre = query;
        var searchMethod = searchObj.config.searchMethod;

        var textproc = function(node, querryNum) {
            var q = querryNum;
            var match = null;
            var continuedSearch = true;
            if (searchMethod == 'phrase') {
                if (querryNum == 0) {
                    match = qre[q].exec(node.data);
                    q++;
                    querryNum++;
                    continuedSearch = false;
                }
                if (match) {
                    var val = match[0];
                    var k = '';
                    var node2 = node.splitText(match.index);
                    var node3 = node2.splitText(val.length);
                    var span = node.ownerDocument.createElement('SPAN');
                    node.parentNode.replaceChild(span, node2);
                    span.className = highlightObj.config.stylemapper[0];
                    span.appendChild(node2);
                    return span;
                } else {
                    if (qre[q] && qre[q].exec(node.data)) {
                        var words = normalizeSpace(node.data).split(/[\[ | \^ | \$ | \. | \| | \+ | \( | \) | ` | ~ | ! | # | % | & | - | \- | _ | = | \] | { | } | ; | ' | " | < | > | ,]/);
                        var w = 0;
                        var wrongSearch = false;
                        if (q == 1) {
                            for (w = 0; w < words.length; w++) {
                                if (qre[q].exec(words[w])) {
                                    break;
                                }
                            }
                        }
                        while (q < qre.length && w < words.length) {
                            if (qre[q].exec(words[w])) {
                                q++;
                                w++;
                            } else if (searchObj.data.stopWordsList[words[w].toLowerCase()] || words[w].length == 0) {
                                w++;
                            } else {
                                wrongSearch = true;
                                break;
                            }
                        }
                        if (!wrongSearch) {
                            q--;
                            if (q + 1 == qre.length) {
                                var matchS = qre[querryNum].exec(node.data);
                                var node2 = node.splitText(matchS.index);
                                var matchE = qre[q].exec(node2.data);
                                var node3 = node2.splitText(matchE.index + matchE[0].length);
                                var span = node.ownerDocument.createElement('SPAN');
                                node.parentNode.replaceChild(span, node2);
                                span.className = highlightObj.config.stylemapper[0];
                                span.appendChild(node2);
                                return span;
                            } else {
                                var nextNode = getFollowingTextNode(node);
                                if (nextNode != null) {
                                    var nextProcessedNode = textproc(nextNode, q + 1)
                                    if (nextNode != nextProcessedNode) {
                                        var matchS = qre[querryNum].exec(node.data);
                                        var node2 = node.splitText(matchS.index);
                                        var span = node.ownerDocument.createElement('SPAN');
                                        node.parentNode.replaceChild(span, node2);
                                        span.className = highlightObj.config.stylemapper[0];
                                        span.appendChild(node2);
                                        return nextProcessedNode;
                                    }
                                }
                            }
                        } else if (!continuedSearch && w < words.length) {
                            var matchT = (new RegExp(words[w], "i")).exec(node.data)
                            if (matchT) {
                                var node2 = node.splitText(matchT.index + matchT[0].length);
                                if (node.data.length - matchT.index - matchT[0].length == 0) {
                                    return node;
                                } else {
                                    return textproc(node2, 0);
                                }
                            }
                        }
                    }
                    return node;
                }
            } else {
                for (var i = 0; i < qre.length; i++) {
                    match = qre[i].exec(node.data);
                    if (match) {
                        var val = match[0];
                        var node2 = node.splitText(match.index);
                        var node3 = node2.splitText(val.length);
                        var span = node.ownerDocument.createElement('SPAN');
                        node.parentNode.replaceChild(span, node2);
                        span.className = highlightObj.config.stylemapper[0];
                        span.appendChild(node2);
                        return span;
                    }
                }
                return node;
            }
        };
        walkElements(elm.childNodes[0], 1, textproc);
    };

    function walkElements(node, depth, textproc) {
        var skipre = /^(head|script|style|textarea)/i;
        var count = 0;
        while (node && depth > 0) {
            count ++;
            if (count >= highlightObj.config.max_nodes) {
                var handler = function() {
                    walkElements(node, depth, textproc);
                };
                setTimeout(handler, 50);
                return;
            }

            if (node.nodeType == 1) { // ELEMENT_NODE
                if (!skipre.test(node.tagName) && node.childNodes.length > 0) {
                    node = node.childNodes[0];
                    depth ++;
                    continue;
                }
            } else if (node.nodeType == 3) { // TEXT_NODE
                node = textproc(node, 0);
                if (node.parentNode == null) {
                    alert(node.nodeName + ":1" + node.data + ":");
                }
            }

            if (node == null) {
                return;
            }

            if (node.nextSibling) {
                node = node.nextSibling;
            } else {
                while (depth > 0) {
                    node = node.parentNode;
                    depth --;
                    if (node.nextSibling) {
                        node = node.nextSibling;
                        break;
                    }
                }
            }
        }
    };

    function getFollowingTextNode(node) {
        node = getFollowingNode(node);
        if (node) {
            if (node.nodeType == 3 && normalizeSpace(node.data).length > 0) {
                return node;
            } else {
                return getFollowingTextNode(node);
            }
        } else {
            return null;
        }
    };

    function getFollowingNode(node) {
        if (node) {
            if (node.firstChild) {
                return node.firstChild;
            } else if (node.nextSibling) {
                return node.nextSibling;
            } else {
                while (node.parentNode) {
                    node = node.parentNode;
                    if (node.nextSibling) {
                        return node.nextSibling;
                    }
                }
                return null;
            }
        } else return null;
    };

    function normalizeSpace(string) {
        var regexp = new RegExp("[\\s][\\s]+","g");
        while(string.match(regexp)) {
            string = string.replace(regexp," ");
        }
        if (string.length == 1 && string == " ") {
            return "";
        } else {
            return string;
        }
    };

    function disHilite(node, config) {
        if (node != null) {
            if (node.nodeType == 1 || node.nodeType == 9) { // ELEMENT_NODE
                if ((node.nodeName.toLowerCase() == "span") && (node.attributes["class"] != null) && (node.attributes["class"].nodeValue.indexOf(config.stylename) == 0)) {
                    var childs1 = node.childNodes;
                    for (var j = 0; j < childs1.length; j++) {
                        node.parentNode.insertBefore(childs1[j], node);
                    }
                    node.parentNode.removeChild(node);
                } else if (node.childNodes.length > 0) {
                    var childs2 = node.childNodes;
                    for (var i = 0; i < childs2.length; i++) {
                        disHilite(childs2[i], config);
                    }
                }
            }
        }
    }

    function parseUrlParameters(queryString) {
        var args = new Object();
        var pairs = queryString.split(",");                 // Break at comma
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');          // Look for "name=value"
            if (pos == -1) continue;                  // If not found, skip
            var argname = pairs[i].substring(0, pos);  // Extract the name
            var value = pairs[i].substring(pos + 1);    // Extract the value
            args[argname] = decodeURIComponent(value);
        }

        return args;
    };



    return {
		config: {
            onload: true,
			elementid: '',
			max_nodes: 500,
			stylename: 'hilite',
			stylemapper: ['hilite','hilite1','hilite2'],
			debug_referrer: ''
		},

        onload: function() {
            if (top.HlpSys.search !== undefined) {
                searchObj = top.HlpSys.search;
                highlightObj = top.HlpSys.highlight;
                var parameters = window.location.search.substring(1);
                var args = parseUrlParameters(parameters);
                var arg = args["highlighting"];
                if (arg && arg.length > 0) {
                    var decodedWords = decodeURIComponent(arg);
                    var words = decodedWords.split("|");
                    var q = decodeReferrer(words, searchObj.config);
                    top.HlpSys.highlight.hilite(window.document, q, searchObj.config.highlightEnable);
                }
            }
        },

		hilite: function(doc, query, enable) {
			if (enable && query.length > 0) {
				if (doc != null) {
					hiliteElement(doc, query);
				}
			} else {
				disHilite(doc, this.config);
			}
		}
    };
}();

if (top.HlpSys.highlight.config.onload) {
    AddOnLoadFunction(top.HlpSys.highlight.onload);
}

// SIG // Begin signature block
// SIG // MIIMzQYJKoZIhvcNAQcCoIIMvjCCDLoCAQExDjAMBggq
// SIG // hkiG9w0CBQUAMGYGCisGAQQBgjcCAQSgWDBWMDIGCisG
// SIG // AQQBgjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIB
// SIG // AAIBAAIBAAIBAAIBADAgMAwGCCqGSIb3DQIFBQAEEOKK
// SIG // UDIQB5Ss7FiheN7Y33KgggoPMIIE/DCCBGWgAwIBAgIQ
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
// SIG // DAYKKwYBBAGCNwIBFTAfBgkqhkiG9w0BCQQxEgQQtaKV
// SIG // JfgId3vwfbOIGK3KezBUBgorBgEEAYI3AgEMMUYwRKAm
// SIG // gCQAQQB1AHQAbwBkAGUAcwBrACAAQwBvAG0AcABvAG4A
// SIG // ZQBuAHShGoAYaHR0cDovL3d3dy5hdXRvZGVzay5jb20g
// SIG // MA0GCSqGSIb3DQEBAQUABIGAedXHXvd809IeJ2STCOmV
// SIG // tdrxEu7ChKzLuLmFVdYO5cu3T0QB+vp6rqXu6YfWSGJW
// SIG // nB21XdiCAP3xnr1lBKPGawYjjIXaAWqU6XOPZxtPh2ov
// SIG // yzjGkdRAtaMQGdei2XwhxqH4QbUJ1HcyjNi8yysGRMNL
// SIG // ZM2K5+aCAzmdYLSk72U=
// SIG // End signature block
