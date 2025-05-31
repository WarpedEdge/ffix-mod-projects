var tocImages =  {'ctrlImageLine':'empty_toc_image',
                  'ctrlImageVoid':'empty_toc_image',
                  'ctrlImage0':'empty_toc_image',
                  'ctrlImage1':'empty_toc_image',
                  'ctrlImage2':'empty_toc_image',
                  'ctrlImage3':'empty_toc_image',
                  'ctrlImage4':'empty_toc_image',
                  'ctrlImage8':'plus_toc_image',
                  'ctrlImage9':'plus_toc_image',
                  'ctrlImage10':'plus_toc_image',
                  'ctrlImage11':'plus_toc_image',
                  'ctrlImage12':'minus_toc_image',
                  'ctrlImage13':'minus_toc_image',
                  'ctrlImage14':'minus_toc_image',
                  'topic-opened':'topic_opened_toc_image',
                  'topic-closed':'topic_closed_toc_image',
                  'topic':'topic_toc_image'};
var childTrees=[];
var curViewed;

// ------------------------------------------ Functions for nodes expansion

var chgNodeResult=0;

function expandTOCNode(nodeId)
{
    if(curViewed != null && curViewed.nodeId == nodeId)
        return;
    chgNodeResult = -1;
    expandTOCNodeChilds(nodeId, contentTree);
    return chgNodeResult;
}

function expandTOCNodeChilds(nodeId, parentNode)
{
	if (parentNode.children) {
		for(var i = 0; i < parentNode.children.length; i++)
		{
            var child = parentNode.children[i];
//			if (!child.parent) child.parent = parentNode;
            if (!child.isRendered) initTocNode(child, parentNode);
            if(child.opn) child.OpenCloseNode(false);
			if(nodeId == child.id)
			{
				ExpandNode(child);
				child.select(false);
				chgNodeResult = nodeId;
				return;
			};
			expandTOCNodeChilds(nodeId, child);
		};
	}
}

function renderNode(parent, node){
    parent.innerHTML += node.init();
}

function ExpandAllOpened(nodePointer) {
	if (nodePointer.opn) {
		ExpandNode(nodePointer);
	}
	if (nodePointer.children) {
		for (var i = 0; i<nodePointer.children.length;i++) {
			ExpandAllOpened(nodePointer.children[i]);
		}
	}
}

function ExpandNode(nodePointer)
{
    if(nodePointer.parent == null) {
		return;
	} else {
		ExpandNode(nodePointer.parent);
		nodePointer.OpenCloseNode(false);
	}
}

// ------------------------------------------ TOCNode class

function isFirstNode()
{
    return this.preceding == null;
}

function isLastNode()
{
    return this.following == null;
}

function SetNodeImage(setCtrlImage)
{
    if(setCtrlImage)
    {
        var flags = 0;
        if(this.children) {
			flags |= 0x8;
		}
        if(this.children && this.opn) {
			flags |= 0x4;
		}
        return tocImages['ctrlImage' + flags];
    }
    else
    {
        var currentState;
		if (!this.children) {
			currentState =  tocIcons[this.ic]+"_toc_image";
		} else if (this.opn) {
			currentState = tocIcons[this.ic]+'_opened_toc_image';
		} else {
			currentState = tocIcons[this.ic]+'_closed_toc_image';
		}
        return currentState;
    }
}

function OpenCloseNode(currentState)
{
	if (currentState == null) {
		currentState = this.opn;
	}
	var htmlContent = [];
    var childDiv = document.getElementById('divtree' + this.id);
    if(!childDiv) return;
    if(!childDiv.innerHTML)
    {
        for(var i = 0; i < this.children.length; i++){
            initTocNode(this.children[i], this);
            htmlContent[i] = this.children[i].init();
		}
        childDiv.innerHTML = htmlContent.join('');
    }
    if(currentState) childDiv.style.display = 'none';
    else childDiv.style.display = 'block';
    this.opn = !currentState;
    var controlImage = document.getElementById('ctrlImage' + this.id),
        bookImage = document.getElementById('bookImage' + this.id);
    if(controlImage) {
		controlImage.className  = this.NodeImage(true)
	}
    if(bookImage) {
		bookImage.className = this.NodeImage(false);
	}
}

function ViewNode(onoffPrevious)
{
    if(!onoffPrevious)
    {
        var viewedNode = curViewed;
        if(viewedNode) viewedNode.select(true);
    }
	curViewed = this;
    var bookImage = document.getElementById('bookImage' + this.id);
    if(bookImage) bookImage.setAttribute("class",this.NodeImage());
    document.getElementById('nodeAhchor' + this.id).className = onoffPrevious ? 'toc_normal' : 'toc_selected';
    return Boolean(this.ttl);
}

function InitializeNode()
{
    var parentNodesHTML = [], parentNode = this.parent;
    var navImage;
    var resNodeHTML;
    var i = 0;

	if(this.ln) {
		while (parentNode.parent != null) {
			if (parentNode.isLastNode()) navImage = 'ctrlImageVoid';
			else navImage = 'ctrlImageLine';
			parentNodesHTML[i] = '<span class="' + tocImages[navImage] + '" border="0">&nbsp;</span>';
			parentNode = parentNode.parent;
			i++;
		}

		resNodeHTML = '<a name="#nodeAhchor' + this.id + '"></a><nobr><div class="toc_entry">';
		resNodeHTML += parentNodesHTML.join('');

		if (this.children) {
			resNodeHTML += '<a href="javascript:childTrees[\'' + this.id + '\'].toggle()">';
			resNodeHTML += '<span class="' + this.NodeImage(true) + '" border="0" id="ctrlImage' + this.id + '">&nbsp;</span>';
			resNodeHTML += '</a>';
		} else {
			resNodeHTML += '<span class="' + this.NodeImage(true) + '" border="0">&nbsp;</span>';
		}
		resNodeHTML += '<a href="' + this.ln + '" target="content" onclick="return childTrees[\'' + this.id + '\'].select(false);" ondblclick="childTrees[\'' + this.id + '\'].toggle()" class="treeitem" id="nodeAhchor' + this.id + '">';
		resNodeHTML += '<span class="' + this.NodeImage() + '" id="bookImage' + this.id + '" >&nbsp;</span>';
		resNodeHTML += '<span class="tree_entry_title">' + this.ttl + '</span></a></div></nobr>';
		if (this.children)
			resNodeHTML += '<div id="divtree' + this.id + '" style="display:none"></div>';
		this.isRendered = true;
	} else {
		resNodeHTML = '<div class="toc_entry">';
		resNodeHTML += '<span class="custom_tree_entry_image" border="0" id="customImage' + this.id + '">&nbsp;</span>';
		resNodeHTML += '<div class="custom_tree_entry_content">';
		resNodeHTML += '<span class="custom_tree_entry_title">' + this.ttl + '</span></nobr>';
		resNodeHTML += '<span class="custom_tree_entry_description">' + this.dsc + '</span></nobr>';
		resNodeHTML += '</div></div>';
	}

    return resNodeHTML;
}

function initTOC()
{
	var root = new Object();

	root.expandTOCNode = expandTOCNode;


	root.previous = null;
	root.following = null;
	root.parent = null;
	root.id = 'root_node';
	root.opn = true;

	root.children = new Array();
	assignNodeMethods(root);
	return root;
}

function appendTocNode(root, tocItems) {

    var html = "";
    for(var i = 0; i < tocItems.length; i++) {
        var node = initTocNode(tocItems[i], root);
        root.children[root.children.length] = node;
        html += node.init();
        curViewed = node;
    }
    document.write(html);
    ExpandAllOpened(root);

}

function assignNodeMethods(node) {
	node.getChild = getChild;
	node.getPreceding = getPreceding;
	node.getFollowing = getFollowing;
	node.NodeImage = SetNodeImage;
	node.OpenCloseNode = OpenCloseNode;
	node.toggle = OpenCloseNode;
	node.select = ViewNode;
	node.init = InitializeNode;
	node.isLastNode = isLastNode;
	node.isFirstNode = isFirstNode;

	childTrees[node.id] = node;
}

function getChild(id) {
	if (this.children) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].id == id) {
				return this.children[i];
			}
		}
	}
	return null;
}

function getPreceding(id) {
	var currentNum = -1;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == id) {
			currentNum = i;
			break;
		}
	}
	if (currentNum > 0) {
		return this.children[currentNum-1];
	} else {
		return null;
	}
}

function getFollowing(id) {
	var currentNum = this.children.length;
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].id == id) {
			currentNum = i;
			break;
		}
	}
	if (currentNum < this.children.length-1) {
		return this.children[currentNum+1];
	} else {
		return null;
	}
}

function initTocNode(node, parent) {
	node.isRendered = false;
    node.parent = parent;
	node.preceding = parent.getPreceding(node.id);
	node.following = parent.getFollowing(node.id);
	assignNodeMethods(node);

/*
    if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
            if (node.opn) {
                initTocNode(node.children[i], node);
            }

		}
    }
*/
    return node;
}

// SIG // Begin signature block
// SIG // MIIMzQYJKoZIhvcNAQcCoIIMvjCCDLoCAQExDjAMBggq
// SIG // hkiG9w0CBQUAMGYGCisGAQQBgjcCAQSgWDBWMDIGCisG
// SIG // AQQBgjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIB
// SIG // AAIBAAIBAAIBAAIBADAgMAwGCCqGSIb3DQIFBQAEEJhZ
// SIG // ADQ+P2qpiPTNB3YQgy2gggoPMIIE/DCCBGWgAwIBAgIQ
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
// SIG // DAYKKwYBBAGCNwIBFTAfBgkqhkiG9w0BCQQxEgQQZNOt
// SIG // Hz7qvr+gSZvohBqm+zBUBgorBgEEAYI3AgEMMUYwRKAm
// SIG // gCQAQQB1AHQAbwBkAGUAcwBrACAAQwBvAG0AcABvAG4A
// SIG // ZQBuAHShGoAYaHR0cDovL3d3dy5hdXRvZGVzay5jb20g
// SIG // MA0GCSqGSIb3DQEBAQUABIGAei5aHG/K/oYS8lz/BW2N
// SIG // s7Qgiop8FVPvSox3nZgO0ybNkykjjib5qz/YphamNJ0u
// SIG // E9bIr42+092K0ETHUBSvX2ajQiB7fDATYLiLIMdEEOvM
// SIG // RjE5ymZ2DrDL4MM02WlOMlm1n7nOBSum7qmHKKd0XzSX
// SIG // V4c/7eUex7rb6qI5l2I=
// SIG // End signature block
