chrome.storage.local.get("useMapType", (result) => {
  const value = result.useMapType || "";
  console.log(result);
  const meta = document.createElement("meta");
  meta.name = "useMapType";
  meta.content = value;
  document.documentElement.appendChild(meta);
});