function updateContextMenu(defaults, snippets) {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "ezclip-root",
      title: "EZClip",
      contexts: ["editable", "page"]
    });

    const menuItems = [
      ...defaults,
      ...snippets
    ];

    menuItems.forEach((clip, i) => {
      chrome.contextMenus.create({
        id: `clip-${i}`,
        parentId: "ezclip-root",
        title: clip.label,
        contexts: ["editable", "page"]
      });
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["defaults", "snippets"], data => {
    updateContextMenu(data.defaults || [], data.snippets || []);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "updateMenu") {
    chrome.storage.sync.get(["defaults", "snippets"], data => {
      updateContextMenu(data.defaults || [], data.snippets || []);
    });
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  chrome.storage.sync.get(["defaults", "snippets"], data => {
    const all = [...(data.defaults || []), ...(data.snippets || [])];
    const index = parseInt(info.menuItemId.replace("clip-", ""));
    if (all[index]) {
      chrome.scripting.executeScript({
        target: { tabId: info.tabId },
        func: (text) => navigator.clipboard.writeText(text),
        args: [all[index].value]
      });
    }
  });
});
