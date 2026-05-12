(function () {
  "use strict";

  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  var prefersReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* Smooth scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (prefersReduced) {
        target.scrollIntoView();
        return;
      }
      var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* Scroll reveal */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll(".reveal, .hero-photo");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal, .hero-photo").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Contact form validation */
  var form = document.getElementById("contact-form");
  if (form) {
    var nameInput = form.querySelector("#name");
    var emailInput = form.querySelector("#email");
    var messageInput = form.querySelector("#message");
    var statusEl = form.querySelector(".form-status");

    function showFieldError(fieldWrap, message) {
      fieldWrap.classList.add("has-error");
      var msg = fieldWrap.querySelector(".error-msg");
      if (msg) msg.textContent = message;
    }

    function clearFieldError(fieldWrap) {
      fieldWrap.classList.remove("has-error");
    }

    function isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (statusEl) {
        statusEl.classList.remove("is-success", "is-error");
        statusEl.style.display = "none";
      }

      var ok = true;
      var nameWrap = form.querySelector('[data-field="name"]');
      var emailWrap = form.querySelector('[data-field="email"]');
      var messageWrap = form.querySelector('[data-field="message"]');

      clearFieldError(nameWrap);
      clearFieldError(emailWrap);
      clearFieldError(messageWrap);

      if (!nameInput.value.trim()) {
        showFieldError(nameWrap, "Please enter your name.");
        ok = false;
      }
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        showFieldError(emailWrap, "Please enter a valid email address.");
        ok = false;
      }
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showFieldError(messageWrap, "Message should be at least 10 characters.");
        ok = false;
      }

      if (!ok) return;

      if (statusEl) {
        statusEl.textContent =
          "Thanks — your message looks good. (Demo: no server; nothing was sent.)";
        statusEl.classList.add("is-success");
        statusEl.style.display = "block";
      }
      form.reset();
    });
  }
})();
