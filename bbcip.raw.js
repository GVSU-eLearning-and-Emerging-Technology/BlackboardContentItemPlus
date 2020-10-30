const BbContentItemPlus = (function() {
	var head = document.getElementsByTagName("head")[0]
	const headerPrefix = /^:{2}/
	const actionTagPrefix = /^([^:]+):{2} */

	const filterContentItems = function(re, item) {
		return re.test(item.querySelector('h3').innerText)
	}
	const filterHeaderItems = item => filterContentItems(headerPrefix, item)
	const actionTagItems = item => filterContentItems(actionTagPrefix, item)
	
	const makeHeader = function(item) {
		item.style.background = "#ddd"
		item.style.border = "none !important"
		item.querySelector("img.item_icon").style.display = "none"
		item.querySelector("div.item").style.paddingLeft = "0"
		item.querySelector("div.details").style.paddingLeft = "0"
		item.querySelector("h3").style.fontSize = "1.5rem"
		let title = item.querySelector('h3 span:not(.reorder)[style]')
		title.innerText = title.innerText.replace(headerPrefix, "")		
	}
	
	const makeActionTag = function(item) {
		let title = item.querySelector('h3 > span:not(.reorder)') || item.querySelector('h3 > a > span:not(.reorder)')
		item.innerHTML = item.innerText.replace(actionTagPrefix, (match, p1) => `<span style="background:black;color:white;padding:0.25rem 0.6rem;margin-right:0.5rem;text-decoration:none;border-radius:0.35rem;font-weight:bold;">${p1}</span>`);
	}

	
	const begin = function() {
		let allContentItems = Array.from(document.querySelectorAll('.liItem.read'))
		
		allContentItems.filter(filterHeaderItems).forEach(makeHeader)
		allContentItems.filter(actionTagItems).forEach(makeActionTag)
		
		let scriptItem = document.currentScript.closest('.liItem.read') || document.getElementById('BbContentItemPlus')
		if (scriptItem) {
			scriptItem.style.display = "none"
		}
		
	}

	return {
		begin: begin
	}
	
})()
window.setTimeout(BbContentItemPlus.begin, 250)