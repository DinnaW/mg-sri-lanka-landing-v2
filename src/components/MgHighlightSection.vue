<script setup>
import { ref, computed } from "vue";

const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
const carImage = asset("images/mg-cyberster-cutout.png");
const vehicleColors = [
  {
    id: "red",
    name: "Dynamic Red",
    hex: "#b71921",
    filter:
      "hue-rotate(0deg) saturate(1) brightness(1) contrast(1) grayscale(0)",
  },
  {
    id: "yellow",
    name: "Inca Yellow",
    hex: "#d4a900",
    filter:
      "hue-rotate(42deg) saturate(1.3) brightness(1.08) contrast(1.02) grayscale(0)",
  },
  {
    id: "grey",
    name: "Andes Grey",
    hex: "#6f7478",
    filter:
      "hue-rotate(0deg) saturate(0.08) brightness(0.92) contrast(1.08) grayscale(1)",
  },
  {
    id: "white",
    name: "English White",
    hex: "#eceae4",
    filter:
      "hue-rotate(0deg) saturate(0) brightness(1.42) contrast(0.72) grayscale(1)",
  },
];

/* =========================================================
   VEHICLE COLOR
   One image stays visible at all times. Because every preset
   uses the same filter-function order, CSS can interpolate
   smoothly between the paint colours.
========================================================= */

const selectedColor = ref(vehicleColors[0]);

const selectVehicleColor = (color) => {
  if (color.id === selectedColor.value.id) return;
  selectedColor.value = color;
};

const people = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];
const selectedDate = ref("");
const selectedTime = ref("10:00 AM");
const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:30 AM",
];
const minimumDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    today.getDate()
  ).padStart(2, "0");
  return `${year}-${month}-${day}`;
});
/* =========================================================
   MG SRI LANKA MODEL LOGOS
   Official model wordmarks currently served from mgsrilanka.lk.
   The same set is rendered twice in the template to create
   a seamless, infinite marquee.
========================================================= */
const mgModelLogos = [
  {
    id: "zs-mce",
    name: "MG ZS MCE",
    logo:
      "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-ZS-MCE-Logo.png",
    className: "mg-marquee__logo--zs",
  },
  {
    id: "zs-hybrid",
    name: "MG ZS Hybrid+",
    logo:
      "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-ZS-Hybrid-Logo.png",
    className: "mg-marquee__logo--zs-hybrid",
  },
  {
    id: "hs-phev",
    name: "MG HS Plug-In Hybrid",
    logo:
      "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-HS-Plug-In-Hybrid-Logo.png",
    className: "mg-marquee__logo--hs",
  },
  {
    id: "s5-ev",
    name: "MG S5 EV",
    logo:
      "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG-S5-EV-Logo.png",
    className: "mg-marquee__logo--s5",
  },
  {
    id: "mg4",
    name: "MG4 Electric",
    logo:
      "https://mgsrilanka.lk/wp-content/uploads/2025/07/MG4-Electric-Logo.png",
    className: "mg-marquee__logo--mg4",
  },
];
</script>
<template>
  <section class="mg-highlight">
    <div class="mg-highlight__container">
      <div class="mg-highlight__intro">
        <div class="mg-highlight__heading">
          <span class="mg-highlight__eyebrow">
            Discover MG
          </span>
          <h2>
            Driving made simpler,
            <br />
            smarter and more exciting.
          </h2>
        </div>
        <div class="mg-highlight__community">
          <div class="mg-highlight__people">
            <div
              v-for="person in people"
              :key="person.id"
              class="mg-highlight__person"
            >
              <img
                :src="person.image"
                alt=""
                loading="lazy"
              />
            </div>
            <div class="mg-highlight__person-count">
              +
            </div>
          </div>
          <p>
            Built around the people who drive them —
            thoughtful technology, confident performance
            and usability that feels natural every day.
          </p>
        </div>
      </div>
      <div class="mg-highlight__stage">
        <div class="mg-highlight__vehicle">
          <img
            class="mg-highlight__vehicle-image"
            :src="carImage"
            :alt="`MG Cyberster in ${selectedColor.name}`"
            :style="{ '--vehicle-filter': selectedColor.filter }"
            draggable="false"
          />
        </div>
        <div class="mg-highlight__model">
          <span>
            100% Electric
          </span>
          <strong>
            MG Cyberster
          </strong>
        </div>
        <div class="mg-highlight__colors">
          <span class="mg-highlight__colors-label">
            Exterior
          </span>

          <div
            class="mg-highlight__swatches"
            role="group"
            aria-label="Choose vehicle colour"
          >
            <button
              v-for="color in vehicleColors"
              :key="color.id"
              type="button"
              class="mg-highlight__swatch"
              :class="{
                'mg-highlight__swatch--active': selectedColor.id === color.id,
              }"
              :aria-label="`Select ${color.name}`"
              :aria-pressed="selectedColor.id === color.id"
              :title="color.name"
              @click="selectVehicleColor(color)"
            >
              <span
                class="mg-highlight__swatch-color"
                :style="{ backgroundColor: color.hex }"
              ></span>
            </button>
          </div>

          <span class="mg-highlight__color-separator" aria-hidden="true"></span>

          <strong class="mg-highlight__color-name">
            {{ selectedColor.name }}
          </strong>
        </div>
        <div class="mg-testdrive">
          <div class="mg-testdrive__header">
            <div class="mg-testdrive__icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="mg-testdrive__heading">
              <span>
                Experience MG
              </span>
              <h3>
                Book a test drive
              </h3>
            </div>
          </div>
          <p class="mg-testdrive__description">
            Choose a preferred date and time to
            experience the Cyberster for yourself.
          </p>
          <div class="mg-testdrive__field">
            <label for="mg-test-date">
              Preferred date
            </label>
            <div class="mg-testdrive__date">
              <input
                id="mg-test-date"
                v-model="selectedDate"
                type="date"
                :min="minimumDate"
              />
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div class="mg-testdrive__times">
            <button
              v-for="time in timeSlots"
              :key="time"
              type="button"
              class="mg-testdrive__time"
              :class="{
                'mg-testdrive__time--active':
                  selectedTime === time
              }"
              @click="selectedTime = time"
            >
              {{ time }}
            </button>
          </div>
          <button
            type="button"
            class="mg-testdrive__submit"
          >
            <span>
              Continue booking
            </span>
            <span class="mg-testdrive__submit-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
          </button>
        </div>
      </div>
      <div class="mg-highlight__bottom">
        <p class="mg-highlight__caption">
          Engineered around electric performance,
          intelligent technology and a driving
          experience made for the future.
        </p>

        <!-- ================================================
             PREMIUM MG MODEL LOGO MARQUEE
             Two identical groups create a seamless loop.
        ================================================= -->
        <div class="mg-marquee">
          <div class="mg-marquee__heading">
          
          </div>

          <div class="mg-marquee__viewport">
            <div class="mg-marquee__track">

              <div class="mg-marquee__group">
                <div
                  v-for="logo in mgModelLogos"
                  :key="`first-${logo.id}`"
                  class="mg-marquee__item"
                  :class="logo.className"
                >
                  <img
                    :src="logo.logo"
                    :alt="logo.name"
                    draggable="false"
                  />
                </div>
              </div>

              <div
                class="mg-marquee__group"
                aria-hidden="true"
              >
                <div
                  v-for="logo in mgModelLogos"
                  :key="`second-${logo.id}`"
                  class="mg-marquee__item"
                  :class="logo.className"
                >
                  <img
                    :src="logo.logo"
                    alt=""
                    draggable="false"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
@import url(
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght\@400;500;600&family=Manrope:wght\@400;500;600;700&display=swap"
);
.mg-highlight {
  --mg-red: #e51920;
  --mg-bg: #f7f6f3;
  --mg-black: #111111;
  --page-width: 91%;
  --page-max-width: 1420px;
  --vehicle-left: 43%;
  --vehicle-width: 112%;
  --vehicle-max-width: 1500px;
  --card-left: 66%;
  --card-top: 47%;
  position: relative;
  width: 100%;
  padding:
    clamp(
      72px,
      6vw,
      100px
    )
    0
    clamp(
      76px,
      6vw,
      105px
    );
  overflow: hidden;
  background:
    var(--mg-bg);
  color:
    var(--mg-black);
}
.mg-highlight__container {
  width:
    min(
      var(--page-width),
      var(--page-max-width)
    );
  margin:
    0
    auto;
  box-sizing:
    border-box;
}
.mg-highlight__intro {
  width:
    100%;
  display:
    grid;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    minmax(
      220px,
      280px
    );
  align-items:
    start;
  gap:
    clamp(
      45px,
      6vw,
      90px
    );
  margin-bottom:
    clamp(
      22px,
      2vw,
      32px
    );
}
.mg-highlight__eyebrow {
  display:
    block;
  margin-bottom:
    9px;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    clamp(
      8px,
      0.48vw,
      10px
    );
  font-weight:
    700;
  letter-spacing:
    0.19em;
  text-transform:
    uppercase;
  color:
    rgba(
      0,
      0,
      0,
      0.38
    );
}
.mg-highlight__heading {
  min-width:
    0;
}
.mg-highlight__heading h2 {
  max-width:
    660px;
  margin:
    0;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    clamp(
      30px,
      2.5vw,
      42px
    );
  font-weight:
    600;
  line-height:
    1.08;
  letter-spacing:
    -0.04em;
  color:
    #111;
}
.mg-highlight__community {
  justify-self:
    end;
  width:
    100%;
  max-width:
    260px;
  padding-top:
    4px;
}
.mg-highlight__people {
  display:
    flex;
  align-items:
    center;
  margin-bottom:
    12px;
}
.mg-highlight__person,
.mg-highlight__person-count {
  width:
    34px;
  height:
    34px;
  flex:
    0
    0
    34px;
  margin-left:
    -8px;
  overflow:
    hidden;
  border:
    2px
    solid
    var(--mg-bg);
  border-radius:
    50%;
  background:
    #ddd;
}
.mg-highlight__person:first-child {
  margin-left:
    0;
}
.mg-highlight__person img {
  display:
    block;
  width:
    100%;
  height:
    100%;
  object-fit:
    cover;
}
.mg-highlight__person-count {
  display:
    grid;
  place-items:
    center;
  background:
    #111;
  color:
    #fff;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    12px;
}
.mg-highlight__community p {
  max-width:
    250px;
  margin:
    0;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    clamp(
      10px,
      0.68vw,
      11px
    );
  font-weight:
    400;
  line-height:
    1.65;
  color:
    rgba(
      0,
      0,
      0,
      0.48
    );
}
.mg-highlight__stage {
  position:
    relative;
  width:
    100%;
  height:
    clamp(
      420px,
      35vw,
      560px
    );
}
.mg-highlight__vehicle {
  position:
    absolute;
  left:
    var(--vehicle-left);
  top:
    50%;
  z-index:
    2;
  width:
    min(
      var(--vehicle-width),
      var(--vehicle-max-width)
    );
  transform:
    translate(
      -50%,
      -50%
    );
  transition:
    transform
    0.8s
    cubic-bezier(
      0.16,
      1,
      0.3,
      1
    );
}
/* =========================================================
   VEHICLE IMAGE
   Premium paint morph: no wipe, no disappearing, no duplicate.
========================================================= */

.mg-highlight__vehicle-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;

  filter:
    var(--vehicle-filter)
    drop-shadow(0 26px 24px rgba(0, 0, 0, 0.15));

  transition:
    filter 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  will-change: filter;
}

.mg-highlight__stage:hover
.mg-highlight__vehicle {
  transform:
    translate(
      -50%,
      calc(-50% - 5px)
    );
}

/* =========================================================
   PREMIUM INLINE COLOR SELECTOR
========================================================= */

.mg-highlight__colors {
  position: absolute;
  right: 0;
  bottom: 8%;
  z-index: 12;

  display: inline-flex;
  align-items: center;
  gap: 14px;

  min-height: 34px;
  padding: 0;

  border: 0;
  background: transparent;
  box-shadow: none;
}

.mg-highlight__colors-label {
  flex: 0 0 auto;

  font-family: "Manrope", sans-serif;
  font-size: 6px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  color: rgba(0, 0, 0, 0.34);
}

.mg-highlight__swatches {
  display: inline-flex;
  align-items: center;
  gap: 11px;
}

.mg-highlight__swatch {
  position: relative;

  width: 23px;
  height: 30px;
  padding: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 0;
  outline: 0;
  background: transparent;

  cursor: pointer;
}

.mg-highlight__swatch-color {
  position: relative;

  width: 20px;
  height: 20px;

  display: block;

  border: 0;
  border-radius: 50%;

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.62),
    inset 0 -1px 1px rgba(0, 0, 0, 0.09),
    0 4px 10px rgba(0, 0, 0, 0.09);

  transform: scale(1);

  transition:
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.32s ease,
    opacity 0.25s ease;
}

/* Active state stays clean: no outer ring/border. */
.mg-highlight__swatch::after {
  content: "";

  position: absolute;
  left: 50%;
  bottom: 0;

  width: 12px;
  height: 1px;

  border-radius: 99px;
  background: #111;

  opacity: 0;
  transform: translateX(-50%) scaleX(0.35);

  transition:
    opacity 0.28s ease,
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.mg-highlight__swatch:hover .mg-highlight__swatch-color {
  transform: translateY(-1px) scale(1.08);

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.65),
    inset 0 -1px 1px rgba(0, 0, 0, 0.08),
    0 7px 16px rgba(0, 0, 0, 0.12);
}

.mg-highlight__swatch--active .mg-highlight__swatch-color {
  transform: translateY(-1px) scale(1.14);

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.7),
    inset 0 -1px 1px rgba(0, 0, 0, 0.07),
    0 8px 18px rgba(0, 0, 0, 0.14);
}

.mg-highlight__swatch--active::after {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

.mg-highlight__swatch:focus-visible .mg-highlight__swatch-color {
  transform: translateY(-1px) scale(1.12);
}

.mg-highlight__color-separator {
  width: 1px;
  height: 18px;
  flex: 0 0 1px;

  background: rgba(0, 0, 0, 0.10);
}

.mg-highlight__color-name {
  min-width: 78px;

  font-family: "Manrope", sans-serif;
  font-size: 8px;
  font-weight: 650;
  line-height: 1;

  color: rgba(0, 0, 0, 0.72);

  white-space: nowrap;

  transition:
    color 0.25s ease,
    opacity 0.25s ease;
}

.mg-highlight__model {
  position:
    absolute;
  left:
    0;
  bottom:
    8%;
  z-index:
    5;
}
.mg-highlight__model span {
  display:
    block;
  margin-bottom:
    4px;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    7px;
  font-weight:
    700;
  letter-spacing:
    0.16em;
  text-transform:
    uppercase;
  color:
    var(--mg-red);
}
.mg-highlight__model strong {
  display:
    block;
  font-family:
    "Barlow Condensed",
    sans-serif;
  font-size:
    clamp(
      18px,
      1.4vw,
      24px
    );
  font-weight:
    500;
  line-height:
    1;
  text-transform:
    uppercase;
  color:
    #111;
}
.mg-testdrive {
  position:
    absolute;
  left:
    var(--card-left);
  top:
    var(--card-top);
  z-index:
    10;
  width:
    clamp(
      220px,
      17vw,
      270px
    );
  box-sizing:
    border-box;
  padding:
    16px;
  transform:
    translateY(
      -50%
    );
  border:
    1px
    solid
    rgba(
      0,
      0,
      0,
      0.065
    );
  border-radius:
    14px;
  background:
    rgba(
      255,
      255,
      255,
      0.94
    );
  backdrop-filter:
    blur(
      18px
    );
  -webkit-backdrop-filter:
    blur(
      18px
    );
  box-shadow:
    0
    18px
    50px
    rgba(
      0,
      0,
      0,
      0.08
    );
}
.mg-testdrive__header {
  display:
    flex;
  align-items:
    center;
  gap:
    10px;
}
.mg-testdrive__icon {
  width:
    30px;
  height:
    30px;
  flex:
    0
    0
    30px;
  display:
    grid;
  place-items:
    center;
  border-radius:
    50%;
  background:
    #111;
  color:
    #fff;
}
.mg-testdrive__icon svg {
  width:
    13px;
}
.mg-testdrive__heading span {
  display:
    block;
  margin-bottom:
    3px;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    6px;
  font-weight:
    700;
  letter-spacing:
    0.15em;
  text-transform:
    uppercase;
  color:
    rgba(
      0,
      0,
      0,
      0.4
    );
}
.mg-testdrive__heading h3 {
  margin:
    0;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    clamp(
      13px,
      0.9vw,
      16px
    );
  font-weight:
    650;
  line-height:
    1.18;
  letter-spacing:
    -0.025em;
  color:
    #111;
}
.mg-testdrive__description {
  max-width:
    220px;
  margin:
    11px
    0
    0;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    8px;
  line-height:
    1.55;
  color:
    rgba(
      0,
      0,
      0,
      0.46
    );
}
.mg-testdrive__field {
  margin-top:
    14px;
}
.mg-testdrive__field label {
  display:
    block;
  margin-bottom:
    6px;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    6px;
  font-weight:
    700;
  letter-spacing:
    0.11em;
  text-transform:
    uppercase;
  color:
    rgba(
      0,
      0,
      0,
      0.43
    );
}
.mg-testdrive__date {
  position:
    relative;
}
.mg-testdrive__date input {
  box-sizing:
    border-box;
  width:
    100%;
  height:
    36px;
  padding:
    0
    34px
    0
    11px;
  border:
    1px
    solid
    rgba(
      0,
      0,
      0,
      0.08
    );
  border-radius:
    8px;
  outline:
    none;
  background:
    #f7f6f3;
  color:
    #111;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    8px;
  transition:
    border-color
    0.25s
    ease,
    background
    0.25s
    ease;
}
.mg-testdrive__date input:focus {
  border-color:
    rgba(
      229,
      25,
      32,
      0.38
    );
  background:
    #fff;
}
.mg-testdrive__date
input::-webkit-calendar-picker-indicator {
  position:
    absolute;
  right:
    0;
  width:
    34px;
  height:
    100%;
  opacity:
    0;
  cursor:
    pointer;
}
.mg-testdrive__date > svg {
  position:
    absolute;
  top:
    50%;
  right:
    11px;
  width:
    12px;
  transform:
    translateY(
      -50%
    );
  pointer-events:
    none;
  color:
    rgba(
      0,
      0,
      0,
      0.52
    );
}
.mg-testdrive__times {
  display:
    grid;
  grid-template-columns:
    repeat(
      3,
      minmax(
        0,
        1fr
      )
    );
  gap:
    5px;
  margin-top:
    8px;
}
.mg-testdrive__time {
  height:
    28px;
  min-width:
    0;
  padding:
    0
    4px;
  border:
    1px
    solid
    rgba(
      0,
      0,
      0,
      0.08
    );
  border-radius:
    6px;
  background:
    #f7f6f3;
  color:
    rgba(
      0,
      0,
      0,
      0.54
    );
  cursor:
    pointer;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    6px;
  font-weight:
    600;
  transition:
    border-color
    0.2s
    ease,
    background
    0.2s
    ease,
    color
    0.2s
    ease;
}
.mg-testdrive__time:hover {
  border-color:
    rgba(
      0,
      0,
      0,
      0.2
    );
  color:
    #111;
}
.mg-testdrive__time--active {
  border-color:
    #111;
  background:
    #111;
  color:
    #fff;
}
.mg-testdrive__submit {
  width:
    100%;
  min-height:
    38px;
  margin-top:
    9px;
  padding:
    4px
    5px
    4px
    12px;
  display:
    flex;
  align-items:
    center;
  justify-content:
    space-between;
  gap:
    10px;
  border:
    0;
  border-radius:
    8px;
  background:
    var(--mg-red);
  color:
    #fff;
  cursor:
    pointer;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    7px;
  font-weight:
    700;
  letter-spacing:
    0.02em;
  transition:
    background
    0.25s
    ease,
    transform
    0.25s
    ease;
}
.mg-testdrive__submit:hover {
  background:
    #c91419;
  transform:
    translateY(
      -1px
    );
}
.mg-testdrive__submit-icon {
  width:
    28px;
  height:
    28px;
  flex:
    0
    0
    28px;
  display:
    grid;
  place-items:
    center;
  border-radius:
    6px;
  background:
    rgba(
      255,
      255,
      255,
      0.14
    );
}
.mg-testdrive__submit-icon svg {
  width:
    12px;
}
.mg-highlight__bottom {
  width:
    100%;
  padding-top:
    clamp(
      38px,
      4vw,
      58px
    );
}
.mg-highlight__caption {
  max-width:
    440px;
  margin:
    0
    auto
    clamp(
      28px,
      3vw,
      42px
    );
  text-align:
    center;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    clamp(
      7px,
      0.5vw,
      9px
    );
  line-height:
    1.65;
  color:
    rgba(
      0,
      0,
      0,
      0.34
    );
}
.mg-marquee {
  width: 100%;
  padding-top:
    clamp(
      18px,
      2vw,
      28px
    );
  border-top:
    1px
    solid
    rgba(
      0,
      0,
      0,
      0.065
    );
}

/* Small premium label above the moving logos */
.mg-marquee__heading {
  width:
    min(
      90%,
      1180px
    );
  margin:
    0
    auto
    clamp(
      18px,
      2vw,
      26px
    );
  display:
    flex;
  align-items:
    center;
  gap:
    12px;
  font-family:
    "Manrope",
    sans-serif;
  font-size:
    clamp(
      6px,
      0.43vw,
      8px
    );
  font-weight:
    700;
  letter-spacing:
    0.17em;
  text-transform:
    uppercase;
  color:
    rgba(
      0,
      0,
      0,
      0.30
    );
}

.mg-marquee__line {
  height:
    1px;
  flex:
    1;
  background:
    rgba(
      0,
      0,
      0,
      0.055
    );
}

/*
|--------------------------------------------------------------------------
| VIEWPORT
|--------------------------------------------------------------------------
| The mask softly fades the logos at the left/right edges instead of
| cutting them off abruptly.
*/
.mg-marquee__viewport {
  --marquee-gap:
    clamp(
      64px,
      7vw,
      118px
    );

  position:
    relative;
  width:
    100%;
  overflow:
    hidden;
  padding:
    clamp(
      8px,
      0.8vw,
      13px
    )
    0
    clamp(
      12px,
      1.3vw,
      20px
    );

  -webkit-mask-image:
    linear-gradient(
      90deg,
      transparent 0%,
      #000 7%,
      #000 93%,
      transparent 100%
    );

  mask-image:
    linear-gradient(
      90deg,
      transparent 0%,
      #000 7%,
      #000 93%,
      transparent 100%
    );
}

/*
|--------------------------------------------------------------------------
| TRACK
|--------------------------------------------------------------------------
*/
.mg-marquee__track {
  display:
    flex;
  width:
    max-content;
  will-change:
    transform;
  animation:
    mgLogoMarquee
    27s
    linear
    infinite;
}

.mg-marquee__viewport:hover
.mg-marquee__track {
  animation-play-state:
    paused;
}

/*
|--------------------------------------------------------------------------
| DUPLICATED GROUP
|--------------------------------------------------------------------------
| Both groups are identical and have identical width, allowing the track
| to move exactly one group-width before restarting invisibly.
*/
.mg-marquee__group {
  flex:
    0
    0
    auto;
  display:
    flex;
  align-items:
    center;
  gap:
    var(--marquee-gap);
  padding-right:
    var(--marquee-gap);
}

/*
|--------------------------------------------------------------------------
| LOGO ITEM
|--------------------------------------------------------------------------
*/
.mg-marquee__item {
  flex:
    0
    0
    auto;
  width:
    clamp(
      118px,
      10vw,
      168px
    );
  height:
    clamp(
      44px,
      4vw,
      62px
    );
  display:
    flex;
  align-items:
    center;
  justify-content:
    center;
}

.mg-marquee__item img {
  display:
    block;
  width:
    auto;
  max-width:
    100%;
  max-height:
    38px;
  object-fit:
    contain;
  opacity:
    0.46;
  filter:
    grayscale(1)
    contrast(1.04);
  pointer-events:
    none;
  user-select:
    none;
  -webkit-user-drag:
    none;
  transform:
    translateZ(0);
  transition:
    opacity
    0.35s
    ease,
    filter
    0.35s
    ease,
    transform
    0.45s
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );
}

.mg-marquee__item:hover img {
  opacity:
    0.9;
  filter:
    grayscale(0)
    contrast(1);
  transform:
    translateY(
      -2px
    )
    scale(
      1.035
    );
}

/* Slight optical tuning because each official wordmark has
   a different natural aspect ratio. */
.mg-marquee__logo--zs img {
  max-height:
    30px;
}

.mg-marquee__logo--zs-hybrid img {
  max-height:
    40px;
}

.mg-marquee__logo--hs img {
  max-height:
    38px;
}

.mg-marquee__logo--s5 img {
  max-height:
    31px;
}

.mg-marquee__logo--mg4 img {
  max-height:
    40px;
}

/* Move exactly one of the two identical groups. */
@keyframes mgLogoMarquee {
  from {
    transform:
      translate3d(
        0,
        0,
        0
      );
  }

  to {
    transform:
      translate3d(
        -50%,
        0,
        0
      );
  }
}

@media (min-width: 1800px) {
  .mg-highlight {
    --vehicle-left:
      43%;
    --vehicle-width:
      88vw;
    --vehicle-max-width:
      none;
    --card-left:
      66%;
    --card-top:
      47%;
  }
  .mg-highlight__container {
    width:
      92vw;
    max-width:
      none;
  }
  .mg-highlight__intro {
    grid-template-columns:
      minmax(
        0,
        1fr
      )
      17vw;
    gap:
      6vw;
    margin-bottom:
      1.5vw;
  }
  .mg-highlight__heading h2 {
    max-width:
      42vw;
    font-size:
      2.5vw;
  }
  .mg-highlight__community {
    max-width:
      17vw;
  }
  .mg-highlight__community p {
    max-width:
      16vw;
    font-size:
      0.65vw;
  }
  .mg-highlight__stage {
    height:
      34vw;
  }
  .mg-highlight__colors {
    right: 0;
    bottom: 2.2vw;
    gap: 0.75vw;
    min-height: 1.9vw;
  }
  .mg-highlight__colors-label {
    font-size: 0.34vw;
  }
  .mg-highlight__swatches {
    gap: 0.55vw;
  }
  .mg-highlight__swatch {
    width: 1.2vw;
    height: 1.55vw;
  }
  .mg-highlight__swatch-color {
    width: 0.95vw;
    height: 0.95vw;
  }
  .mg-highlight__swatch::after {
    width: 0.58vw;
    height: 1px;
  }
  .mg-highlight__color-separator {
    height: 1vw;
  }
  .mg-highlight__color-name {
    min-width: 4.4vw;
    font-size: 0.43vw;
  }
  .mg-highlight__model {
    left:
      0;
    bottom:
      2.2vw;
  }
  .mg-testdrive {
    width:
      17vw;
    padding:
      1vw;
    border-radius:
      0.9vw;
  }
  .mg-testdrive__icon {
    width:
      1.8vw;
    height:
      1.8vw;
    flex-basis:
      1.8vw;
  }
  .mg-testdrive__heading h3 {
    font-size:
      0.9vw;
  }
  .mg-testdrive__description {
    max-width:
      14vw;
    font-size:
      0.48vw;
  }
  .mg-testdrive__field {
    margin-top:
      0.9vw;
  }
  .mg-testdrive__date input {
    height:
      2.2vw;
    font-size:
      0.48vw;
  }
  .mg-testdrive__time {
    height:
      1.7vw;
    font-size:
      0.38vw;
  }
  .mg-testdrive__submit {
    min-height:
      2.2vw;
    font-size:
      0.42vw;
  }
  .mg-highlight__bottom {
    padding-top:
      3vw;
  }
  .mg-highlight__caption {
    max-width:
      28vw;
    margin-bottom:
      2vw;
    font-size:
      0.48vw;
  }
  .mg-marquee {
    padding-top:
      1.2vw;
  }

  .mg-marquee__heading {
    width:
      76vw;
    max-width:
      none;
    margin-bottom:
      1.35vw;
    gap:
      0.75vw;
    font-size:
      0.38vw;
  }

  .mg-marquee__viewport {
    --marquee-gap:
      6vw;
    padding:
      0.55vw
      0
      0.9vw;
  }

  .mg-marquee__item {
    width:
      8.5vw;
    height:
      3.2vw;
  }

  .mg-marquee__item img {
    max-height:
      1.8vw;
  }

  .mg-marquee__logo--zs img {
    max-height:
      1.45vw;
  }

  .mg-marquee__logo--zs-hybrid img {
    max-height:
      1.95vw;
  }

  .mg-marquee__logo--hs img {
    max-height:
      1.85vw;
  }

  .mg-marquee__logo--s5 img {
    max-height:
      1.5vw;
  }

  .mg-marquee__logo--mg4 img {
    max-height:
      1.95vw;
  }
}
@media (max-width: 1050px) {
  .mg-highlight {
    --vehicle-left:
      41%;
    --vehicle-width:
      124%;
    --card-left:
      64%;
    --card-top:
      46%;
  }
  .mg-highlight__intro {
    grid-template-columns:
      minmax(
        0,
        1fr
      )
      230px;
    gap:
      35px;
  }
  .mg-highlight__stage {
    height:
      420px;
  }
  .mg-testdrive {
    width:
      230px;
  }
  .mg-highlight__model {
    left:
      0;
  }
  .mg-highlight__colors {
    right: 0;
    bottom: 7%;
  }
  .mg-marquee__viewport {
    --marquee-gap:
      58px;
  }

  .mg-marquee__heading {
    width:
      94%;
  }
}
@media (max-width: 767px) {
  .mg-highlight {
    padding:
      58px
      0
      62px;
  }
  .mg-highlight__container {
    width:
      calc(
        100% - 30px
      );
    max-width:
      none;
  }
  .mg-highlight__intro {
    display:
      block;
    width:
      100%;
    margin-bottom:
      28px;
  }
  .mg-highlight__heading h2 {
    font-size:
      29px;
  }
  .mg-highlight__community {
    justify-self:
      auto;
    width:
      100%;
    max-width:
      290px;
    margin-top:
      22px;
  }
  .mg-highlight__stage {
    width:
      100%;
    height:
      auto;
  }
  .mg-highlight__vehicle {
    position:
      relative;
    left:
      50%;
    top:
      auto;
    width:
      150%;
    transform:
      translateX(
        -50%
      );
  }
  .mg-highlight__stage:hover
  .mg-highlight__vehicle {
    transform:
      translateX(
        -50%
      );
  }
  .mg-highlight__model {
    position:
      relative;
    left:
      auto;
    bottom:
      auto;
    margin-top:
      3px;
  }
  .mg-highlight__colors {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    max-width: 100%;
    margin: 18px 0 0;
    justify-content: flex-end;
    gap: 12px;
    min-height: 34px;
  }
  .mg-highlight__swatches {
    gap: 9px;
  }
  .mg-highlight__swatch {
    width: 23px;
    height: 30px;
  }
  .mg-highlight__swatch-color {
    width: 19px;
    height: 19px;
  }
  .mg-highlight__color-name {
    min-width: 74px;
    font-size: 8px;
  }
  .mg-testdrive {
    position:
      relative;
    left:
      auto;
    top:
      auto;
    width:
      100%;
    margin-top:
      22px;
    padding:
      17px;
    transform:
      none;
    background:
      #fff;
    backdrop-filter:
      none;
    -webkit-backdrop-filter:
      none;
  }
  .mg-testdrive__heading h3 {
    font-size:
      15px;
  }
  .mg-testdrive__description {
    max-width:
      300px;
    font-size:
      9px;
  }
  .mg-testdrive__date input {
    height:
      40px;
    font-size:
      9px;
  }
  .mg-testdrive__time {
    height:
      32px;
    font-size:
      7px;
  }
  .mg-testdrive__submit {
    min-height:
      42px;
    font-size:
      8px;
  }
  .mg-highlight__bottom {
    width:
      100%;
    padding-top:
      42px;
  }
  .mg-highlight__caption {
    max-width:
      310px;
    margin-bottom:
      28px;
    font-size:
      8px;
  }
  .mg-marquee {
    padding-top:
      20px;
  }

  .mg-marquee__heading {
    width:
      100%;
    margin-bottom:
      18px;
    font-size:
      7px;
  }

  .mg-marquee__viewport {
    --marquee-gap:
      42px;
    width:
      calc(
        100% + 30px
      );
    margin-left:
      -15px;
    padding:
      8px
      0
      14px;

    -webkit-mask-image:
      linear-gradient(
        90deg,
        transparent 0%,
        #000 10%,
        #000 90%,
        transparent 100%
      );

    mask-image:
      linear-gradient(
        90deg,
        transparent 0%,
        #000 10%,
        #000 90%,
        transparent 100%
      );
  }

  .mg-marquee__track {
    animation-duration:
      22s;
  }

  .mg-marquee__item {
    width:
      122px;
    height:
      48px;
  }

  .mg-marquee__item img {
    max-height:
      31px;
  }

  .mg-marquee__logo--zs img {
    max-height:
      24px;
  }

  .mg-marquee__logo--zs-hybrid img {
    max-height:
      32px;
  }

  .mg-marquee__logo--hs img {
    max-height:
      30px;
  }

  .mg-marquee__logo--s5 img {
    max-height:
      25px;
  }

  .mg-marquee__logo--mg4 img {
    max-height:
      32px;
  }
}
@media (max-width: 420px) {
  .mg-highlight__heading h2 {
    font-size:
      27px;
  }
  .mg-highlight__vehicle {
    width:
      158%;
  }
  .mg-testdrive__times {
    grid-template-columns:
      repeat(
        3,
        minmax(
          0,
          1fr
        )
      );
  }
  .mg-highlight__colors {
    width: 100%;
    box-sizing: border-box;
    justify-content: flex-start;
    gap: 10px;
  }
  .mg-highlight__swatches {
    gap: 7px;
  }
  .mg-highlight__color-name {
    min-width: 0;
    margin-left: auto;
  }
}
/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-highlight__vehicle-image,
  .mg-highlight__vehicle,
  .mg-highlight__swatch-color,
  .mg-highlight__swatch::after {
    transition-duration: 0.01ms !important;
  }

  .mg-marquee__track {
    animation:
      none !important;
  }
}

</style>
