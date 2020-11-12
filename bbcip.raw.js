const BbContentItemPlus = (function() {
	let head = document.getElementsByTagName("head")[0]
	const headerPrefix = /^:{2} */
	const bgHeaderPrefix = /^:{2}([^,]+), */
	const bgTextHeaderPrefix = /^:{2}([^,]+),([^,]+), */
	const anyHeaderPrefix = /^:{2}([^,]+,){0,2} */
	const actionTagPrefix = /^([^:]+):{2} */
	const itemIconSuffix = /\{{2}([^}]+)\}{2}$/
	const faIconType = /\bfa[srldb]\b/
	const faIconSize = /\bfa-(lg|\dx)\b/
	const faIconFW = /\bfa-fw\b/
	const faIconName = /\bfa-\w+\b/

	const qs = function(el, selectors) {
		selectors = makeArray(selectors)
		let descendents = selectors.map(x => el.querySelector(x)).filter(x => x != null)
		return descendents.length == 1 ? descendents[0] : descendents
	}

	const filterContentItems = function(re, item) {
		return re.test(getItemTitle(item).innerText)
	}
	const filterAnyHeaderItems = item => filterContentItems(anyHeaderPrefix, item)
	const filterActionTagItems = item => filterContentItems(actionTagPrefix, item)
	const filterItemIconItems = item => filterContentItems(itemIconSuffix, item)
	
	const getItemTitle = function(item) {
		return qs(item, 'h3 > span:not(.reorder)[style]') || qs(item, 'h3 > a > span:not(.reorder)')
	}
	
	const makeArray = function(x) {
		return Array.isArray(x) ? x : [x]
	}
	
	const styleElement = function(els, styles, value = null) {
		els = makeArray(els)
		if ((value != null) || Object.isString(styles)) {
			styles = { [styles]: value }
		}
		els.forEach(el => Object.keys(styles).forEach(key => el.style[key] = styles[key]))
	}
	const hideElement = function(el) {
		return styleElement(el, 'display', 'none')
	}
	
	
	
	const makeHeader = function(item) {
		let title = getItemTitle(item)
		let prefix
		if (bgTextHeaderPrefix.test(title.innerText)) {
			let matches = title.innerText.match(bgTextHeaderPrefix)
			styleElement(item, {
				'background': matches[1],
				'color': matches[2]
			})
			styleElement(title, 'color', matches[2])
			prefix = bgTextHeaderPrefix
			
		} else if (bgHeaderPrefix.test(title.innerText)) {
			let matches = title.innerText.match(bgHeaderPrefix)
			styleElement(item, 'background', matches[1])			
			prefix = bgHeaderPrefix
		} else {
			styleElement(item, 'background', "#ddd")
			prefix = headerPrefix
		}
		styleElement(item, {
			'borderLeft': "1px solid #cdcdcd",
			'borderRight': "1px solid #cdcdcd"
		})
		hideElement(qs(item, "img.item_icon"))
		styleElement(qs(item, ['div.item', 'div.details']), 'paddingLeft', '0')
		styleElement(qs(item, 'h3'), 'fontSize', '1.5rem')
		title.innerText = title.innerText.replace(prefix, "")		
	}
	
	const makeActionTag = function(item) {
		let title = getItemTitle(item)
		title.innerHTML = title.innerText.replace(actionTagPrefix, (match, p1) => `<span style="background:black;color:white;padding:0.25rem 0.6rem;margin-right:0.5rem;text-decoration:none;border-radius:0.35rem;font-weight:bold;">${p1.toUpperCase()}</span>`);
	}
	
	const makeItemIcon = function(item) {
		let title = getItemTitle(item)

		if (itemIconSuffix.test(title.innerText)) {
			[, iconInfo, ...rest] = title.innerText.match(itemIconSuffix)
			
			if (!faIconType.test(iconInfo)) {
				iconInfo = `fas ${iconInfo}`
			}
			
			if (!faIconFW.test(iconInfo)) {
				iconInfo += " fa-fw"
			}
			if (!faIconSize.test(iconInfo)) {
				iconInfo += " fa-3x"
			}
			
			let iconName = [faIconType, faIconFW, faIconSize].reduce((memo, val) => memo.replace(val, ""), iconInfo).trim()
			if (!faIconName.test(iconName)) {
				let re = new RegExp(`\\b${iconName}\\b`)
				iconInfo = iconInfo.replace(re, `fa-${iconName}`)
			}
			let img = item.querySelector('img.item_icon')
			hideElement(img)
			title.innerHTML = title.innerText.replace(itemIconSuffix, "")
			item.innerHTML = `<i class="${iconInfo}" style="position:absolute;top:1.5rem;left:1.5rem;color:#666;"></i>${item.innerHTML}`
			
		}
		
	}

	const begin = function() {
		if (!document.getElementById('FontAwesome')) {
		    let link = document.createElement("link");
		    Object.entries({
			    "rel": 		"stylesheet",
			    "id": 		"FontAwesome",
			    "href": 		"https://pro.fontawesome.com/releases/v5.15.1/css/all.css",
			    "integrity":	"sha384-9ZfPnbegQSumzaE7mks2IYgHoayLtuto3AS6ieArECeaR8nCfliJVuLh/GaQ1gyM",
			    "crossorigin":	"anonymous"
		    }).forEach( function([key,val]) { link.setAttribute(key, val) })
		    head.appendChild(link)
		}
		
		
		let allContentItems = Array.from(document.querySelectorAll('.liItem.read'))
		
		allContentItems.filter(filterItemIconItems).forEach(makeItemIcon)
		allContentItems.filter(filterAnyHeaderItems).forEach(makeHeader)
		allContentItems.filter(filterActionTagItems).forEach(makeActionTag)
		
		let cs = document.currentScript
		let bbcip = document.getElementById('BbContentItemPlus')
		
		let scriptItem = (cs && cs.closest('.liItem.read')) || (bbcip && bbcip.closest('.liItem.read'))
		if (scriptItem) {
			hideElement(scriptItem)
		}
		
	}

	return {
		begin: begin
	}
	
})()
window.setTimeout(BbContentItemPlus.begin, 200)