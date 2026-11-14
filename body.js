"use strict";

const heroArtwork = {
  images: ["fotos/FOTO8.jpg", "fotos/FOTO4.jpg", "fotos/FOTO1.jpg", "fotos/FOTO3.jpg"],
  alts: [
    "Cuadro azul con motivos solares",
    "Pintura de un árbol colorido en una sala",
    "Cuadro figurativo en blanco y negro",
    "Composición azul de líneas y edificios"
  ]
};

const artworkSlots = [
  {
    images: ["fotos/FOTO10.jpg", "fotos/FOTO5.jpg", "fotos/FOTO6.jpg", "fotos/FOTO12.jpg"],
    alts: [
      "Retrato pintado de un lobo",
      "Composición geométrica de colores",
      "Ilustración botánica en tonos rosados y violetas",
      "Rama con flores rosas"
    ],
    title: "Selección de obras",
    description: "Cuatro obras de la colección reunidas en una sola imagen."
  },
  {
    image: "fotos/FOTO2.jpg",
    alt: "Paisaje pintado con una torre entre casas y campos",
    title: "Paisaje con torre",
    description: "Un paisaje de casas y campos bajo una torre."
  },
  {
    image: "fotos/FOTO9.jpg",
    alt: "Composición abstracta con trazos naranjas, azules y blancos",
    title: "Ritmo de color",
    description: "Trazos en tonos naranjas, azules y blancos."
  },
  {
    image: "fotos/FOTO11.jpg",
    alt: "Figura geométrica pintada junto a varias mariposas",
    title: "Figura y mariposas",
    description: "Una figura geométrica acompañada de mariposas."
  },
  {
    image: "fotos/FOTO7.jpg",
    alt: "Dos piezas circulares en tonos dorados y naturales",
    title: "Relieves dorados",
    description: "Dos formas circulares en tonos dorados y naturales."
  },
  {
    image: "fotos/FOTO14.jpg",
    alt: "Cuadro de un koala entre ramas y hojas",
    title: "Koala entre hojas",
    description: "Un koala pintado entre ramas y hojas."
  },
  {
    image: "fotos/FOTO13.jpg",
    alt: "Escena ilustrada de animales tocando música",
    title: "Música en casa",
    description: "Una escena ilustrada de animales tocando música."
  },
  { image: "", alt: "", title: "", description: "" },
  { image: "", alt: "", title: "", description: "" }
];

const workCards = Array.from(document.querySelectorAll(".work-card"));
const gallerySlides = Array.from(document.querySelectorAll("[data-gallery-slide]"));
const galleryPage = document.querySelector("[data-gallery-page]");
const galleryPreviousButton = document.querySelector("[data-gallery-prev]");
const galleryNextButton = document.querySelector("[data-gallery-next]");
const galleryPageButtons = Array.from(document.querySelectorAll("[data-gallery-page-button]"));
const heroCollage = document.querySelector("[data-hero-collage]");
const workDialog = document.querySelector("#work-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogPendingText = document.querySelector("[data-dialog-pending-text]");
const dialogIndex = document.querySelector("[data-dialog-index]");
const dialogCount = document.querySelector("[data-dialog-count]");
const dialogMedia = document.querySelector("[data-dialog-media]");
const previousButton = document.querySelector("[data-dialog-prev]");
const nextButton = document.querySelector("[data-dialog-next]");
const closeButton = document.querySelector("[data-dialog-close]");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

let activeIndex = 0;
let lastTrigger = null;
let activeSlide = 0;

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function getArtwork(index) {
  return artworkSlots[index] ?? {};
}

function createArtworkImage(source, alt, className = "") {
  const image = document.createElement("img");
  image.src = source;
  image.alt = alt || "Fotografía de una obra de Eva María";
  image.loading = "lazy";
  image.decoding = "async";
  image.className = className;
  return image;
}

function createArtworkPlaceholder(label = "Fotografía real") {
  const placeholder = document.createElement("span");
  placeholder.className = "media-placeholder";
  const mark = document.createElement("span");
  mark.className = "placeholder-mark";
  mark.setAttribute("aria-hidden", "true");
  const caption = document.createElement("span");
  caption.append(label, document.createElement("br"), "por añadir");
  placeholder.append(mark, caption);
  return placeholder;
}

function createArtworkMedia(artwork) {
  const sources = Array.isArray(artwork.images) ? artwork.images : [artwork.image || ""];

  if (sources.length > 1) {
    const collage = document.createElement("span");
    collage.className = "artwork-collage";
    collage.setAttribute("aria-hidden", "true");

    sources.forEach((source, index) => {
      const tile = document.createElement("span");
      tile.className = "collage-tile";
      if (source) {
        tile.append(createArtworkImage(source, artwork.alts?.[index] || artwork.title));
      } else {
        tile.append(createArtworkPlaceholder(`Foto ${index + 1}`));
      }
      collage.append(tile);
    });

    return collage;
  }

  if (sources[0]) {
    return createArtworkImage(sources[0], artwork.alt || artwork.title);
  }

  return createArtworkPlaceholder();
}

function renderArtworkMedia(container, artwork) {
  const indexLabel = container.querySelector(".work-index");
  const media = createArtworkMedia(artwork);
  container.replaceChildren(media);
  if (indexLabel) container.append(indexLabel);
}

function updateCard(card, index) {
  const artwork = getArtwork(index);
  const title = artwork.title.trim() || "Añadir título de la obra";
  const hasPhoto = Array.isArray(artwork.images)
    ? artwork.images.some(Boolean)
    : Boolean(artwork.image);
  const media = card.querySelector("[data-work-media]");
  renderArtworkMedia(media, artwork);

  card.querySelector(".work-kicker").textContent = hasPhoto ? "Obra de la colección" : "Espacio preparado";
  card.querySelector("[data-work-title]").textContent = title;
  card.setAttribute("aria-label", `Abrir ficha: ${artwork.title.trim() || `espacio para la obra ${formatIndex(index)}`}`);
}

function updateDialog() {
  const artwork = getArtwork(activeIndex);
  const title = artwork.title.trim() || "Añadir título de la obra";
  const description = artwork.description.trim() || "La descripción de la obra se añadirá aquí.";

  dialogIndex.textContent = formatIndex(activeIndex);
  dialogTitle.textContent = title;
  dialogDescription.textContent = description;
  dialogPendingText.textContent = artwork.description.trim() ? "Información de la obra" : "Contenido pendiente";
  dialogCount.replaceChildren();
  dialogCount.append(document.createTextNode(formatIndex(activeIndex) + " "));
  const separator = document.createElement("span");
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "/";
  dialogCount.append(separator, document.createTextNode(" " + formatIndex(artworkSlots.length)));

  dialogMedia.replaceChildren(createArtworkMedia(artwork));

  previousButton.disabled = activeIndex === 0;
  nextButton.disabled = activeIndex === artworkSlots.length - 1;
}

function openArtwork(index, trigger) {
  activeIndex = index;
  lastTrigger = trigger;
  updateDialog();
  workDialog.showModal();
  closeButton.focus();
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  primaryNav.classList.remove("is-open");
}

function showGallerySlide(index) {
  activeSlide = Math.max(0, Math.min(index, gallerySlides.length - 1));
  gallerySlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.hidden = !isActive;
    slide.setAttribute("aria-hidden", String(!isActive));
    slide.inert = !isActive;
  });

  galleryPage.textContent = formatIndex(activeSlide);
  galleryPreviousButton.disabled = activeSlide === 0;
  galleryNextButton.disabled = activeSlide === gallerySlides.length - 1;
  galleryPageButtons.forEach((button, buttonIndex) => {
    if (buttonIndex === activeSlide) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

workCards.forEach((card) => {
  const index = Number(card.dataset.workIndex);
  updateCard(card, index);
  card.addEventListener("click", () => openArtwork(index, card));
});

renderArtworkMedia(heroCollage, heroArtwork);
showGallerySlide(0);

galleryPreviousButton.addEventListener("click", () => showGallerySlide(activeSlide - 1));
galleryNextButton.addEventListener("click", () => showGallerySlide(activeSlide + 1));
galleryPageButtons.forEach((button) => {
  button.addEventListener("click", () => showGallerySlide(Number(button.dataset.galleryPageButton)));
});

previousButton.addEventListener("click", () => {
  if (activeIndex > 0) {
    activeIndex -= 1;
    updateDialog();
    closeButton.focus();
  }
});

nextButton.addEventListener("click", () => {
  if (activeIndex < artworkSlots.length - 1) {
    activeIndex += 1;
    updateDialog();
    closeButton.focus();
  }
});

closeButton.addEventListener("click", () => workDialog.close());

workDialog.addEventListener("click", (event) => {
  if (event.target === workDialog) workDialog.close();
});

workDialog.addEventListener("close", () => {
  lastTrigger?.focus();
});

workDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && activeIndex > 0) {
    activeIndex -= 1;
    updateDialog();
  }
  if (event.key === "ArrowRight" && activeIndex < artworkSlots.length - 1) {
    activeIndex += 1;
    updateDialog();
  }
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 701px)").matches) closeMenu();
});

const brushRevealTargets = document.querySelectorAll(
  ".hero-copy, .hero-art, .experience-copy, .experience-art, .section-heading, .gallery-toolbar, .work-card, .gallery-controls, .gallery-footnote, .artist-index, .artist-monogram, .artist-copy, .artist-note, .contact-heading, .contact-card"
);
const supportsBrushReveal =
  "IntersectionObserver" in window &&
  window.CSS?.supports("clip-path", "polygon(0 0, 100% 0, 100% 100%, 0 100%)");

if (supportsBrushReveal && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("has-brush-reveal");

  let workCardIndex = 0;
  brushRevealTargets.forEach((target) => {
    target.classList.add("brush-reveal");

    if (target.matches(".work-card")) {
      target.style.setProperty("--brush-delay", `${workCardIndex * 75}ms`);
      workCardIndex += 1;
    }
  });

  const brushObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-painted");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 10% 0px", threshold: 0.12 }
  );

  brushRevealTargets.forEach((target) => brushObserver.observe(target));
}
