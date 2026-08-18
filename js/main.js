/* ==========================================================================
   Awesome God Ministries — Interactions
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  var activeLink = document.querySelector(".nav__links a.active");
  var navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  function updateActiveLink() {
    var pos = window.scrollY + 120;
    var current = null;

    navAnchors.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target && target.offsetTop <= pos) {
        current = link;
      }
    });

    navAnchors.forEach(function (link) {
      link.classList.toggle("active", link === current);
    });
  }

  if ("IntersectionObserver" in window) {
    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
  } else if (activeLink) {
    activeLink.classList.add("active");
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-lightbox="gallery"]')
  );

  if (galleryLinks.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-label", "Image viewer");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&#215;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next">&#8250;</button>' +
      '<div class="lightbox__inner"><img class="lightbox__img" src="" alt=""><span class="lightbox__caption"></span></div>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector(".lightbox__img");
    var lightboxCaption = lightbox.querySelector(".lightbox__caption");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    var nextBtn = lightbox.querySelector(".lightbox__nav--next");
    var current = 0;

    function openLightbox(index) {
      current = index;
      var link = galleryLinks[current];
      lightboxImg.setAttribute("src", link.getAttribute("href"));
      lightboxImg.setAttribute("alt", link.querySelector("img").getAttribute("alt"));
      lightboxCaption.textContent = link.getAttribute("data-caption") || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    galleryLinks.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });

    function navigate(dir) {
      current = (current + dir + galleryLinks.length) % galleryLinks.length;
      lightboxImg.style.opacity = "0";
      setTimeout(function () {
        var link = galleryLinks[current];
        lightboxImg.setAttribute("src", link.getAttribute("href"));
        lightboxImg.setAttribute("alt", link.querySelector("img").getAttribute("alt"));
        lightboxCaption.textContent = link.getAttribute("data-caption") || "";
        lightboxImg.style.opacity = "1";
      }, 120);
    }

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function () { navigate(-1); });
    nextBtn.addEventListener("click", function () { navigate(1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    });
  }
})();
