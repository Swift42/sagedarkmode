/*   
	Old V2 code:
	chrome.webRequest.onBeforeRequest.addListener(
		function(details) {
			
			let idx=details.url.lastIndexOf("/");
			let url=chrome.runtime.getURL(details.url.substring(idx+1));
			url=url.replace(".jpg",".png");
			url=url.replace(".jpeg",".jpg");
			return { redirectUrl: url };
						
			
		},
		{urls: ["https://cdn.staratlas.com/sage-labs/labs-background.jpeg", "https://cdn.staratlas.com/sage-labs/map-border-odd.jpg", "https://cdn.staratlas.com/sage-labs/extend-column-right.jpg" , "https://cdn.staratlas.com/sage-labs/extend-column-left.jpg",
		"https://cdn.staratlas.com/sage-labs/map-column-odd.jpg", "https://cdn.staratlas.com/sage-labs/map-column-even.jpg" ]},
		["blocking"]
	);
*/
	
const newRules = [];
newRules.push({ "id": 1, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("labs-background.jpg") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/labs-background.jpeg", "resourceTypes": ["image"] }
});	
newRules.push({ "id": 2, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("map-border-odd.png") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/map-border-odd.jpg", "resourceTypes": ["image"] }
});	
newRules.push({ "id": 3, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("map-border-even.png") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/map-border-even.jpg", "resourceTypes": ["image"] }
});	
newRules.push({ "id": 4, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("extend-column-right.png") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/extend-column-right.jpg", "resourceTypes": ["image"] }
});	
newRules.push({ "id": 5, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("extend-column-left.png") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/extend-column-left.jpg", "resourceTypes": ["image"] }
});	
newRules.push({ "id": 6, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("map-column-odd.png") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/map-column-odd.jpg", "resourceTypes": ["image"] }
});	
newRules.push({ "id": 7, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("map-column-even.png") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/map-column-even.jpg", "resourceTypes": ["image"] }
});	

chrome.declarativeNetRequest.getDynamicRules(previousRules => {
  const previousRuleIds = previousRules.map(rule => rule.id);
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: previousRuleIds,
    addRules: newRules
  });
});

