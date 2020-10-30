const BbContentItemPlus = (function() {
	var head = document.getElementsByTagName("head")[0]
	const headerPrefix = /^:{2} */
	const bgHeaderPrefix = /^:{2}([^,]+), */
	const bgTextHeaderPrefix = /^:{2}([^,]+),([^,]+), */
	const anyHeaderPrefix = /^:{2}([^,]+,){0,2} */
	const actionTagPrefix = /^([^:]+):{2} */

	const filterContentItems = function(re, item) {
		return re.test(item.querySelector('h3').innerText)
	}
	const filterAnyHeaderItems = item => filterContentItems(anyHeaderPrefix, item)
	const actionTagItems = item => filterContentItems(actionTagPrefix, item)
	
	const itemTitle = function(item) {
		return item.querySelector('h3 > span:not(.reorder)[style]') || item.querySelector('h3 > a > span:not(.reorder)')
	}
	
	
	const makeHeader = function(item) {
		let title = itemTitle(item)
		let prefix
		if (bgTextHeaderPrefix.test(title.innerText)) {
			let matches = title.innerText.match(bgTextHeaderPrefix)
			item.style.background = matches[1]
			item.style.color = matches[2]
			title.style.color = matches[2]
			prefix = bgTextHeaderPrefix
			
		} else if (bgHeaderPrefix.test(title.innerText)) {
			let matches = title.innerText.match(bgHeaderPrefix)
			item.style.background = matches[1]
			prefix = bgHeaderPrefix
		} else {
			item.style.background = "#ddd"			
			prefix = headerPrefix
		}
		item.style.border = "none !important"
		item.querySelector("img.item_icon").style.display = "none"
		item.querySelector("div.item").style.paddingLeft = "0"
		item.querySelector("div.details").style.paddingLeft = "0"
		item.querySelector("h3").style.fontSize = "1.5rem"
		title.innerText = title.innerText.replace(prefix, "")		
	}
	
	const makeActionTag = function(item) {
		let title = itemTitle(item)
		item.innerHTML = item.innerText.replace(actionTagPrefix, (match, p1) => `<span style="background:black;color:white;padding:0.25rem 0.6rem;margin-right:0.5rem;text-decoration:none;border-radius:0.35rem;font-weight:bold;">${p1.toUpperCase()}</span>`);
	}

	
	const begin = function() {
		let allContentItems = Array.from(document.querySelectorAll('.liItem.read'))
		
		allContentItems.filter(filterAnyHeaderItems).forEach(makeHeader)
		allContentItems.filter(actionTagItems).forEach(makeActionTag)
		
		let scriptItem = (document.currentScript && document.currentScript.closest('.liItem.read')) || document.getElementById('BbContentItemPlus')
		if (scriptItem) {
			scriptItem.style.display = "none"
		}
		
	}

	return {
		begin: begin
	}
	
})()
window.setTimeout(BbContentItemPlus.begin, 250)