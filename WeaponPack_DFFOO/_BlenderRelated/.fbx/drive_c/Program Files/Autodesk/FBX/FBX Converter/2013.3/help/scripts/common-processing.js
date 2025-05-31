function initFrame(url,topicNumber,index,hash) {
    if (top == self) {
        var hashWithoutSharp;
        if (hash !== undefined) {
            hashWithoutSharp = hash.substring(1);
        }
        window.location.replace('../' + index + '?url=' + url + ',topicNumber=' + topicNumber + ((hashWithoutSharp) ? ',hash=' + hashWithoutSharp : ''));
    }
}

function initPage(title,bookTitle) {
	if (parent.name != null && top.document.title != null) {
        top.document.title = bookTitle+": "+title;
	} else setTimeout("initPage('"+title+"','"+bookTitle+"')",100);
}

function showInContents(topicNumber) {
    try {
        top.HlpSys.contentTree.expandTOCNode(topicNumber);
        top.left_tab.selectTabByName('tocTab');
    } catch (ex) {}
}

function syncWithContents(topicNumber) {
    if (parent.name != 'iframeSearch') {
        top.contentTree.expandTOCNode(topicNumber);
    }
}

//Symbols converting function

var symboltab = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8704,0,8707,0,0,
8715,0,0,8727,0,0,8722,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,8773,913,914,935,8710,917,934,915,919,921,
977,922,923,924,925,927,928,920,929,931,932,933,962,
8486,926,936,918,0,8756,0,8869,0,8254,945,946,967,
948,949,966,947,951,953,981,954,955,956,957,959,960,
952,961,963,964,965,982,969,958,968,950,0,0,0,8764,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,978,8242,8804,8725,8734,402,9827,9830,
9829,9824,8596,8592,8593,8594,8595,176,177,8243,
8805,215,8733,8706,8226,247,8800,8801,8776,8230,0,
0,8629,8501,8465,8476,8472,8855,8853,8709,8745,8746,
8835,8839,8836,8834,8838,8712,8713,8736,8711,174,169,
8482,8719,8730,8901,172,8743,8744,8660,8656,8657,
8658,8659,9674,9001,174,169,8482,8721,0,0,0,0,0,0,0,
0,0,0,0,9002,8747,8992,0,8993,0,0,0,0,0,0,0,0,0,
0,10064,10065,10066];

function convSymbols() {
	if(isNS)	{
		var x1 = document.getElementsByName("glyph_span");
		for (var i1=0;i1 < x1.length;i1++) {
			var y1 = x1[i1];
			var ch1 = y1.innerHTML.charCodeAt(0);
			if (ch1 < 259 && symboltab[ch1] != 0) {
				ch1 = symboltab[ch1];
				y1.innerHTML=String.fromCharCode(ch1);
			}
		}
	} else if(isIE) {
		var x = document.getElementsByTagName("span");
		for (var i=0;i < x.length;i++) {
			var y = x[i];
			var ch = y.innerHTML.charCodeAt(0);
			if (ch == 10064 || ch == 10065 || ch == 10066) {
				y.style.fontFamily = "Wingdings";
				ch = ch - 9952;
				y.innerHTML = String.fromCharCode(ch);
			}
		}
	}
}


// SIG // Begin signature block
// SIG // MIIMzQYJKoZIhvcNAQcCoIIMvjCCDLoCAQExDjAMBggq
// SIG // hkiG9w0CBQUAMGYGCisGAQQBgjcCAQSgWDBWMDIGCisG
// SIG // AQQBgjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIB
// SIG // AAIBAAIBAAIBAAIBADAgMAwGCCqGSIb3DQIFBQAEEGK9
// SIG // g1TipHBZrZoOtYaH7zegggoPMIIE/DCCBGWgAwIBAgIQ
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
// SIG // DAYKKwYBBAGCNwIBFTAfBgkqhkiG9w0BCQQxEgQQAc+q
// SIG // URGDbdpSVqIApb6CjDBUBgorBgEEAYI3AgEMMUYwRKAm
// SIG // gCQAQQB1AHQAbwBkAGUAcwBrACAAQwBvAG0AcABvAG4A
// SIG // ZQBuAHShGoAYaHR0cDovL3d3dy5hdXRvZGVzay5jb20g
// SIG // MA0GCSqGSIb3DQEBAQUABIGAkjoq7Usc7MpBeIuJHBRQ
// SIG // AbFQFJM7Xt0TDtA4jA2UsZWw8x0KdeLq4Ihbr14xp7aX
// SIG // rZNYH4N806tJiyqDwOhRgbmwQUAi2MbMbfYG3JwSmIU1
// SIG // rUtyGNb+78BwP8pdQzTlUIxn4we79Db6kAOaZdH+8WJE
// SIG // KRAaSB0/DdhNcTRIjN4=
// SIG // End signature block
