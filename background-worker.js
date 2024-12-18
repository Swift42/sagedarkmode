const newRules = [];
newRules.push({ "id": 1, "priority": 1, 
	"action": { "type": "redirect", "redirect": { "url": chrome.runtime.getURL("labs-background.jpg") } } ,
    "condition": { "urlFilter": "https://cdn.staratlas.com/sage-labs/labs-background.jpeg", "resourceTypes": ["image"] }
});	

chrome.declarativeNetRequest.getDynamicRules(previousRules => {
  const previousRuleIds = previousRules.map(rule => rule.id);
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: previousRuleIds,
    addRules: newRules
  });
});
