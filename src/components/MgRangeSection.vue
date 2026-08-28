<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

/* =========================================================
   MG RANGE DATA
========================================================= */

const vehicles = [
  {
    id: 1,
    type: "Petrol",
    name: "MG ZS MCE",
    subtitle: "Compact SUV",
    image: "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-ZS-MCE-Model.webp",
    link: "https://mgsrilanka.lk/models/mg-zs-mce/",
    specs: [
      { label: "Engine", value: "1.0T-GDI" },
      { label: "Gearbox", value: "6-Speed Auto" },
      { label: "Power", value: "111 PS" },
    ],
  },
  {
    id: 2,
    type: "Hybrid",
    name: "MG ZS Hybrid+",
    subtitle: "Intelligent Hybrid SUV",
    image: "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-ZS-Hybrid-Model.webp",
    link: "https://mgsrilanka.lk/models/mg-zs-hybrid/",
    specs: [
      { label: "Power", value: "158 kW" },
      { label: "Torque", value: "465 Nm" },
      { label: "Engine", value: "1498 cc" },
    ],
  },
  {
    id: 3,
    type: "Plug-In Hybrid",
    name: "MG HS PHEV",
    subtitle: "Premium Electrified SUV",
    image: "https://mgsrilanka.lk/wp-content/uploads/2026/01/MG-HS-Plug-In-Hybrid-Sterling-Silver.webp",
    link: "https://mgsrilanka.lk/models/mg-hs-plug-in-hybrid/",
    specs: [
      { label: "Combined", value: "307 PS" },
      { label: "EV Range", value: "120 km" },
      { label: "0–100", value: "6.9 sec" },
    ],
  },
  {
    id: 4,
    type: "100% Electric",
    name: "MG S5 EV",
    subtitle: "All-Electric Crossover",
    image: "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-S5-EV-Model.png",
    link: "https://mgsrilanka.lk/models/mg-s5-ev/",
    specs: [
      { label: "Motor", value: "99 kW" },
      { label: "Torque", value: "250 Nm" },
      { label: "Range", value: "< 525 km" },
    ],
  },
  {
    id: 5,
    type: "100% Electric",
    name: "MG4 Electric",
    subtitle: "Electric Performance Hatch",
    image: "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG4-EV-Model.png",
    link: "https://mgsrilanka.lk/models/mg-4-electric/",
    specs: [
      { label: "Motor", value: "125–150 kW" },
      { label: "Range", value: "350–450 km" },
      { label: "Battery", value: "51 / 64 kWh" },
    ],
  },
  {
    id: 6,
    type: "Hybrid",
    name: "MG HS Hybrid+",
    subtitle: "Performance Hybrid SUV",
    image: "https://mgsrilanka.lk/wp-content/uploads/2026/01/MG-HS-Hybrid-Dynamic-Red.webp",
    link: "https://mgsrilanka.lk/models/mg-hs-hybrid/",
    specs: [
      { label: "Motor", value: "165 kW" },
      { label: "Efficiency", value: "5.2 L/100km" },
      { label: "0–100", value: "7.9 sec" },
    ],
  },
];

/* =========================================================
   SLIDER
========================================================= */

const sliderRef = ref(null);
const activeIndex = ref(0);
const canGoPrev = ref(false);
const canGoNext = ref(true);

const cards = () => {
  if (!sliderRef.value) return [];
  return [...sliderRef.value.querySelectorAll(".mg-range-card")];
};

const updateSliderState = () => {
  const slider = sliderRef.value;
  if (!slider) return;

  const allCards = cards();
  if (!allCards.length) return;

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  allCards.forEach((card, index) => {
    const distance = Math.abs(card.offsetLeft - slider.scrollLeft);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  activeIndex.value = nearestIndex;
  canGoPrev.value = slider.scrollLeft > 4;
  canGoNext.value =
    slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 4;
};

const goToSlide = (index) => {
  const slider = sliderRef.value;
  const allCards = cards();

  if (!slider || !allCards.length) return;

  const targetIndex = Math.max(
    0,
    Math.min(index, allCards.length - 1)
  );

  slider.scrollTo({
    left: allCards[targetIndex].offsetLeft,
    behavior: "smooth",
  });
};

const previousVehicle = () => goToSlide(activeIndex.value - 1);
const nextVehicle = () => goToSlide(activeIndex.value + 1);

let scrollTimer;

const onScroll = () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(updateSliderState, 50);
};

const onResize = () => updateSliderState();

onMounted(() => {
  const slider = sliderRef.value;

  slider?.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  requestAnimationFrame(updateSliderState);
});

onBeforeUnmount(() => {
  sliderRef.value?.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  clearTimeout(scrollTimer);
});
</script>

<template>
  <section class="mg-range-section">

    <!-- HEADER -->
    <div class="mg-range-container">
      <div class="mg-range-header">

        <div class="mg-range-heading">
          <span class="mg-range-eyebrow">
            Explore the range
          </span>

          <h2>
            Find the MG that
            <span>moves you.</span>
          </h2>
        </div>

        <div class="mg-range-intro">
          <p>
            From intelligent hybrids to fully electric performance,
            discover an MG designed around the way you want to drive.
          </p>

          <a
            class="mg-range-all"
            href="https://mgsrilanka.lk/models/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View all models</span>

            <span class="mg-range-all-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12h14M14 7l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>

      </div>
    </div>

    <!-- SLIDER -->
    <div class="mg-range-slider-wrap">

      <div
        ref="sliderRef"
        class="mg-range-slider"
        aria-label="MG vehicle range"
      >
        <article
          v-for="(vehicle, index) in vehicles"
          :key="vehicle.id"
          class="mg-range-card"
          :class="{ 'is-active': activeIndex === index }"
        >

          <div class="mg-range-card-top">
            <span class="mg-range-card-type">
              {{ vehicle.type }}
            </span>

            <span class="mg-range-card-number">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
          </div>

          <a
            class="mg-range-card-visual"
            :href="vehicle.link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Explore ${vehicle.name}`"
          >
            <span class="mg-range-car-glow"></span>

            <img
              :src="vehicle.image"
              :alt="vehicle.name"
              loading="lazy"
              draggable="false"
            />
          </a>

          <div class="mg-range-card-content">

            <div class="mg-range-card-title-row">
              <div>
                <span class="mg-range-card-subtitle">
                  {{ vehicle.subtitle }}
                </span>

                <h3>
                  {{ vehicle.name }}
                </h3>
              </div>

              <a
                class="mg-range-card-link"
                :href="vehicle.link"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`View ${vehicle.name}`"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 12h14M14 7l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div class="mg-range-specs">
              <div
                v-for="spec in vehicle.specs"
                :key="spec.label"
                class="mg-range-spec"
              >
                <span>
                  {{ spec.label }}
                </span>

                <strong>
                  {{ spec.value }}
                </strong>
              </div>
            </div>

          </div>
        </article>
      </div>

    </div>

    <!-- FOOTER CONTROLS -->
    <div class="mg-range-container">
      <div class="mg-range-footer">

        <div class="mg-range-arrows">

          <button
            type="button"
            class="mg-range-arrow"
            :disabled="!canGoPrev"
            aria-label="Previous vehicle"
            @click="previousVehicle"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M19 12H5M10 7l-5 5 5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            class="mg-range-arrow"
            :disabled="!canGoNext"
            aria-label="Next vehicle"
            @click="nextVehicle"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12h14M14 7l5 5-5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

        </div>

        <div class="mg-range-progress">

          <div class="mg-range-progress-count">
            <strong>
              {{ String(activeIndex + 1).padStart(2, "0") }}
            </strong>

            <span>/</span>

            <span>
              {{ String(vehicles.length).padStart(2, "0") }}
            </span>
          </div>

          <div class="mg-range-progress-track">
            <span
              class="mg-range-progress-fill"
              :style="{
                width: `${((activeIndex + 1) / vehicles.length) * 100}%`
              }"
            ></span>
          </div>

        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap");

/* =========================================================
   SECTION
========================================================= */

.mg-range-section {
  --mg-red: #e51920;
  --mg-black: #111111;
  --mg-bg: #f7f6f3;
  --mg-card: #efeeeb;

  --page-width: 91%;
  --page-max-width: 1420px;

  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(40px, 3.5vw, 58px) 0 clamp(76px, 6vw, 105px);
  background: var(--mg-bg);
  color: var(--mg-black);
  font-family: "Manrope", sans-serif;
}

.mg-range-container,
.mg-range-slider-wrap {
  width: min(var(--page-width), var(--page-max-width));
  margin: 0 auto;
  box-sizing: border-box;
}

/* =========================================================
   HEADER
========================================================= */

.mg-range-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 370px);
  align-items: end;
  gap: clamp(50px, 7vw, 120px);
  margin-bottom: clamp(40px, 4vw, 62px);
}

.mg-range-eyebrow {
  display: block;
  margin-bottom: 11px;
  font-family: "Manrope", sans-serif;
  font-size: 0.6vw;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.19em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.38);
}

.mg-range-heading h2 {
  max-width: 660px;
  margin: 0;
  font-family: "Manrope", sans-serif;
  font-size: 2.5vw;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: #111;
}

.mg-range-heading h2 span {
  color: inherit;
}

.mg-range-intro {
  padding-bottom: 4px;
}

.mg-range-intro p {
  max-width: 330px;
  margin: 0 0 20px;
  font-family: "Manrope", sans-serif;
  font-size: 0.72vw;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.48);
}

.mg-range-all {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 12px;


  color: #111111 !important;

  text-decoration: none !important;
  font-family: "Manrope", sans-serif;
  font-size: 0.625vw;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.mg-range-all-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--mg-red);
  color: #fff;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s ease;
}

.mg-range-all-icon svg {
  width: 13px;
}

.mg-range-all:hover .mg-range-all-icon {
  transform: translateX(3px);
  background: #111;
}

/* =========================================================
   SLIDER
========================================================= */

.mg-range-slider {
  display: flex;
  align-items: stretch;
  gap: clamp(12px, 1.15vw, 18px);
  overflow-x: auto;
  overflow-y: hidden;

  /* allows partial next card */
  padding: 0 8vw 12px 0;

  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mg-range-slider::-webkit-scrollbar {
  display: none;
}

/* =========================================================
   CARD
========================================================= */

.mg-range-card {
  position: relative;
  flex: 0 0 clamp(310px, 28vw, 410px);
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  padding: 18px 18px 17px;
  scroll-snap-align: start;
  border-radius: 18px;
  background: var(--mg-card);

  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.4s ease,
    box-shadow 0.45s ease;
}

.mg-range-card:hover,
.mg-range-card.is-active {
  background: #fff;
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.055);
}

.mg-range-card:hover {
  transform: translateY(-4px);
}

/* =========================================================
   CARD TOP
========================================================= */

.mg-range-card-top {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.mg-range-card-type,
.mg-range-card-number {
  font-family: "Manrope", sans-serif;
  font-size: 0.58vw;
  font-weight: 700;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

.mg-range-card-type {
  color: var(--mg-red);
}

.mg-range-card-number {
  color: rgba(0, 0, 0, 0.28);
}

/* =========================================================
   CAR VISUAL
========================================================= */

.mg-range-card-visual {
  position: relative;
  height: clamp(205px, 17vw, 270px);
  margin: 2px -4px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  text-decoration: none;
}

.mg-range-car-glow {
  position: absolute;
  left: 50%;
  top: 52%;
  z-index: -1;
  width: 72%;
  height: 42%;
  border-radius: 50%;
  opacity: 0;

  background:
    radial-gradient(
      ellipse at center,
      rgba(229, 25, 32, 0.08) 0%,
      rgba(229, 25, 32, 0) 72%
    );

  transform: translate(-50%, -50%) scale(0.82);

  transition:
    opacity 0.55s ease,
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.mg-range-card:hover .mg-range-car-glow,
.mg-range-card.is-active .mg-range-car-glow {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.mg-range-card-visual img {
  display: block;
  width: 96%;
  max-width: 400px;
  height: 86%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;

  filter: drop-shadow(0 22px 18px rgba(0, 0, 0, 0.12));

  transform: translateY(4px) scale(0.96);

  transition:
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.5s ease;
}

.mg-range-card:hover .mg-range-card-visual img,
.mg-range-card.is-active .mg-range-card-visual img {
  transform: translateY(-2px) scale(1.02);
  filter: drop-shadow(0 25px 21px rgba(0, 0, 0, 0.145));
}

/* =========================================================
   CARD CONTENT
========================================================= */

.mg-range-card-content {
  position: relative;
  z-index: 5;
}

.mg-range-card-title-row {
  min-height: 57px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.mg-range-card-subtitle {
  display: block;
  margin-bottom: 5px;
  font-family: "Manrope", sans-serif;
  font-size: 0.58vw;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: rgba(0, 0, 0, 0.4);
}

.mg-range-card-title-row h3 {
  margin: 0;
  font-family: "Manrope", sans-serif;
  font-size: 1.55vw;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: #111;
}

.mg-range-card-link {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(17, 17, 17, 0.065);
  color: #111;
  text-decoration: none;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.mg-range-card-link svg {
  width: 14px;
}

.mg-range-card:hover .mg-range-card-link {
  background: var(--mg-red);
  color: #fff;
  transform: translateX(2px);
}

/* =========================================================
   SPECS
========================================================= */

.mg-range-specs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.075);
}

.mg-range-spec {
  min-width: 0;
  padding: 0 12px;
  border-right: 1px solid rgba(0, 0, 0, 0.065);
}

.mg-range-spec:first-child {
  padding-left: 0;
}

.mg-range-spec:last-child {
  padding-right: 0;
  border-right: 0;
}

.mg-range-spec span,
.mg-range-spec strong {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "Manrope", sans-serif;
}

.mg-range-spec span {
  margin-bottom: 4px;
  font-size: 0.50vw;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.32);
}

.mg-range-spec strong {
  font-size: 0.68vw;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.73);
}

/* =========================================================
   FOOTER / CONTROLS
========================================================= */

.mg-range-footer {
  margin-top: clamp(28px, 3vw, 42px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.mg-range-arrows {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mg-range-arrow {
  width: 39px;
  height: 39px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #111;
  cursor: pointer;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease,
    opacity 0.3s ease;
}

.mg-range-arrow svg {
  width: 16px;
}

.mg-range-arrow:hover:not(:disabled) {
  background: #111;
  color: #fff;
  transform: translateY(-1px);
}

.mg-range-arrow:disabled {
  opacity: 0.22;
  cursor: default;
}

.mg-range-progress {
  width: clamp(150px, 14vw, 210px);
  display: flex;
  align-items: center;
  gap: 13px;
}

.mg-range-progress-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
  font-family: "Manrope", sans-serif;
  font-size: 0.58vw;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.34);
}

.mg-range-progress-count strong {
  font-size: 0.625vw;
  font-weight: 700;
  color: #111;
}

.mg-range-progress-track {
  position: relative;
  flex: 1;
  height: 1px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.12);
}

.mg-range-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--mg-red);

  transition:
    width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

/* =========================================================
   LARGE SCREEN CARD TYPOGRAPHY
========================================================= */

@media (min-width: 1440px) {
  .mg-range-card-type,
  .mg-range-card-number,
  .mg-range-card-subtitle {
    font-size: clamp(10px, 0.62vw, 12px);
  }

  .mg-range-card-title-row h3 {
    font-size: clamp(24px, 1.55vw, 30px);
  }

  .mg-range-spec span {
    font-size: clamp(9px, 0.52vw, 11px);
  }

  .mg-range-spec strong {
    font-size: clamp(11px, 0.72vw, 14px);
  }
}


/* =========================================================
   LARGE SCREENS
========================================================= */



/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1050px) {
  .mg-range-header {
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 45px;
  }

  .mg-range-card {
    flex-basis: min(380px, 45vw);
  }

  .mg-range-card-visual {
    height: 230px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .mg-range-section {
    --page-width: calc(100% - 30px);
    --page-max-width: none;
    padding: 40px 0 70px;
  }

  .mg-range-header {
    display: block;
    margin-bottom: 34px;
  }

  .mg-range-heading h2 {
    max-width: 330px;
    font-size: 29px;
    line-height: 1.08;
  }

  .mg-range-intro {
    margin-top: 23px;
    padding-bottom: 0;
  }

  .mg-range-intro p {
    max-width: 330px;
    margin-bottom: 17px;
    font-size: 10px;
  }

  .mg-range-all {
    font-size: 8px;
  }

  .mg-range-all-icon {
    width: 29px;
    height: 29px;
  }

  .mg-range-slider {
    gap: 11px;
    padding: 0 15vw 10px 0;
  }

  .mg-range-card {
    flex-basis: min(82vw, 340px);
    padding: 15px 15px 16px;
    border-radius: 16px;
  }

  .mg-range-card:hover {
    transform: none;
  }

  .mg-range-card-visual {
    height: 205px;
    margin-top: 0;
  }

  .mg-range-card-visual img {
    width: 100%;
    height: 84%;
  }

  .mg-range-card-title-row {
    min-height: 53px;
  }

  .mg-range-card-title-row h3 {
    font-size: 22px;
  }

  .mg-range-card-subtitle {
    font-size: 9px;
  }

  .mg-range-specs {
    margin-top: 16px;
    padding-top: 13px;
  }

  .mg-range-spec {
    padding: 0 8px;
  }

  .mg-range-spec span {
    font-size: 9px;
  }

  .mg-range-spec strong {
    font-size: 7px;
  }

  .mg-range-footer {
    margin-top: 23px;
  }

  .mg-range-arrow {
    width: 36px;
    height: 36px;
  }

  .mg-range-progress {
    width: 135px;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 420px) {
  .mg-range-heading h2 {
    font-size: 27px;
  }

  .mg-range-card {
    flex-basis: 84vw;
  }

  .mg-range-card-visual {
    height: 190px;
  }

  .mg-range-card-link {
    width: 31px;
    height: 31px;
    flex-basis: 31px;
  }

  .mg-range-progress {
    width: 120px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-range-slider {
    scroll-behavior: auto;
  }

  .mg-range-card,
  .mg-range-card-visual img,
  .mg-range-car-glow,
  .mg-range-card-link,
  .mg-range-all-icon,
  .mg-range-arrow,
  .mg-range-progress-fill {
    transition-duration: 0.01ms !important;
  }
}
</style>
