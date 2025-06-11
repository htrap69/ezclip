function loadSnippets() {
    chrome.storage.sync.get(["defaults", "snippets"], (data) => {
      const defaults = data.defaults || [];
      const snippets = data.snippets || [];
      const all = [...defaults, ...snippets];
      const container = document.getElementById("clips");
      container.innerHTML = "";
      all.forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = `Copy ${item.label}`;
        btn.onclick = () => navigator.clipboard.writeText(item.value);
        container.appendChild(btn);
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", loadSnippets);