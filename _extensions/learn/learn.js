// Adds a small "Learn" button beside each heading marked data-learn by learn.lua.
// Clicking it copies a prompt for that section and shows a short note. The prompt is plain text,
// not "/learn <link>": an uninstalled slash command never reaches Claude, while plain text does,
// so Claude can run the learn skill if it is installed and install it first if it is not.
(function () {
  var ICON = '<svg viewBox="0 0 13 7" width="20" height="11" shape-rendering="crispEdges" aria-hidden="true"><g fill="#D97757"><rect x="2" y="0" width="9" height="1"/><rect x="2" y="1" width="9" height="1"/><rect x="2" y="2" width="1" height="1"/><rect x="4" y="2" width="5" height="1"/><rect x="10" y="2" width="1" height="1"/><rect x="0" y="3" width="13" height="1"/><rect x="2" y="4" width="9" height="1"/><rect x="2" y="5" width="9" height="1"/><rect x="2" y="6" width="1" height="1"/><rect x="4" y="6" width="1" height="1"/><rect x="8" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/></g><rect x="3" y="2" width="1" height="1" fill="#1F1F1F"/><rect x="9" y="2" width="1" height="1" fill="#1F1F1F"/></svg>';

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  var CHECK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var PASTE = /Mac|iPhone|iPad/.test(navigator.platform) ? "Cmd+V" : "Ctrl+V";

  function note(btn, text, ok) {
    var n = btn.querySelector(".learn-note");
    n.textContent = text;
    if (ok) {
      btn.querySelector(".learn-icon").innerHTML = CHECK;
      btn.querySelector(".learn-label").textContent = "Copied";
    }
    btn.classList.toggle("learn-failed", !ok);
    btn.classList.add("learn-copied");
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.classList.remove("learn-copied", "learn-failed"); btn.querySelector(".learn-icon").innerHTML = ICON; btn.querySelector(".learn-label").textContent = "Learn in Claude"; }, 2600);
  }

  // The workshop's attendees work in their own repos, so the learn skill installs into their
  // personal skills folder (~/.claude/skills), and nothing else in their repo changes.
  function prompt(url) {
    return "Teach me this section of the AI PM Bootcamp site with the learn skill: " + url + "\n\n" +
      "If the learn skill is not installed, install it first for all my projects: clone " +
      "https://github.com/byu-strategy/builder-template with `git clone --depth 1` into a temporary " +
      "folder outside this repo, copy its .claude/skills/learn folder to ~/.claude/skills/learn " +
      "(replacing any older copy), and delete the temporary folder. Change nothing else. Then start the lesson.";
  }

  function init() {
    document.querySelectorAll("[data-learn]").forEach(function (el) {
      var h = /^H[1-6]$/.test(el.tagName) ? el : el.querySelector("h2");
      if (!h || h.querySelector(".learn-btn")) return;
      var cmd = prompt(el.getAttribute("data-learn").replace(/^\/learn\s+/, ""));
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "learn-btn";
      btn.title = "Copy a prompt for this section, then paste it into Claude Code";
      btn.setAttribute("aria-label", "Copy a Claude Code prompt to learn this section");
      btn.innerHTML = '<span class="learn-icon">' + ICON + '</span><span class="learn-label">Learn in Claude</span><span class="learn-note" role="status" aria-live="polite"></span>';
      btn.addEventListener("click", function () {
        copy(cmd).then(
          function () { note(btn, "On your clipboard. Paste it into Claude Code (" + PASTE + ").", true); },
          function () { window.prompt("Copy this, then paste it into Claude Code:", cmd); }
        );
      });
      h.appendChild(btn);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
