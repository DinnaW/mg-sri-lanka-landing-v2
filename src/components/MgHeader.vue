<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

const props = defineProps({
  testDriveLink: {
    type: String,
    default: "#",
  },
  dealerLink: {
    type: String,
    default: "#showroom",
  },
});

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const homeHref = import.meta.env.BASE_URL;

const activeMega = ref(null);
const activeCategory = ref("all");
const mobileOpen = ref(false);
const mobileVehiclesOpen = ref(true);
const isScrolled = ref(false);

let closeTimer = null;
let previousOverflow = "";
let scrollFrame = null;

const categories = [
  { id: "all", label: "All models" },
  { id: "electric", label: "Electric" },
  { id: "hybrid", label: "Hybrid" },
  { id: "phev", label: "Plug-in Hybrid" },
  { id: "petrol", label: "Petrol" },
];

const vehicles = [
  {
    id: "mg-zs",
    name: "MG ZS",
    type: "Petrol SUV",
    category: "petrol",
    image: asset("images/123.png"),
    href: "#mg-range",
    badge: "SUV",
  },
  {
    id: "mg4-ev",
    name: "MG4 Electric",
    type: "100% Electric",
    category: "electric",
    image: asset("images/234.png"),
    href: "#mg-range",
    badge: "EV",
  },
  {
    id: "mg-s5-ev",
    name: "MG S5 EV",
    type: "100% Electric SUV",
    category: "electric",
    image: asset("images/345.png"),
    href: "#mg-range",
    badge: "NEW",
  },
  {
    id: "mg-hs-phev",
    name: "MG HS PHEV",
    type: "Plug-in Hybrid SUV",
    category: "phev",
    image: asset("images/567.png"),
    href: "#mg-range",
    badge: "PHEV",
  },
  {
    id: "mg-zs-hybrid",
    name: "MG ZS Hybrid+",
    type: "Hybrid SUV",
    category: "hybrid",
    image: asset("images/456.png"),
    href: "#mg-range",
    badge: "HYBRID+",
  },
];

const filteredVehicles = computed(() => {
  if (activeCategory.value === "all") return vehicles;

  return vehicles.filter(
    (vehicle) => vehicle.category === activeCategory.value
  );
});

const headerIsLight = computed(
  () => activeMega.value === "vehicles" || mobileOpen.value
);

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const openVehicles = () => {
  clearCloseTimer();
  activeMega.value = "vehicles";
};

const toggleVehicles = () => {
  clearCloseTimer();
  activeMega.value =
    activeMega.value === "vehicles" ? null : "vehicles";
};

const closeMega = () => {
  clearCloseTimer();
  activeMega.value = null;
};

const scheduleClose = () => {
  clearCloseTimer();
  closeTimer = window.setTimeout(() => {
    activeMega.value = null;
  }, 170);
};

const closeForNavigation = () => {
  closeMega();
  mobileOpen.value = false;
};

const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value;
};

const handleScroll = () => {
  if (scrollFrame) return;

  scrollFrame = window.requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 24;
    scrollFrame = null;
  });
};

const handleKeyDown = (event) => {
  if (event.key !== "Escape") return;

  closeMega();
  mobileOpen.value = false;
};

watch(mobileOpen, (open) => {
  if (typeof document === "undefined") return;

  if (open) {
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    activeMega.value = null;
  } else {
    document.documentElement.style.overflow = previousOverflow;
  }
});

onMounted(() => {
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  clearCloseTimer();
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeyDown);

  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  }

  if (typeof document !== "undefined") {
    document.documentElement.style.overflow = previousOverflow;
  }
});
</script>

<template>
  <header
    class="mg-header"
    :class="{
      'mg-header--light': headerIsLight,
      'mg-header--mega-open': activeMega === 'vehicles',
      'mg-header--mobile-open': mobileOpen,
      'mg-header--scrolled': isScrolled,
    }"
    @mouseleave="scheduleClose"
  >
    <!-- DESKTOP / MAIN BAR -->
    <div class="mg-header__bar">
      <div class="mg-header__inner">
        <a :href="homeHref" class="mg-header__brand" aria-label="MG home">
          <img
            :src="asset('images/logo.png')"
            alt="MG"
            class="mg-header__brand-logo"
          />

          <span class="mg-header__brand-copy">
            <strong>MG</strong>
            <small>SRI LANKA</small>
          </span>
        </a>

        <nav class="mg-header__nav" aria-label="Primary navigation">
          <button
            type="button"
            class="mg-header__nav-link mg-header__nav-link--vehicles"
            :class="{ 'is-active': activeMega === 'vehicles' }"
            :aria-expanded="activeMega === 'vehicles'"
            aria-controls="mg-vehicles-menu"
            @mouseenter="openVehicles"
            @focus="openVehicles"
            @click="toggleVehicles"
          >
            <span>Vehicles</span>

            <svg viewBox="0 0 12 8" aria-hidden="true">
              <path d="m1 1 5 5 5-5" />
            </svg>
          </button>

          <a href="#offers" class="mg-header__nav-link" @mouseenter="closeMega">
            Offers
          </a>

          <a href="#discover" class="mg-header__nav-link" @mouseenter="closeMega">
            Discover
          </a>

          <a href="#owners" class="mg-header__nav-link" @mouseenter="closeMega">
            Owners
          </a>
        </nav>

        <div class="mg-header__actions">
          <a
            :href="props.dealerLink"
            class="mg-header__dealer"
            @mouseenter="closeMega"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"
              />
              <circle cx="12" cy="10" r="2" />
            </svg>

            <span>Find a dealer</span>
          </a>

          <a :href="props.testDriveLink" class="mg-header__testdrive">
            <span>Test Drive</span>

            <span class="mg-header__testdrive-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M14 7l5 5-5 5" />
              </svg>
            </span>
          </a>

          <button
            type="button"
            class="mg-header__menu-button"
            :aria-expanded="mobileOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobile"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- VEHICLE MEGA MENU -->
    <Transition name="mg-mega">
      <section
        v-if="activeMega === 'vehicles'"
        id="mg-vehicles-menu"
        class="mg-mega"
        aria-label="MG vehicles"
        @mouseenter="clearCloseTimer"
      >
        <div class="mg-mega__inner">
          <aside class="mg-mega__filters">
            <div class="mg-mega__filters-intro">
              <span>OUR RANGE</span>
              <strong>Find your MG.</strong>
            </div>

            <div class="mg-mega__filter-list">
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                :class="{ 'is-active': activeCategory === category.id }"
                @click="activeCategory = category.id"
              >
                <span>{{ category.label }}</span>
                <i></i>
              </button>
            </div>

            <a href="#mg-range" class="mg-mega__all-link" @click="closeMega">
              <span>View all models</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M14 7l5 5-5 5" />
              </svg>
            </a>
          </aside>

          <div class="mg-mega__content">
            <div class="mg-mega__topline">
              <div>
                <span>MG MODELS</span>
                <strong>{{ filteredVehicles.length }} vehicles</strong>
              </div>

              <button type="button" class="mg-mega__close" @click="closeMega">
                <span>Close</span>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 4l12 12M16 4 4 16" />
                </svg>
              </button>
            </div>

            <TransitionGroup name="vehicle-grid" tag="div" class="mg-mega__grid">
              <a
                v-for="vehicle in filteredVehicles"
                :key="vehicle.id"
                :href="vehicle.href"
                class="mg-model-card"
                @click="closeMega"
              >
                <div class="mg-model-card__visual">
                  <span class="mg-model-card__badge">
                    {{ vehicle.badge }}
                  </span>

                  <img :src="vehicle.image" :alt="vehicle.name" />

                  <span class="mg-model-card__explore">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M14 7l5 5-5 5" />
                    </svg>
                  </span>
                </div>

                <div class="mg-model-card__copy">
                  <strong>{{ vehicle.name }}</strong>
                  <span>{{ vehicle.type }}</span>
                </div>
              </a>
            </TransitionGroup>

            <div class="mg-mega__footer">
              <span>
                Electric · Hybrid · Plug-in Hybrid · Petrol
              </span>

              <span>Built for every kind of drive.</span>
            </div>
          </div>
        </div>
      </section>
    </Transition>

    <Transition name="mg-backdrop">
      <button
        v-if="activeMega === 'vehicles'"
        type="button"
        class="mg-header__backdrop"
        aria-label="Close vehicle menu"
        @click="closeMega"
      ></button>
    </Transition>

    <!-- MOBILE DRAWER -->
    <Transition name="mg-mobile-drawer">
      <div v-if="mobileOpen" class="mg-mobile-nav">
        <div class="mg-mobile-nav__inner">
          <div class="mg-mobile-nav__links">
            <button
              type="button"
              class="mg-mobile-nav__primary"
              :class="{ 'is-open': mobileVehiclesOpen }"
              @click="mobileVehiclesOpen = !mobileVehiclesOpen"
            >
              <span>Vehicles</span>
              <svg viewBox="0 0 12 8" aria-hidden="true">
                <path d="m1 1 5 5 5-5" />
              </svg>
            </button>

            <Transition name="mobile-vehicles">
              <div v-if="mobileVehiclesOpen" class="mg-mobile-vehicles">
                <div class="mg-mobile-vehicles__filters">
                  <button
                    v-for="category in categories"
                    :key="`mobile-${category.id}`"
                    type="button"
                    :class="{ 'is-active': activeCategory === category.id }"
                    @click="activeCategory = category.id"
                  >
                    {{ category.label }}
                  </button>
                </div>

                <div class="mg-mobile-vehicles__track">
                  <a
                    v-for="vehicle in filteredVehicles"
                    :key="`mobile-card-${vehicle.id}`"
                    :href="vehicle.href"
                    class="mg-mobile-model"
                    @click="closeForNavigation"
                  >
                    <div class="mg-mobile-model__visual">
                      <span>{{ vehicle.badge }}</span>
                      <img :src="vehicle.image" :alt="vehicle.name" />
                    </div>

                    <strong>{{ vehicle.name }}</strong>
                    <small>{{ vehicle.type }}</small>
                  </a>
                </div>
              </div>
            </Transition>

            <a href="#offers" @click="closeForNavigation">Offers</a>
            <a href="#discover" @click="closeForNavigation">Discover</a>
            <a href="#owners" @click="closeForNavigation">Owners</a>
          </div>

          <div class="mg-mobile-nav__bottom">
            <a :href="props.dealerLink" @click="closeForNavigation">
              Find a dealer
            </a>

            <a
              :href="props.testDriveLink"
              class="mg-mobile-nav__testdrive"
              @click="closeForNavigation"
            >
              <span>Book a test drive</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap");

.mg-header {
  --red: #e51920;
  --ink: #111111;
  --paper: #f7f7f4;
  --header-height: 5.15vw;

  position: fixed;
  inset: 0 0 auto;
  z-index: 220;
  width: 100%;
  color: #fff;
  font-family: "Manrope", sans-serif;
}

.mg-header__bar {
  position: relative;
  z-index: 230;
  transition:
    background .35s ease,
    color .35s ease,
    border-color .35s ease,
    box-shadow .35s ease;
}

.mg-header__bar::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, .42) 0%,
    rgba(0, 0, 0, .16) 58%,
    transparent 100%
  );
  transition: opacity .3s ease;
}

.mg-header--scrolled:not(.mg-header--light) .mg-header__bar {
  background: rgba(7, 7, 7, .84);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, .09);
  box-shadow: 0 .55vw 2.2vw rgba(0, 0, 0, .16);
  backdrop-filter: blur(1.25vw) saturate(1.15);
  -webkit-backdrop-filter: blur(1.25vw) saturate(1.15);
}

.mg-header--scrolled:not(.mg-header--light) .mg-header__bar::before {
  opacity: 0;
}

.mg-header--light .mg-header__bar {
  background: rgba(247, 247, 244, .985);
  color: var(--ink);
  border-bottom: 1px solid rgba(17, 17, 17, .08);
  box-shadow: 0 .5vw 2vw rgba(0, 0, 0, .025);
}

.mg-header--light .mg-header__bar::before {
  opacity: 0;
}

.mg-header__inner {
  width: 92vw;
  height: var(--header-height);
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 3.2vw;
}

/* BRAND */

.mg-header__brand {
  display: inline-flex;
  align-items: center;
  gap: .68vw;
  color: inherit;
  text-decoration: none;
}

.mg-header__brand-logo {
  display: block;
  width: clamp(48px, 3.25vw, 66px);
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.mg-header__brand-copy {
  display: flex;
  flex-direction: column;
  gap: .08vw;
}

.mg-header__brand-copy strong {
  font-size: clamp(14px, .90vw, 18px);
  font-weight: 700;
  letter-spacing: .12em;
}

.mg-header__brand-copy small {
  opacity: .48;
  font-size: clamp(11px, .68vw, 13px);
  font-weight: 700;
  letter-spacing: .17em;
}

/* NAV */

.mg-header__nav {
  justify-self: center;
  display: flex;
  align-items: stretch;
  height: 100%;
  gap: 2.15vw;
}

.mg-header__nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: .38vw;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, .88);
  text-decoration: none;
  font-family: "Manrope", sans-serif;
  font-size: clamp(15px, .96vw, 19px);
  font-weight: 600;
  letter-spacing: .035em;
  cursor: pointer;
  transition: color .25s ease;
}

.mg-header--light .mg-header__nav-link {
  color: rgba(17, 17, 17, .7);
}

.mg-header__nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: .88vw;
  width: 0;
  height: 1px;
  transform: translateX(-50%);
  background: currentColor;
  transition: width .35s cubic-bezier(.16, 1, .3, 1);
}

.mg-header__nav-link:hover,
.mg-header__nav-link.is-active {
  color: #fff;
}

.mg-header--light .mg-header__nav-link:hover,
.mg-header--light .mg-header__nav-link.is-active {
  color: #111;
}

.mg-header__nav-link:hover::after,
.mg-header__nav-link.is-active::after {
  width: 100%;
}

.mg-header__nav-link svg {
  width: .54vw;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.3;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform .3s ease;
}

.mg-header__nav-link.is-active svg {
  transform: rotate(180deg);
}

/* ACTIONS */

.mg-header__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 1.05vw;
}

.mg-header__dealer {
  display: inline-flex;
  align-items: center;
  gap: .42vw;
  color: rgba(255, 255, 255, .82);
  text-decoration: none;
  font-size: clamp(12px, .78vw, 15px);
  font-weight: 700;
  letter-spacing: .11em;
  text-transform: uppercase;
}

.mg-header--light .mg-header__dealer {
  color: rgba(17, 17, 17, .64);
}

.mg-header__dealer svg {
  width: .83vw;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.45;
}

.mg-header__testdrive {
  height: 2.72vw;
  display: inline-flex;
  align-items: center;
  gap: .72vw;
  padding: .2vw .22vw .2vw .88vw;
  border-radius: 99vw;
  background: #fff;
  color: #111;
  text-decoration: none;
  font-size: clamp(13px, .84vw, 17px);
  font-weight: 700;
  letter-spacing: .105em;
  text-transform: uppercase;
  box-shadow: 0 .4vw 1.4vw rgba(0, 0, 0, .08);
  transition: transform .3s ease, background .3s ease, color .3s ease;
}

.mg-header--light .mg-header__testdrive {
  background: #111;
  color: #fff;
}

.mg-header__testdrive:hover {
  transform: translateY(-.1vw);
}

.mg-header__testdrive-icon {
  width: 2.28vw;
  height: 2.28vw;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #111;
  color: #fff;
  transition: background .3s ease, transform .3s ease;
}

.mg-header--light .mg-header__testdrive-icon {
  background: var(--red);
}

.mg-header__testdrive:hover .mg-header__testdrive-icon {
  background: var(--red);
  transform: translateX(.08vw);
}

.mg-header__testdrive-icon svg {
  width: .86vw;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mg-header__menu-button {
  display: none;
}

/* MEGA MENU */

.mg-mega {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 210;
  min-height: 39.5vw;
  padding: calc(var(--header-height) + 2.2vw) 0 2.25vw;
  box-sizing: border-box;
  background: rgba(247, 247, 244, .995);
  color: var(--ink);
  border-bottom: 1px solid rgba(17, 17, 17, .08);
  box-shadow: 0 2vw 5vw rgba(0, 0, 0, .12);
}

.mg-mega__inner {
  width: 92vw;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 12vw minmax(0, 1fr);
  gap: 2.8vw;
}

.mg-mega__filters {
  min-height: 29vw;
  display: flex;
  flex-direction: column;
  padding-right: 1.6vw;
  border-right: 1px solid rgba(17, 17, 17, .08);
}

.mg-mega__filters-intro > span,
.mg-mega__topline > div > span {
  display: block;
  color: rgba(17, 17, 17, .38);
  font-size: clamp(11px, .68vw, 13px);
  font-weight: 700;
  letter-spacing: .17em;
}

.mg-mega__filters-intro strong {
  display: block;
  margin-top: .55vw;
  font-size: clamp(27px, 1.72vw, 34px);
  font-weight: 500;
  letter-spacing: -.04em;
}

.mg-mega__filter-list {
  display: flex;
  flex-direction: column;
  gap: .15vw;
  margin-top: 1.7vw;
}

.mg-mega__filter-list button {
  position: relative;
  width: 100%;
  min-height: 2.25vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(17, 17, 17, .46);
  text-align: left;
  font-family: "Manrope", sans-serif;
  font-size: clamp(13px, .84vw, 17px);
  font-weight: 600;
  cursor: pointer;
  transition: color .25s ease, transform .25s ease;
}

.mg-mega__filter-list button:hover,
.mg-mega__filter-list button.is-active {
  color: #111;
  transform: translateX(.16vw);
}

.mg-mega__filter-list button i {
  width: .32vw;
  height: .32vw;
  border-radius: 50%;
  background: transparent;
  transition: background .25s ease, box-shadow .25s ease;
}

.mg-mega__filter-list button.is-active i {
  background: var(--red);
  box-shadow: 0 0 .6vw rgba(229, 25, 32, .35);
}

.mg-mega__all-link {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: .7vw;
  color: #111;
  text-decoration: none;
  font-size: clamp(13px, .82vw, 17px);
  font-weight: 700;
}

.mg-mega__all-link svg {
  width: .85vw;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.45;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mg-mega__content {
  min-width: 0;
}

.mg-mega__topline {
  height: 2.35vw;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.mg-mega__topline > div strong {
  display: block;
  margin-top: .22vw;
  font-size: clamp(12px, .76vw, 15px);
  font-weight: 600;
}

.mg-mega__close {
  display: inline-flex;
  align-items: center;
  gap: .48vw;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(17, 17, 17, .48);
  font-family: "Manrope", sans-serif;
  font-size: clamp(11px, .68vw, 13px);
  font-weight: 650;
  cursor: pointer;
}

.mg-mega__close svg {
  width: .8vw;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.35;
  stroke-linecap: round;
}

.mg-mega__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.3vw 1.35vw;
}

.mg-model-card {
  min-width: 0;
  color: #111;
  text-decoration: none;
}

.mg-model-card__visual {
  position: relative;
  height: 10.3vw;
  overflow: hidden;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 78%, rgba(0, 0, 0, .065), transparent 36%),
    #eeeeeb;
  transition: background .35s ease, transform .35s cubic-bezier(.16, 1, .3, 1);
}

.mg-model-card:hover .mg-model-card__visual {
  background:
    radial-gradient(circle at 50% 78%, rgba(0, 0, 0, .09), transparent 38%),
    #e9e9e5;
  transform: translateY(-.12vw);
}

.mg-model-card__visual::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 1.35vw;
  width: 46%;
  height: .48vw;
  transform: translateX(-50%);
  border-radius: 50%;
  background: rgba(0, 0, 0, .14);
  filter: blur(.52vw);
  opacity: .55;
}

.mg-model-card__visual img {
  position: relative;
  z-index: 2;
  width: 85%;
  height: 78%;
  object-fit: contain;
  transform: translateY(.12vw) scale(.98);
  transition: transform .55s cubic-bezier(.16, 1, .3, 1);
}

.mg-model-card:hover .mg-model-card__visual img {
  transform: translateY(-.08vw) scale(1.035);
}

.mg-model-card__badge {
  position: absolute;
  left: .75vw;
  top: .68vw;
  z-index: 5;
  padding: .26vw .42vw;
  border-radius: 99vw;
  background: rgba(255, 255, 255, .74);
  color: rgba(17, 17, 17, .58);
  backdrop-filter: blur(.5vw);
  font-size: clamp(10px, .60vw, 12px);
  font-weight: 750;
  letter-spacing: .11em;
}

.mg-model-card__explore {
  position: absolute;
  right: .7vw;
  bottom: .7vw;
  z-index: 5;
  width: 1.75vw;
  height: 1.75vw;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #111;
  color: #fff;
  opacity: 0;
  transform: translateY(.35vw);
  transition: opacity .3s ease, transform .3s ease, background .3s ease;
}

.mg-model-card:hover .mg-model-card__explore {
  opacity: 1;
  transform: translateY(0);
}

.mg-model-card__explore:hover {
  background: var(--red);
}

.mg-model-card__explore svg {
  width: .78vw;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mg-model-card__copy {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: .8vw;
  padding: .72vw .08vw 0;
}

.mg-model-card__copy strong {
  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(25px, 1.58vw, 32px);
  font-weight: 600;
  letter-spacing: -.02em;
  text-transform: uppercase;
}

.mg-model-card__copy span {
  color: rgba(17, 17, 17, .42);
  font-size: clamp(11px, .70vw, 14px);
  font-weight: 550;
  white-space: nowrap;
}

.mg-mega__footer {
  display: flex;
  justify-content: space-between;
  gap: 1vw;
  margin-top: 1.25vw;
  padding-top: .95vw;
  border-top: 1px solid rgba(17, 17, 17, .08);
  color: rgba(17, 17, 17, .34);
  font-size: clamp(10px, .60vw, 12px);
  font-weight: 600;
  letter-spacing: .05em;
}

/* BACKDROP */

.mg-header__backdrop {
  position: fixed;
  inset: 0;
  z-index: 190;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: rgba(0, 0, 0, .38);
  backdrop-filter: blur(.12vw);
  cursor: default;
}

/* TRANSITIONS */

.mg-mega-enter-active,
.mg-mega-leave-active {
  transition:
    opacity .38s ease,
    clip-path .52s cubic-bezier(.16, 1, .3, 1),
    transform .52s cubic-bezier(.16, 1, .3, 1);
  transform-origin: top;
}

.mg-mega-enter-from,
.mg-mega-leave-to {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
  transform: translateY(-.55vw);
}

.mg-mega-enter-to,
.mg-mega-leave-from {
  clip-path: inset(0 0 0 0);
}

.mg-backdrop-enter-active,
.mg-backdrop-leave-active {
  transition: opacity .35s ease;
}

.mg-backdrop-enter-from,
.mg-backdrop-leave-to {
  opacity: 0;
}

.vehicle-grid-enter-active,
.vehicle-grid-leave-active {
  transition: opacity .28s ease, transform .35s cubic-bezier(.16, 1, .3, 1);
}

.vehicle-grid-enter-from,
.vehicle-grid-leave-to {
  opacity: 0;
  transform: translateY(.45vw);
}

.vehicle-grid-leave-active {
  position: absolute;
}

/* MOBILE DRAWER */

.mg-mobile-nav {
  display: none;
}

@media (max-width: 1000px) {
  .mg-header {
    --header-height: 6.5vw;
  }

  .mg-header__inner {
    width: calc(100% - 4vw);
    gap: 2vw;
  }

  .mg-header__brand-logo {
    width: clamp(46px, 4vw, 58px);
  }

  .mg-header__brand-copy strong {
    font-size: clamp(12px, 1.15vw, 14px);
  }

  .mg-header__brand-copy small {
    font-size: clamp(11px, .68vw, 13px);
  }

  .mg-header__nav {
    gap: 2vw;
  }

  .mg-header__nav-link {
    font-size: clamp(13px, 1.05vw, 15px);
  }

  .mg-header__dealer {
    display: none;
  }

  .mg-header__testdrive {
    height: 3.1vw;
    font-size: clamp(11px, .90vw, 14px);
  }

  .mg-header__testdrive-icon {
    width: 2.55vw;
    height: 2.55vw;
  }

  .mg-mega {
    min-height: 49vw;
    padding-top: calc(var(--header-height) + 2.5vw);
  }

  .mg-mega__inner {
    width: 94vw;
    grid-template-columns: 15vw minmax(0, 1fr);
  }

  .mg-mega__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mg-model-card__visual {
    height: 13vw;
  }

  .mg-model-card__copy strong {
    font-size: clamp(20px, 1.75vw, 25px);
  }

  .mg-model-card__copy span,
  .mg-mega__filter-list button,
  .mg-mega__all-link {
    font-size: clamp(11px, .90vw, 14px);
  }
}

@media (max-width: 767px) {
  .mg-header {
    --header-height: 16vw;
  }

  .mg-header__bar {
    transition: background .25s ease, color .25s ease;
  }

  .mg-header--scrolled:not(.mg-header--mobile-open) .mg-header__bar {
    background: rgba(7, 7, 7, .88);
    border-bottom: 1px solid rgba(255, 255, 255, .08);
    box-shadow: 0 8px 26px rgba(0, 0, 0, .15);
    backdrop-filter: blur(16px) saturate(1.12);
    -webkit-backdrop-filter: blur(16px) saturate(1.12);
  }

  .mg-header--mobile-open .mg-header__bar {
    position: fixed;
    inset: 0 0 auto;
    background: #f7f7f4;
    color: #111;
    border-bottom: 1px solid rgba(17, 17, 17, .08);
  }

  .mg-header--mobile-open .mg-header__bar::before {
    opacity: 0;
  }

  .mg-header__inner {
    width: calc(100% - 30px);
    grid-template-columns: auto 1fr;
    gap: 15px;
  }

  .mg-header__brand {
    gap: 8px;
  }

  .mg-header__brand-logo {
    width: 44px;
  }

  .mg-header__brand-copy strong {
    font-size: 2.15vw;
  }

  .mg-header__brand-copy small {
    font-size: 1.35vw;
  }

  .mg-header__nav,
  .mg-header__dealer {
    display: none;
  }

  .mg-header__actions {
    gap: 8px;
  }

  .mg-header__testdrive {
    display: none;
  }

  .mg-header__menu-button {
    position: relative;
    display: block;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, .22);
    border-radius: 50%;
    background: rgba(255, 255, 255, .06);
    color: currentColor;
    cursor: pointer;
  }

  .mg-header--mobile-open .mg-header__menu-button {
    border-color: rgba(17, 17, 17, .12);
    background: rgba(17, 17, 17, .035);
  }

  .mg-header__menu-button span {
    position: absolute;
    left: 50%;
    width: 15px;
    height: 1px;
    background: currentColor;
    transform: translateX(-50%);
    transition: transform .3s ease, top .3s ease;
  }

  .mg-header__menu-button span:first-child {
    top: 15px;
  }

  .mg-header__menu-button span:last-child {
    top: 21px;
  }

  .mg-header--mobile-open .mg-header__menu-button span:first-child {
    top: 18px;
    transform: translateX(-50%) rotate(45deg);
  }

  .mg-header--mobile-open .mg-header__menu-button span:last-child {
    top: 18px;
    transform: translateX(-50%) rotate(-45deg);
  }

  .mg-mega,
  .mg-header__backdrop {
    display: none;
  }

  .mg-mobile-nav {
    position: fixed;
    inset: 0;
    z-index: 215;
    display: block;
    overflow-y: auto;
    background: #f7f7f4;
    color: #111;
    overscroll-behavior: contain;
  }

  .mg-mobile-nav__inner {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 22vw 15px 6vw;
  }

  .mg-mobile-nav__links {
    display: flex;
    flex-direction: column;
  }

  .mg-mobile-nav__links > a,
  .mg-mobile-nav__primary {
    min-height: 14vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    border: 0;
    border-bottom: 1px solid rgba(17, 17, 17, .09);
    background: transparent;
    color: #111;
    text-decoration: none;
    text-align: left;
    font-family: "Manrope", sans-serif;
    font-size: 5.2vw;
    font-weight: 500;
    letter-spacing: -.045em;
    cursor: pointer;
  }

  .mg-mobile-nav__primary svg {
    width: 12px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.3;
    transition: transform .3s ease;
  }

  .mg-mobile-nav__primary.is-open svg {
    transform: rotate(180deg);
  }

  .mg-mobile-vehicles {
    padding: 4vw 0 6vw;
    border-bottom: 1px solid rgba(17, 17, 17, .09);
  }

  .mg-mobile-vehicles__filters {
    display: flex;
    gap: 2vw;
    overflow-x: auto;
    padding-bottom: 4vw;
    scrollbar-width: none;
  }

  .mg-mobile-vehicles__filters::-webkit-scrollbar,
  .mg-mobile-vehicles__track::-webkit-scrollbar {
    display: none;
  }

  .mg-mobile-vehicles__filters button {
    flex: 0 0 auto;
    padding: 2.3vw 3.4vw;
    border: 1px solid rgba(17, 17, 17, .12);
    border-radius: 99vw;
    background: transparent;
    color: rgba(17, 17, 17, .5);
    font-family: "Manrope", sans-serif;
    font-size: 2.35vw;
    font-weight: 650;
  }

  .mg-mobile-vehicles__filters button.is-active {
    border-color: #111;
    background: #111;
    color: #fff;
  }

  .mg-mobile-vehicles__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 57vw;
    gap: 2.7vw;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .mg-mobile-model {
    min-width: 0;
    color: #111;
    text-decoration: none;
    scroll-snap-align: start;
  }

  .mg-mobile-model__visual {
    position: relative;
    height: 34vw;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #ecece8;
  }

  .mg-mobile-model__visual span {
    position: absolute;
    left: 3vw;
    top: 2.8vw;
    z-index: 2;
    color: rgba(17, 17, 17, .42);
    font-size: 1.8vw;
    font-weight: 750;
    letter-spacing: .1em;
  }

  .mg-mobile-model__visual img {
    width: 88%;
    height: 80%;
    object-fit: contain;
  }

  .mg-mobile-model > strong {
    display: block;
    margin-top: 2.4vw;
    font-family: "Barlow Condensed", sans-serif;
    font-size: 4.3vw;
    font-weight: 600;
    text-transform: uppercase;
  }

  .mg-mobile-model > small {
    display: block;
    margin-top: .5vw;
    color: rgba(17, 17, 17, .4);
    font-size: 2vw;
  }

  .mg-mobile-nav__bottom {
    margin-top: auto;
    padding-top: 9vw;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3vw;
  }

  .mg-mobile-nav__bottom > a:first-child {
    color: rgba(17, 17, 17, .52);
    text-decoration: none;
    font-size: 2.6vw;
    font-weight: 650;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .mg-mobile-nav__testdrive {
    min-height: 13vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4.5vw;
    border-radius: 99vw;
    background: #111;
    color: #fff;
    text-decoration: none;
    font-size: 2.8vw;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .mg-mobile-drawer-enter-active,
  .mg-mobile-drawer-leave-active {
    transition: clip-path .52s cubic-bezier(.16, 1, .3, 1), opacity .35s ease;
  }

  .mg-mobile-drawer-enter-from,
  .mg-mobile-drawer-leave-to {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }

  .mg-mobile-drawer-enter-to,
  .mg-mobile-drawer-leave-from {
    clip-path: inset(0 0 0 0);
  }

  .mobile-vehicles-enter-active,
  .mobile-vehicles-leave-active {
    transition: opacity .3s ease, max-height .42s cubic-bezier(.16, 1, .3, 1);
    overflow: hidden;
  }

  .mobile-vehicles-enter-from,
  .mobile-vehicles-leave-to {
    opacity: 0;
    max-height: 0;
  }

  .mobile-vehicles-enter-to,
  .mobile-vehicles-leave-from {
    max-height: 90vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mg-header *,
  .mg-header *::before,
  .mg-header *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
