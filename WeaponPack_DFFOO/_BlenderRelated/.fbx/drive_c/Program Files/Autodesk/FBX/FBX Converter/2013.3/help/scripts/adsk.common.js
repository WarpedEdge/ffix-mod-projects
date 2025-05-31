// adsk.common.js - JavaScript functions for ACAD Help Files

// v.1.0: 25Feb09 - Removed unneccessary code. moved common code from acmap.js
//                  Contains all JavaScript functions used by CMS-genereated HTML files 
//                  for the CHM output.


//TODO: Add Browser Detection code and global variable (if neccessary)
var isIE = false;
var isNS = false;
if (navigator.appName == "Microsoft Internet Explorer") {
    isIE = true;
}
else if (navigator.appName == "Netscape") {
    isNS = true;
}

//Global Method for attaching methods to the OnLoad event
// All other JS files should call AddOnLoadFunction
function AddOnLoadFunction(fn) {
    try {
        if (window.attachEvent) {
            window.attachEvent('onload', fn);
        } else if (window.addEventListener) {
            window.addEventListener('load', fn, false);
        } else {
            var __onload = window.onload;
            window.onload = function() {
                fn();
                __onload();
            };
        }
    } catch (e) {

    }
}

//Display the comments page
function doComments(path) {
  
  var stitle = document.title;
  stitle = stitle.replace( /[\?]/g, "_" );  // remove question marks from title (others?)
  
  var surl   = unescape(location.href);
  surl = surl.replace( /#.*$/, "" );  // strip hash and all that follows

  var chmpath;
  var i = surl.indexOf("::");
  if( i == -1 ) {
    i = surl.lastIndexOf("/"); 
    chmpath = surl.substring(0,i+1);
  } else {
    chmpath = surl.substring(0,i+3);
  }
  //Display a fixed height window with none of the browser chrome
  window.open(chmpath + path + "#" + stitle + " [" + surl + "]", null,
              "height=450,width=450,resizable=yes,directories=no,location=no,menubar=no,status=no,toolbar=no" );
}

// Display/Hide nav button info text
function hideInfo() {
    var info = document.getElementById('infoline');
    info.innerHTML = ' ';
    info.style.visibility = 'hidden';
}

function showInfo(title) {
    var info = document.getElementById('infoline');
    info.innerHTML = title;
    info.style.visibility = 'visible';
}

//-------------------------------------------
// Added by IntelliArts
//-------------------------------------------
function trimRelativePath(path) {
    if (path.indexOf('./') === 0) {
        return trimRelativePath(path.substring(2));
    } else if (path.indexOf('../') === 0) {
        return trimRelativePath(path.substring(3));
    } else if (path.indexOf('../') > 0) {
        if (path.indexOf('/') < path.indexOf('../')) {
            return trimRelativePath(path.substring(0, path.indexOf('/')) + path.substring(path.indexOf('../') + 3));
        } else {
            return path;
        }
    } else {
        return path;
    }
}

function swapImage(theImgObj, theImage1, theImage2) {
    if (theImgObj.src.search(trimRelativePath(theImage1)) > 0 || theImage1 == theImgObj.src) {
        theImgObj.src = theImage2;
    } else {
        theImgObj.src = theImage1;
    }
}

function showExpandedImage(theImgObj, theImage) {
    if (theImgObj.src != theImage) {
        theImgObj.src = theImage;
    }
}

function hideElement(theEl) {
    theEl.style.display = 'none';
}
function showElement(theEl) {
    theEl.style.display = '';
}

function showHide(theId) {
    if (document.getElementById) { // DOM3 = IE5, NS6
        var el = document.getElementById(theId);
        if (el === null) {
            return;
        }
        if (el.style.display == 'none') {
            showElement(el);
        }
        else {
            hideElement(el);
        }
    }
}

function showBlock(theId) {
    if (document.getElementById) { // DOM3 = IE5, NS6
        var el = document.getElementById(theId);
        if (el === null) {
            return ;
        }
        if (el.style.display == 'none') {
            showElement(el);
        }
    }
}

// Used for External Links
function linkParser(fn) {
    var X, Y, sl, a, ra;
    ra = /:/;
    a = location.href.search(ra);
    if (a == 2) {
        X = 14;
    } else {
        X = 7;
    }
    sl = "\\";
    Y = location.href.lastIndexOf(sl) + 1;
    var tmpRes = location.href.substring(X, Y) + fn;
    if (!(location.href.search('file:///') >= 0)) {
        tmpRes = 'file:///' + tmpRes;
    }
    return tmpRes;
}

//Used for External Links
function linkHelpFile(fn, tn) {
    var fileUrl = linkParser(fn);
    var tmpRes = 'mk:@MSITStore:' + fileUrl;
    if (tn !== null) {
        tmpRes += '::/' + tn;
    }
    return tmpRes;
}

//-------------------------------------------
//ExpandAll CollapseAll scripts
/* essential global variables */
var divPattern;
var els;
var elsLen;
var collapseExists = false;
var collapseSection;
var expandSection;
var collapsedImagePath;
var expandedImagePath;

function CheckForCollapsible() {

    divPattern = new RegExp(/collapsible\w+/);
    els = document.getElementsByTagName('div');
    elsLen = els.length;
    collapseSection = document.getElementById("collapseAllSection");
    expandSection = document.getElementById("expandAllSection");

    var i = 0;
    while (i < elsLen && !collapseExists) {
        if (divPattern.test(els[i].getAttribute("id"))) {
            collapseExists = true;
        }
        i++;
    }

    if (collapseExists && expandSection !== null) {
        expandSection.style.display = "block";
        try {
            collapsedImagePath = document.getElementById("collapse_img").src;
            expandedImagePath = document.getElementById("expand_img").src;
        } catch (e) {
        }
    }

}   // function CheckForCollapsible()

// Add CheckForCollapsible to OnLoad
AddOnLoadFunction(CheckForCollapsible);


function swapLabel() {
    if (collapseSection.style.display == "block") {
        collapseSection.style.display = "none";
        expandSection.style.display = "block";
    } else {
        collapseSection.style.display = "block";
        expandSection.style.display = "none";
    }
}

function ExpandOrCollapse() {

    var imgPattern = new RegExp(/d\w+/);
    var imgID = document.getElementsByTagName('img');
    var imgIDLen = imgID.length;
        
    for (var i = 0; i < elsLen; i++) {
        var elsId = els[i].getAttribute("id")
        if (divPattern.test(elsId)) {
            showHide(elsId);
        }
    }

    for (var j = 0; j < imgIDLen; j++) {
        if (imgPattern.test(imgID[j].getAttribute("id"))) {
            swapImage(imgID[j], expandedImagePath, collapsedImagePath);
        }
    }

    swapLabel();
}

function ExpandAll() {

    var imgPattern = new RegExp(/d\w+/);
    var imgID = document.getElementsByTagName('img');
    var imgIDLen = imgID.length;
    var elID;

    for (var i = 0; i < elsLen; i++) {
        if (divPattern.test(els[i].getAttribute("id"))) {
            elID = els[i].getAttribute("id");
            showBlock(elID);
        }
    }

    for (var j = 0; j < imgIDLen; j++) {
        if (imgPattern.test(imgID[j].getAttribute("id"))) {
            showExpandedImage(imgID[j], expandedImagePath);
        }
    }

    swapLabel();
}

function CollapseAll() {

    window.location.reload();

}

// SIG // Begin signature block
// SIG // MIIMzQYJKoZIhvcNAQcCoIIMvjCCDLoCAQExDjAMBggq
// SIG // hkiG9w0CBQUAMGYGCisGAQQBgjcCAQSgWDBWMDIGCisG
// SIG // AQQBgjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIB
// SIG // AAIBAAIBAAIBAAIBADAgMAwGCCqGSIb3DQIFBQAEEMEQ
// SIG // t7QhhOc3ysUY4oX92ECgggoPMIIE/DCCBGWgAwIBAgIQ
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
// SIG // DAYKKwYBBAGCNwIBFTAfBgkqhkiG9w0BCQQxEgQQMLHs
// SIG // fDL9EBI1eSfy57uKajBUBgorBgEEAYI3AgEMMUYwRKAm
// SIG // gCQAQQB1AHQAbwBkAGUAcwBrACAAQwBvAG0AcABvAG4A
// SIG // ZQBuAHShGoAYaHR0cDovL3d3dy5hdXRvZGVzay5jb20g
// SIG // MA0GCSqGSIb3DQEBAQUABIGAdj1FyxY6DJ7eVbKHiROm
// SIG // k3FkR0hS6OzqITblQ7XHFKpeF7CEBHBzOrL2S38bcCU5
// SIG // 6IdDbL53fM4AjwUULeNl5qM5tqWhn4odRsBJbxtguiJR
// SIG // 1/PrmKTCzmhkZKEZM/foKRDl5fXNtC8pYSTrEz8yutJ6
// SIG // QJfDzHUVLc1FRNLmnr8=
// SIG // End signature block
