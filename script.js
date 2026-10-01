document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");

const closeMenu = () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  navigation?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 24),
  { passive: true },
);

header?.classList.toggle("is-scrolled", window.scrollY > 24);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});

const switcher = document.querySelector("[data-audience-switcher]");

if (switcher) {
  const tabs = [...switcher.querySelectorAll("[role='tab']")];
  const panels = [...switcher.querySelectorAll("[role='tabpanel']")];

  const activateTab = (tab) => {
    tabs.forEach((candidate) => {
      const isActive = candidate === tab;
      candidate.setAttribute("aria-selected", String(isActive));
      candidate.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab.dataset.tab;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const enquiryForm = document.querySelector("[data-enquiry-form]");

enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!enquiryForm.reportValidity()) return;

  const fields = new FormData(enquiryForm);
  const name = fields.get("name");
  const organisation = fields.get("organisation") || "Not specified";
  const senderEmail = fields.get("email");
  const interest = fields.get("interest");
  const message = fields.get("message");

  const subject = `Consultancy enquiry: ${interest}`;
  const body = [
    `Name: ${name}`,
    `Organisation: ${organisation}`,
    `Email: ${senderEmail}`,
    `Area of interest: ${interest}`,
    "",
    "Brief:",
    message,
  ].join("\n");

  window.location.href = `mailto:stevenakpabio@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll("[data-current-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});
