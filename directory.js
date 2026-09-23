"use strict";
(() => {
  const main = document.querySelector(".home-main");
  const section = main?.querySelector(".projects-block");
  const container = section?.querySelector(".wide");
  const dialog = document.querySelector(".more-dialog");
  if (!container || !dialog || !dialog.showModal) return;
  const rows = [...container.querySelectorAll(".project-row")];
  const list = document.createElement("div");
  list.className = "directory-items";
  container.append(list);
  rows.forEach(row => list.append(row));
  const more = document.createElement("button");
  more.type = "button";
  more.className = "more-button";
  more.setAttribute("aria-haspopup", "dialog");
  more.hidden = true;
  container.append(more);
  const extras = dialog.querySelector(".dialog-items");
  document.body.classList.add("directory-ready");
  let frame;
  function fit() {
    if (dialog.open) return;
    const restoreFocus = document.activeElement === more;
    rows.forEach(row => list.append(row));
    more.hidden = true;
    const available = container.getBoundingClientRect().bottom - list.getBoundingClientRect().top;
    if (list.getBoundingClientRect().height <= available + 1) {
      if (restoreFocus) rows[0]?.focus();
      return;
    }
    more.hidden = false;
    more.textContent = "+ More";
    const reserve = more.getBoundingClientRect().height + 12;
    while (list.children.length && list.getBoundingClientRect().height > available - reserve) {
      extras.prepend(list.lastElementChild);
    }
    more.textContent = `+ ${extras.children.length} more`;
    more.setAttribute("aria-label", `Show ${extras.children.length} more ${document.querySelector("#projects") ? "projects" : "apps"}`);
  }
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); };
  more.addEventListener("click", () => dialog.showModal());
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => requestAnimationFrame(() => {
    fit();
    if (!more.hidden) more.focus();
    else rows[0]?.focus();
  }));
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  new ResizeObserver(schedule).observe(main);
  window.addEventListener("resize", schedule);
  document.fonts?.ready.then(schedule);
  fit();
})();
