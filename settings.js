function renderClips(snippets) {
    const list = document.getElementById("clipList");
    list.innerHTML = "";
    snippets.forEach((clip, index) => {
        const item = document.createElement("li");
        item.textContent = `${clip.label}: ${clip.value}`;
        const btn = document.createElement("button");
        btn.textContent = "❌";
        btn.onclick = () => deleteClip(index);
        item.appendChild(btn);
        list.appendChild(item);
    });
}

function deleteClip(index) {
    chrome.storage.sync.get("snippets", (data) => {
        const snippets = data.snippets || [];
        snippets.splice(index, 1);
        chrome.storage.sync.set({ snippets }, () => {
            renderClips(snippets);
            chrome.runtime.sendMessage({ type: "updateMenu" });
        });
    });
}

function saveDefaults(e) {
    e.preventDefault();
    const defaults = [
        { label: "LinkedIn", value: document.getElementById("linkedin").value },
        { label: "Email", value: document.getElementById("email").value },
        { label: "Phone", value: document.getElementById("phone").value },
        { label: "GitHub", value: document.getElementById("github").value },
        { label: "Portfolio", value: document.getElementById("portfolio").value }
    ];
    chrome.storage.sync.set({ defaults }, () => {
        chrome.runtime.sendMessage({ type: "updateMenu" });
    });
}

document.getElementById("defaultsForm").addEventListener("submit", saveDefaults);

document.getElementById("clipForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const label = document.getElementById("label").value;
    const value = document.getElementById("value").value;
    chrome.storage.sync.get("snippets", (data) => {
        const snippets = data.snippets || [];
        snippets.push({ label, value });
        chrome.storage.sync.set({ snippets }, () => {
            document.getElementById("label").value = "";
            document.getElementById("value").value = "";
            renderClips(snippets);
            chrome.runtime.sendMessage({ type: "updateMenu" });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["snippets", "defaults"], (data) => {
        renderClips(data.snippets || []);
        const defaults = data.defaults || [];
        const defaultMap = {};
        defaults.forEach(d => defaultMap[d.label.toLowerCase()] = d.value);
        document.getElementById("linkedin").value = defaultMap.linkedin || "";
        document.getElementById("email").value = defaultMap.email || "";
        document.getElementById("phone").value = defaultMap.phone || "";
        document.getElementById("github").value = defaultMap.github || "";
        document.getElementById("portfolio").value = defaultMap.portfolio || "";
    });
});
