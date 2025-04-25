document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('myDropdown');

  
  // Load previously selected value
  chrome.storage.local.get('useMapType', (result) => {
    if (result.useMapType) {
      dropdown.value = result.useMapType;
    }
  });

  // Save new selected value
  dropdown.addEventListener('change', () => {
    const selected = dropdown.value;
    chrome.storage.local.set({ useMapType: selected });
  });
    
});
