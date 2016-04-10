;
(function($) {

	function parse(xml, extended) {
		if (!xml)
			return {}; // quick fail

		function text2xml(str) {
			var out;
			try {
				var xml = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
				xml.async = false;
			} catch (e) {
				throw new Error("XML Parser could not be instantiated")
			};
			try {
				if ( !! $.browser.ie)
					out = (xml.loadXML(str)) ? xml : false;
				else
					out = xml.parseFromString(str, "text/xml");
			} catch (e) {
				throw new Error("Error parsing XML string")
			};
			return out;
		}

		function parseXML(node, simple) {
			if (!node)
				return null;
			var txt = '',
				obj = null,
				att = null;
			var nt = node.nodeType,
				nn = jsVar(node.localName || node.nodeName);
			var nv = node.text || node.nodeValue || '';

			if (node.childNodes) {
				if (node.childNodes.length > 0) {

					$.each(node.childNodes, function(n, cn) {
						var cnt = cn.nodeType,
							cnn = jsVar(cn.localName || cn.nodeName);
						var cnv = cn.text || cn.nodeValue || '';

						if (cnt == 8) {
							return; // ignore comment node
						} else if (cnt == 3 || cnt == 4 || !cnn) {
							// ignore white-space in between tags
							if (cnv.match(/^\s+$/)) {
								return;
							};
							txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
							// make sure we ditch trailing spaces from markup
						} else {
							obj = obj || {};
							if (obj[cnn]) {

								if (!obj[cnn].length)
									obj[cnn] = myArr(obj[cnn]);
								obj[cnn][obj[cnn].length] = parseXML(cn, true /* simple */ );
								obj[cnn].length = obj[cnn].length;
							} else {
								obj[cnn] = parseXML(cn);
							};
						};
					});
				}; // node.childNodes.length>0
			}; // node.childNodes
			if (node.attributes) {
				if (node.attributes.length > 0) {
					att = {};
					obj = obj || {};
					$.each(node.attributes, function(a, at) {
						var atn = jsVar(at.name),
							atv = at.value;
						att[atn] = atv;
						if (obj[atn]) {
							if (!obj[atn].length)
								obj[atn] = myArr(obj[atn]); // [ obj[ atn ] ];
							obj[atn][obj[atn].length] = atv;
							obj[atn].length = obj[atn].length;
						} else {

							obj[atn] = atv;
						};
					});
					// obj['attributes'] = att;
				}; // node.attributes.length>0
			}; // node.attributes
			if ( !! obj) {

				txt = (obj.text) ? (typeof(obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
				if (txt)
					obj.text = txt;
				txt = '';
			};
			var out = obj || txt;
			if (extended) {
				if (txt)
					out = {}; // new String(out);
				txt = out.text || txt || '';
				if (txt)
					out.text = txt;
				if (!simple)
					out = myArr(out);
			};
			return out;
		}; // parseXML
		// Core Function End
		// Utility functions
		var jsVar = function(s) {
			return String(s || '').replace(/-/g, "_");
		};
		var isNum = function(s) {
			return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/);
		};
		var myArr = function(o) {
			if (!o.length)
				o = [o];
			o.length = o.length;
			// here is where you can attach additional functionality, such as searching and sorting...
			return o;
		};
		// Convert plain text to xml
		if (typeof xml == 'string')
			xml = text2xml(xml);

		// Quick fail if not xml (or if this is a node)
		if (!xml.nodeType)
			return;
		if (xml.nodeType == 3 || xml.nodeType == 4)
			return xml.nodeValue;

		// Find xml root node
		var root = (xml.nodeType == 9) ? xml.documentElement : xml;

		// Convert xml to json
		var out = parseXML(root, true /* simple */ );

		// Clean-up memory
		xml = null;
		root = null;

		// Send output
		return out;
	};
	$.xml2json = parse;
})(x.$);