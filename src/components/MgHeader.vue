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

  window.addEventListener("scroll", handleScroll, {

    passive: true,

  });

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

    <div class="mg-header__bar">

      <div class="mg-header__inner">

        <a

          :href="homeHref"

          class="mg-header__brand"

          aria-label="MG Sri Lanka home"

        >

          <img

            :src="asset('images/logo.png')"

            alt="MG Sri Lanka"

            class="mg-header__logo"

          />

        </a>

        

        <nav

          class="mg-header__nav"

          aria-label="Primary navigation"

        >

          <button

            type="button"

            class="mg-header__nav-link mg-header__nav-link--vehicles"

            :class="{

              'is-active': activeMega === 'vehicles'

            }"

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

          <a

            href="#offers"

            class="mg-header__nav-link"

            @mouseenter="closeMega"

          >

            Offers

          </a>

          <a

            href="#discover"

            class="mg-header__nav-link"

            @mouseenter="closeMega"

          >

            Discover

          </a>

          <a

            href="#owners"

            class="mg-header__nav-link"

            @mouseenter="closeMega"

          >

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

          <a

            :href="props.testDriveLink"

            class="mg-header__testdrive"

          >

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

                :class="{

                  'is-active':

                    activeCategory === category.id

                }"

                @click="activeCategory = category.id"

              >

                <span>{{ category.label }}</span>

                <i></i>

              </button>

            </div>

            <a

              href="#mg-range"

              class="mg-mega__all-link"

              @click="closeMega"

            >

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

                <strong>

                  {{ filteredVehicles.length }} vehicles

                </strong>

              </div>

              <button

                type="button"

                class="mg-mega__close"

                @click="closeMega"

              >

                <span>Close</span>

                <svg viewBox="0 0 20 20">

                  <path d="M4 4l12 12M16 4 4 16" />

                </svg>

              </button>

            </div>

            <TransitionGroup

              name="vehicle-grid"

              tag="div"

              class="mg-mega__grid"

            >

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

                  <img

                    :src="vehicle.image"

                    :alt="vehicle.name"

                  />

                  <span class="mg-model-card__explore">

                    <svg viewBox="0 0 24 24">

                      <path

                        d="M5 12h14M14 7l5 5-5 5"

                      />

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

              <span>

                Built for every kind of drive.

              </span>

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

    

    <Transition name="mg-mobile-drawer">

      <div

        v-if="mobileOpen"

        class="mg-mobile-nav"

      >

        <div class="mg-mobile-nav__inner">

          <div class="mg-mobile-nav__links">

            <button

              type="button"

              class="mg-mobile-nav__primary"

              :class="{

                'is-open': mobileVehiclesOpen

              }"

              @click="

                mobileVehiclesOpen =

                  !mobileVehiclesOpen

              "

            >

              <span>Vehicles</span>

              <svg viewBox="0 0 12 8">

                <path d="m1 1 5 5 5-5" />

              </svg>

            </button>

            <Transition name="mobile-vehicles">

              <div

                v-if="mobileVehiclesOpen"

                class="mg-mobile-vehicles"

              >

                <div class="mg-mobile-vehicles__filters">

                  <button

                    v-for="category in categories"

                    :key="`mobile-${category.id}`"

                    type="button"

                    :class="{

                      'is-active':

                        activeCategory === category.id

                    }"

                    @click="

                      activeCategory = category.id

                    "

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

                      <span>

                        {{ vehicle.badge }}

                      </span>

                      <img

                        :src="vehicle.image"

                        :alt="vehicle.name"

                      />

                    </div>

                    <strong>

                      {{ vehicle.name }}

                    </strong>

                    <small>

                      {{ vehicle.type }}

                    </small>

                  </a>

                </div>

              </div>

            </Transition>

            <a

              href="#offers"

              @click="closeForNavigation"

            >

              Offers

            </a>

            <a

              href="#discover"

              @click="closeForNavigation"

            >

              Discover

            </a>

            <a

              href="#owners"

              @click="closeForNavigation"

            >

              Owners

            </a>

          </div>

          <div class="mg-mobile-nav__bottom">

            <a

              :href="props.dealerLink"

              @click="closeForNavigation"

            >

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

    background 0.35s ease,

    color 0.35s ease,

    border-color 0.35s ease,

    box-shadow 0.35s ease;

}

.mg-header__bar::before {

  content: "";

  position: absolute;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  background:

    linear-gradient(

      180deg,

      rgba(0, 0, 0, 0.42) 0%,

      rgba(0, 0, 0, 0.16) 58%,

      transparent 100%

    );

  transition: opacity 0.3s ease;

}

.mg-header--scrolled:not(.mg-header--light)

.mg-header__bar {

  background: rgba(7, 7, 7, 0.84);

  color: #fff;

  border-bottom:

    1px solid rgba(255, 255, 255, 0.09);

  box-shadow:

    0 0.55vw 2.2vw rgba(0, 0, 0, 0.16);

  backdrop-filter:

    blur(1.25vw) saturate(1.15);

  -webkit-backdrop-filter:

    blur(1.25vw) saturate(1.15);

}

.mg-header--scrolled:not(.mg-header--light)

.mg-header__bar::before {

  opacity: 0;

}

.mg-header--light .mg-header__bar {

  background: rgba(247, 247, 244, 0.985);

  color: var(--ink);

  border-bottom:

    1px solid rgba(17, 17, 17, 0.08);

  box-shadow:

    0 0.5vw 2vw rgba(0, 0, 0, 0.025);

}

.mg-header--light .mg-header__bar::before {

  opacity: 0;

}

.mg-header__inner {

  width: 92vw;

  height: var(--header-height);

  margin: 0 auto;

  display: grid;

  grid-template-columns:

    auto

    1fr

    auto;

  align-items: center;

  gap: 3.2vw;

}

.mg-header__brand {

  display: inline-flex;

  align-items: center;

  justify-content: flex-start;

  color: inherit;

  text-decoration: none;

  flex-shrink: 0;

}

.mg-header__logo {

  display: block;

  width: clamp(60px, 4.5vw, 65px);

  height: auto;

  object-fit: contain;

  transition:

    transform 0.3s ease,

    opacity 0.3s ease;

}

.mg-header__brand:hover .mg-header__logo {

  transform: scale(1.03);

}

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

  gap: 0.38vw;

  padding: 0;

  border: 0;

  background: transparent;

  color: rgba(255, 255, 255, 0.88);

  text-decoration: none;

  font-family: "Manrope", sans-serif;

  font-size: 0.82vw;

  font-weight: 600;

  letter-spacing: 0.035em;

  cursor: pointer;

  transition: color 0.25s ease;

}

.mg-header--light .mg-header__nav-link {

  color: rgba(17, 17, 17, 0.7);

}

.mg-header__nav-link::after {

  content: "";

  position: absolute;

  left: 50%;

  bottom: 0.88vw;

  width: 0;

  height: 1px;

  transform: translateX(-50%);

  background: currentColor;

  transition:

    width 0.35s cubic-bezier(0.16, 1, 0.3, 1);

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

  width: 0.54vw;

  fill: none;

  stroke: currentColor;

  stroke-width: 1.3;

  stroke-linecap: round;

  stroke-linejoin: round;

  transition: transform 0.3s ease;

}

.mg-header__nav-link.is-active svg {

  transform: rotate(180deg);

}

.mg-header__actions {

  justify-self: end;

  display: flex;

  align-items: center;

  gap: 1.05vw;

}

.mg-header__dealer {

  display: inline-flex;

  align-items: center;

  gap: 0.42vw;

  color: rgba(255, 255, 255, 0.82);

  text-decoration: none;

  font-size: 0.68vw;

  font-weight: 700;

  letter-spacing: 0.11em;

  text-transform: uppercase;

}

.mg-header--light .mg-header__dealer {

  color: rgba(17, 17, 17, 0.64);

}

.mg-header__dealer svg {

  width: 0.83vw;

  fill: none;

  stroke: currentColor;

  stroke-width: 1.45;

}

.mg-header__testdrive {
  height: clamp(42px, 2.72vw, 50px);
  display: inline-flex;
  align-items: center;
  gap: clamp(8px, 0.72vw, 12px);
  padding: 4px 4px 4px clamp(13px, 0.88vw, 17px);
  border-radius: 999px;
  background: #fff;
  color: #111;
  text-decoration: none;
  font-size: clamp(10px, 0.70vw, 13px);
  font-weight: 700;
  letter-spacing: 0.105em;
  text-transform: uppercase;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    color 0.3s ease;
}

.mg-header--light .mg-header__testdrive {

  background: #111;

  color: #fff;

}

.mg-header__testdrive:hover {
  transform: translateY(-2px);
}

.mg-header__testdrive-icon {
  width: clamp(34px, 2.28vw, 42px);
  height: clamp(34px, 2.28vw, 42px);
  flex: 0 0 clamp(34px, 2.28vw, 42px);
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #111;
  color: #fff;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
}

.mg-header--light

.mg-header__testdrive-icon {

  background: var(--red);

}

.mg-header__testdrive:hover
.mg-header__testdrive-icon {
  background: var(--red);
  transform: translateX(2px);
}

.mg-header__testdrive-icon svg {
  width: clamp(13px, 0.86vw, 16px);
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mg-header__menu-button {

  display: none;

}

.mg-mega {

  position: absolute;

  left: 0;

  right: 0;

  top: 0;

  z-index: 210;

  min-height: 39.5vw;

  padding:

    calc(var(--header-height) + 2.2vw)

    0

    2.25vw;

  box-sizing: border-box;

  background: rgba(247, 247, 244, 0.995);

  color: var(--ink);

  border-bottom:

    1px solid rgba(17, 17, 17, 0.08);

  box-shadow:

    0 2vw 5vw rgba(0, 0, 0, 0.12);

}

.mg-mega__inner {

  width: 92vw;

  margin: 0 auto;

  display: grid;

  grid-template-columns:

    12vw

    minmax(0, 1fr);

  gap: 2.8vw;

}

.mg-mega__filters {

  min-height: 29vw;

  display: flex;

  flex-direction: column;

  padding-right: 1.6vw;

  border-right:

    1px solid rgba(17, 17, 17, 0.08);

}

.mg-mega__filters-intro > span,

.mg-mega__topline > div > span {

  display: block;

  color: rgba(17, 17, 17, 0.38);

  font-size: 0.58vw;

  font-weight: 700;

  letter-spacing: 0.17em;

}

.mg-mega__filters-intro strong {

  display: block;

  margin-top: 0.55vw;

  font-size: 1.48vw;

  font-weight: 500;

  letter-spacing: -0.04em;

}

.mg-mega__filter-list {

  display: flex;

  flex-direction: column;

  gap: 0.15vw;

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

  color: rgba(17, 17, 17, 0.46);

  text-align: left;

  font-family: "Manrope", sans-serif;

  font-size: 0.75vw;

  font-weight: 600;

  cursor: pointer;

  transition:

    color 0.25s ease,

    transform 0.25s ease;

}

.mg-mega__filter-list button:hover,

.mg-mega__filter-list button.is-active {

  color: #111;

  transform: translateX(0.16vw);

}

.mg-mega__filter-list button i {

  width: 0.32vw;

  height: 0.32vw;

  border-radius: 50%;

  background: transparent;

}

.mg-mega__filter-list button.is-active i {

  background: var(--red);

  box-shadow:

    0 0 0.6vw rgba(229, 25, 32, 0.35);

}

.mg-mega__all-link {

  margin-top: auto;

  display: inline-flex;

  align-items: center;

  justify-content: space-between;

  gap: 0.7vw;

  color: #111;

  text-decoration: none;

  font-size: 0.72vw;

  font-weight: 700;

}

.mg-mega__all-link svg {

  width: 0.85vw;

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

  margin-top: 0.22vw;

  font-size: 0.68vw;

  font-weight: 600;

}

.mg-mega__close {

  display: inline-flex;

  align-items: center;

  gap: 0.48vw;

  padding: 0;

  border: 0;

  background: transparent;

  color: rgba(17, 17, 17, 0.48);

  font-family: "Manrope", sans-serif;

  font-size: 0.58vw;

  font-weight: 650;

  cursor: pointer;

}

.mg-mega__close svg {

  width: 0.8vw;

  fill: none;

  stroke: currentColor;

  stroke-width: 1.35;

  stroke-linecap: round;

}

.mg-mega__grid {

  display: grid;

  grid-template-columns:

    repeat(3, minmax(0, 1fr));

  gap:

    1.3vw

    1.35vw;

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

    radial-gradient(

      circle at 50% 78%,

      rgba(0, 0, 0, 0.065),

      transparent 36%

    ),

    #eeeeeb;

  transition:

    background 0.35s ease,

    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

}

.mg-model-card:hover

.mg-model-card__visual {

  transform: translateY(-0.12vw);

}

.mg-model-card__visual img {

  position: relative;

  z-index: 2;

  width: 85%;

  height: 78%;

  object-fit: contain;

  transform:

    translateY(0.12vw)

    scale(0.98);

  transition:

    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);

}

.mg-model-card:hover

.mg-model-card__visual img {

  transform:

    translateY(-0.08vw)

    scale(1.035);

}

.mg-model-card__badge {

  position: absolute;

  left: 0.75vw;

  top: 0.68vw;

  z-index: 5;

  padding:

    0.26vw

    0.42vw;

  border-radius: 99vw;

  background:

    rgba(255, 255, 255, 0.74);

  color:

    rgba(17, 17, 17, 0.58);

  font-size: 0.38vw;

  font-weight: 750;

  letter-spacing: 0.11em;

}

.mg-model-card__explore {

  position: absolute;

  right: 0.7vw;

  bottom: 0.7vw;

  z-index: 5;

  width: 1.75vw;

  height: 1.75vw;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #111;

  color: #fff;

  opacity: 0;

  transform: translateY(0.35vw);

  transition:

    opacity 0.3s ease,

    transform 0.3s ease,

    background 0.3s ease;

}

.mg-model-card:hover

.mg-model-card__explore {

  opacity: 1;

  transform: translateY(0);

}

.mg-model-card__explore:hover {

  background: var(--red);

}

.mg-model-card__explore svg {

  width: 0.78vw;

  fill: none;

  stroke: currentColor;

  stroke-width: 1.5;

}

.mg-model-card__copy {

  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 0.8vw;

  padding:

    0.72vw

    0.08vw

    0;

}

.mg-model-card__copy strong {

  font-family:

    "Barlow Condensed",

    sans-serif;

  font-size: 1.34vw;

  font-weight: 600;

  letter-spacing: -0.02em;

  text-transform: uppercase;

}

.mg-model-card__copy span {

  color:

    rgba(17, 17, 17, 0.42);

  font-size: 0.55vw;

  font-weight: 550;

  white-space: nowrap;

}

.mg-mega__footer {

  display: flex;

  justify-content: space-between;

  gap: 1vw;

  margin-top: 1.25vw;

  padding-top: 0.95vw;

  border-top:

    1px solid rgba(17, 17, 17, 0.08);

  color:

    rgba(17, 17, 17, 0.34);

  font-size: 0.50vw;

  font-weight: 600;

  letter-spacing: 0.05em;

}

.mg-header__backdrop {

  position: fixed;

  inset: 0;

  z-index: 190;

  width: 100%;

  height: 100%;

  padding: 0;

  border: 0;

  background:

    rgba(0, 0, 0, 0.38);

  backdrop-filter:

    blur(0.12vw);

}

.mg-mega-enter-active,

.mg-mega-leave-active {

  transition:

    opacity 0.38s ease,

    clip-path 0.52s cubic-bezier(0.16, 1, 0.3, 1),

    transform 0.52s cubic-bezier(0.16, 1, 0.3, 1);

}

.mg-mega-enter-from,

.mg-mega-leave-to {

  opacity: 0;

  clip-path:

    inset(0 0 100% 0);

  transform:

    translateY(-0.55vw);

}

.mg-backdrop-enter-active,

.mg-backdrop-leave-active {

  transition:

    opacity 0.35s ease;

}

.mg-backdrop-enter-from,

.mg-backdrop-leave-to {

  opacity: 0;

}

.vehicle-grid-enter-active,

.vehicle-grid-leave-active {

  transition:

    opacity 0.28s ease,

    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

}

.vehicle-grid-enter-from,

.vehicle-grid-leave-to {

  opacity: 0;

  transform:

    translateY(0.45vw);

}

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

  

  .mg-header__logo {

    width: clamp(82px, 9vw, 115px);

  }

  .mg-header__nav {

    gap: 2vw;

  }

  .mg-header__nav-link {

    font-size: 0.95vw;

  }

  .mg-header__dealer {

    display: none;

  }

  .mg-header__testdrive {

    height: 3.1vw;

    font-size: 0.84vw;

  }

  .mg-header__testdrive-icon {

    width: 2.55vw;

    height: 2.55vw;

  }

  .mg-mega {

    min-height: 49vw;

    padding-top:

      calc(var(--header-height) + 2.5vw);

  }

  .mg-mega__inner {

    width: 94vw;

    grid-template-columns:

      15vw

      minmax(0, 1fr);

  }

  .mg-mega__grid {

    grid-template-columns:

      repeat(2, minmax(0, 1fr));

  }

  .mg-model-card__visual {

    height: 13vw;

  }

  .mg-model-card__copy strong {

    font-size: 1.6vw;

  }

  .mg-model-card__copy span,

  .mg-mega__filter-list button,

  .mg-mega__all-link {

    font-size: 0.84vw;

  }

}

@media (max-width: 767px) {

  .mg-header {

    --header-height: 16vw;

  }

  .mg-header--scrolled:not(.mg-header--mobile-open)

  .mg-header__bar {

    background:

      rgba(7, 7, 7, 0.88);

    border-bottom:

      1px solid rgba(255, 255, 255, 0.08);

  }

  .mg-header--mobile-open

  .mg-header__bar {

    position: fixed;

    inset: 0 0 auto;

    background: #f7f7f4;

    color: #111;

    border-bottom:

      1px solid rgba(17, 17, 17, 0.08);

  }

  .mg-header__inner {

    width:

      calc(100% - 30px);

    grid-template-columns:

      auto

      1fr;

    gap: 15px;

  }

  

  .mg-header__brand {

    gap: 0;

  }

  .mg-header__logo {

    width: 92px;

    height: auto;

    object-fit: contain;

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

    border:

      1px solid rgba(255, 255, 255, 0.22);

    border-radius: 50%;

    background:

      rgba(255, 255, 255, 0.06);

    color: currentColor;

    cursor: pointer;

  }

  .mg-header--mobile-open

  .mg-header__menu-button {

    border-color:

      rgba(17, 17, 17, 0.12);

    background:

      rgba(17, 17, 17, 0.035);

  }

  .mg-header__menu-button span {

    position: absolute;

    left: 50%;

    width: 15px;

    height: 1px;

    background: currentColor;

    transform:

      translateX(-50%);

    transition:

      transform 0.3s ease,

      top 0.3s ease;

  }

  .mg-header__menu-button

  span:first-child {

    top: 15px;

  }

  .mg-header__menu-button

  span:last-child {

    top: 21px;

  }

  .mg-header--mobile-open

  .mg-header__menu-button

  span:first-child {

    top: 18px;

    transform:

      translateX(-50%)

      rotate(45deg);

  }

  .mg-header--mobile-open

  .mg-header__menu-button

  span:last-child {

    top: 18px;

    transform:

      translateX(-50%)

      rotate(-45deg);

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

  }

  .mg-mobile-nav__inner {

    min-height: 100%;

    display: flex;

    flex-direction: column;

    box-sizing: border-box;

    padding:

      22vw

      15px

      6vw;

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

    border-bottom:

      1px solid rgba(17, 17, 17, 0.09);

    background: transparent;

    color: #111;

    text-decoration: none;

    text-align: left;

    font-family:

      "Manrope",

      sans-serif;

    font-size: 5.2vw;

    font-weight: 500;

    letter-spacing: -0.045em;

    cursor: pointer;

  }

  .mg-mobile-nav__primary svg {

    width: 12px;

    fill: none;

    stroke: currentColor;

    stroke-width: 1.3;

    transition:

      transform 0.3s ease;

  }

  .mg-mobile-nav__primary.is-open svg {

    transform: rotate(180deg);

  }

  .mg-mobile-vehicles {

    padding:

      4vw

      0

      6vw;

    border-bottom:

      1px solid rgba(17, 17, 17, 0.09);

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

    padding:

      2.3vw

      3.4vw;

    border:

      1px solid rgba(17, 17, 17, 0.12);

    border-radius: 99vw;

    background: transparent;

    color:

      rgba(17, 17, 17, 0.5);

    font-size: 2.35vw;

    font-weight: 650;

  }

  .mg-mobile-vehicles__filters

  button.is-active {

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

    scroll-snap-type:

      x proximity;

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

    color:

      rgba(17, 17, 17, 0.42);

    font-size: 1.8vw;

    font-weight: 750;

    letter-spacing: 0.1em;

  }

  .mg-mobile-model__visual img {

    width: 88%;

    height: 80%;

    object-fit: contain;

  }

  .mg-mobile-model > strong {

    display: block;

    margin-top: 2.4vw;

    font-family:

      "Barlow Condensed",

      sans-serif;

    font-size: 4.3vw;

    font-weight: 600;

    text-transform: uppercase;

  }

  .mg-mobile-model > small {

    display: block;

    margin-top: 0.5vw;

    color:

      rgba(17, 17, 17, 0.4);

    font-size: 2vw;

  }

  .mg-mobile-nav__bottom {

    margin-top: auto;

    padding-top: 9vw;

    display: grid;

    grid-template-columns: 1fr;

    gap: 3vw;

  }

  .mg-mobile-nav__bottom

  > a:first-child {

    color:

      rgba(17, 17, 17, 0.52);

    text-decoration: none;

    font-size: 2.6vw;

    font-weight: 650;

    letter-spacing: 0.08em;

    text-transform: uppercase;

  }

  .mg-mobile-nav__testdrive {

    min-height: 13vw;

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding:

      0

      4.5vw;

    border-radius: 99vw;

    background: #111;

    color: #fff;

    text-decoration: none;

    font-size: 2.8vw;

    font-weight: 700;

    letter-spacing: 0.06em;

    text-transform: uppercase;

  }

  

  .mg-mobile-drawer-enter-active,

  .mg-mobile-drawer-leave-active {

    transition:

      clip-path 0.52s cubic-bezier(0.16, 1, 0.3, 1),

      opacity 0.35s ease;

  }

  .mg-mobile-drawer-enter-from,

  .mg-mobile-drawer-leave-to {

    opacity: 0;

    clip-path:

      inset(0 0 100% 0);

  }

  .mobile-vehicles-enter-active,

  .mobile-vehicles-leave-active {

    transition:

      opacity 0.3s ease,

      max-height 0.42s cubic-bezier(0.16, 1, 0.3, 1);

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

@media (max-width: 420px) {

  .mg-header__logo {

    width: 84px;

  }

}

@media (prefers-reduced-motion: reduce) {

  .mg-header *,

  .mg-header *::before,

  .mg-header *::after {

    animation-duration:

      0.01ms !important;

    animation-iteration-count:

      1 !important;

    transition-duration:

      0.01ms !important;

  }

}

/* =========================================================
   LARGE SCREEN TEST DRIVE SIZE LOCK
   Keeps the CTA compact on 2K / 4K / ultrawide screens.
========================================================= */
@media (min-width: 1600px) {
  .mg-header__testdrive {
    height: 50px;
    gap: 12px;
    padding: 4px 4px 4px 17px;
    font-size: 13px;
  }

  .mg-header__testdrive-icon {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }

  .mg-header__testdrive-icon svg {
    width: 16px;
  }
}
</style>