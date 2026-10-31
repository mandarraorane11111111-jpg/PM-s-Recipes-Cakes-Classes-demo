// PM's Recipes demo website
// IMPORTANT: Replace this with the owner's approved WhatsApp number (country code + number, digits only).
// Example format: "919876543210". Leave blank until the owner gives permission.
const BUSINESS_WHATSAPP = "";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const backTop = document.getElementById("backTop");
  const form = document.getElementById("enquiryForm");
  const formMessage = document.getElementById("formMessage");

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  // Reveal-on-scroll animation
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("in-view"));
  }

  // Cake collection filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    productCards.forEach(card => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  }));

  // Enquiry form: opens WhatsApp only after the owner number is configured.
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      "Hello PM's Recipes!",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Interested in: ${data.get("type")}`,
      `Message: ${data.get("message") || "Please share more details."}`
    ].join("\n");

    if (/^\d{10,15}$/.test(BUSINESS_WHATSAPP)) {
      const url = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      formMessage.textContent = "Your enquiry has been prepared in WhatsApp. Please review and send it.";
    } else {
      formMessage.textContent = "Demo mode: enquiry captured in this preview only. Add the owner's approved WhatsApp number in js/script.js to enable WhatsApp sending.";
      const blob = new Blob([message], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "pms-recipes-enquiry.txt";
      link.click();
      URL.revokeObjectURL(downloadUrl);
    }
  });

  // Back-to-top button and footer year
  window.addEventListener("scroll", () => backTop.classList.toggle("visible", window.scrollY > 500));
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.getElementById("year").textContent = new Date().getFullYear();
});
