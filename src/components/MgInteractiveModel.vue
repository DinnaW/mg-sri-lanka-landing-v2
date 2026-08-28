<script setup>
import {
  computed,
  nextTick,
  ref,
} from "vue";

/* =========================================================
   ASSET HELPERS
========================================================= */

const asset = (path) =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;

const modelPath =
  `${import.meta.env.BASE_URL}models/mg-car.glb`;

const studioBackground = asset(
  "images/Generated Image August 24, 2026 - 12_44PM.jpg"
);

/* =========================================================
   MODEL STATE
========================================================= */

const stageRef = ref(null);
const modelViewer = ref(null);

const modelLoaded = ref(false);
const modelLoading = ref(true);
const modelError = ref(false);

const selectedColorId = ref("silver");
const useFilterFallback = ref(false);

/* =========================================================
   MODEL SETTINGS
========================================================= */

const DEFAULT_CAMERA = "32deg 82deg 57%";

/* =========================================================
   EXTERIOR COLOURS
   Uses the same material logic as your previous 3D section.
========================================================= */

const colours = [
  {
    id: "white",
    name: "Dover White",
    shortName: "White",
    finish: "Pearl",
    code: "DW01",
    hex: "#F4F2EC",
    paintHex: "#F8F6F0",
    metallic: 0.06,
    roughness: 0.31,
    exposure: 1.02,
    filter: "brightness(1.12) saturate(.18)",
  },
  {
    id: "black",
    name: "Pebble Black",
    shortName: "Black",
    finish: "Metallic",
    code: "PB02",
    hex: "#0A0B0C",
    paintHex: "#030405",
    metallic: 0.38,
    roughness: 0.13,
    exposure: 0.92,
    filter: "brightness(.20) saturate(.25) contrast(1.22)",
  },
  {
    id: "silver",
    name: "Cosmic Silver",
    shortName: "Silver",
    finish: "Metallic",
    code: "CS03",
    hex: "#B9BEC0",
    paintHex: "#AEB4B7",
    metallic: 0.90,
    roughness: 0.18,
    exposure: 0.98,
    filter: "grayscale(.78) saturate(.18) brightness(.94)",
  },
  {
    id: "red",
    name: "Diamond Red",
    shortName: "Red",
    finish: "Metallic",
    code: "DR04",
    hex: "#B51220",
    paintHex: "#9E0A17",
    metallic: 0.48,
    roughness: 0.16,
    exposure: 0.97,
    filter:
      "sepia(.38) saturate(5.4) hue-rotate(326deg) brightness(.72) contrast(1.08)",
  },
  {
    id: "grey",
    name: "Andes Grey",
    shortName: "Grey",
    finish: "Metallic",
    code: "AG05",
    hex: "#555D5F",
    paintHex: "#454C4E",
    metallic: 0.72,
    roughness: 0.20,
    exposure: 0.96,
    filter: "grayscale(.56) saturate(.22) brightness(.58)",
  },
  {
    id: "blue",
    name: "Piccadilly Blue",
    shortName: "Blue",
    finish: "Metallic",
    code: "PB06",
    hex: "#3E607A",
    paintHex: "#294E6B",
    metallic: 0.62,
    roughness: 0.18,
    exposure: 0.95,
    filter:
      "sepia(.12) saturate(2.2) hue-rotate(165deg) brightness(.61) contrast(1.04)",
  },
];

const selectedColour = computed(() => {
  return (
    colours.find(
      (colour) =>
        colour.id === selectedColorId.value
    ) || colours[0]
  );
});

const selectedColourIndex = computed(() => {
  const index = colours.findIndex(
    (colour) =>
      colour.id === selectedColorId.value
  );

  return String(index + 1).padStart(2, "0");
});

const modelExposure = computed(
  () => selectedColour.value.exposure || 1
);

/* =========================================================
   VEHICLE SPECS
========================================================= */

const specs = [
  {
    value: "480",
    unit: "km",
    label: "Estimated range",
  },
  {
    value: "6.3",
    unit: "s",
    label: "0–100 km/h",
  },
  {
    value: "170",
    unit: "kW",
    label: "Peak power",
  },
  {
    value: "64",
    unit: "kWh",
    label: "Battery",
  },
];

/* =========================================================
   BOTTOM CINEMATIC CARDS
========================================================= */

const featureCards = [
  {
    id: "cockpit",
    eyebrow: "01 / COCKPIT",
    title: "Driver-focused interior",
    image:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Steering-wheel.jpg",
    imagePosition: "center center",
  },
  {
    id: "digital",
    eyebrow: "02 / DIGITAL",
    title: "Intelligent driver display",
    image:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Dashboard.jpg",
    imagePosition: "center center",
  },
  {
    id: "lighting",
    eyebrow: "03 / LIGHTING",
    title: "Signature LED identity",
    image:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Headlight.jpg",
    imagePosition: "center center",
  },
  {
    id: "design",
    eyebrow: "04 / DESIGN",
    title: "Sculpted exterior detail",
    image:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/Right-front-45-degrees.jpg",
    imagePosition: "center center",
  },
];

/* =========================================================
   COLOUR MATERIAL HELPERS
========================================================= */

const hexToFactor = (hex) => {
  const clean = hex.replace("#", "");

  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
    1,
  ];
};

/*
  The GLB from the previous section uses a material called
  "carpaint", so target that exact material first.
*/
const getCarPaintMaterial = () => {
  const viewer = modelViewer.value;

  if (!viewer?.model?.materials) {
    return null;
  }

  return (
    viewer.model.materials.find(
      (material) =>
        (material.name || "").toLowerCase() === "carpaint"
    ) || null
  );
};

/*
  Safety fallback in case the GLB is replaced later.
*/
const getFallbackBodyMaterials = () => {
  const viewer = modelViewer.value;

  if (!viewer?.model?.materials) {
    return [];
  }

  const keywords = [
    "bodypaint",
    "paint",
    "body",
    "exterior",
    "shell",
  ];

  return viewer.model.materials.filter(
    (material) => {
      const name =
        (material.name || "").toLowerCase();

      return keywords.some((keyword) =>
        name.includes(keyword)
      );
    }
  );
};

const applyMaterialColour = (
  material,
  colour
) => {
  const pbr =
    material?.pbrMetallicRoughness;

  if (!pbr) return;

  pbr.setBaseColorFactor?.(
    hexToFactor(colour.paintHex || colour.hex)
  );

  pbr.setMetallicFactor?.(
    colour.metallic
  );

  pbr.setRoughnessFactor?.(
    colour.roughness
  );
};

const applyVehicleColour = async (
  colour
) => {
  selectedColorId.value =
    colour.id;

  await nextTick();

  if (!modelLoaded.value) {
    return;
  }

  try {
    const exactMaterial =
      getCarPaintMaterial();

    if (exactMaterial) {
      applyMaterialColour(
        exactMaterial,
        colour
      );

      useFilterFallback.value =
        false;

      return;
    }

    const fallbackMaterials =
      getFallbackBodyMaterials();

    if (fallbackMaterials.length) {
      fallbackMaterials.forEach(
        (material) =>
          applyMaterialColour(
            material,
            colour
          )
      );

      useFilterFallback.value =
        false;

      return;
    }
  } catch (error) {
    console.warn(
      "MG exterior colour update failed:",
      error
    );
  }

  /*
    CSS fallback is intentionally only used when no paint
    material can be found.
  */
  useFilterFallback.value =
    true;
};

const modelFilterStyle = computed(() => {
  if (!useFilterFallback.value) {
    return {};
  }

  return {
    filter:
      selectedColour.value.filter,
  };
});

/* =========================================================
   MODEL EVENTS
========================================================= */

const handleModelLoad = async () => {
  modelLoaded.value = true;
  modelLoading.value = false;
  modelError.value = false;

  await nextTick();

  await applyVehicleColour(
    selectedColour.value
  );
};

const handleModelError = (event) => {
  modelLoading.value = false;
  modelError.value = true;

  console.error(
    "MG model failed to load:",
    event
  );
};

/* =========================================================
   RESET
========================================================= */

const resetStage = async () => {
  const silver =
    colours.find(
      (colour) =>
        colour.id === "silver"
    ) || colours[0];

  await applyVehicleColour(silver);

  await nextTick();

  const viewer =
    modelViewer.value;

  if (!viewer) return;

  try {
    viewer.cameraOrbit =
      DEFAULT_CAMERA;

    viewer.fieldOfView =
      "20deg";

    viewer.resetTurntableRotation?.();
  } catch (error) {
    console.warn(
      "MG stage reset:",
      error
    );
  }
};

</script>

<template>
  <section
    ref="stageRef"
    class="mg-model-stage"
  >
    <div
      class="mg-model-stage__frame"
      :style="{
        '--studio-background':
          `url('${studioBackground}')`,
      }"
    >
      <!-- ===================================================
           BACKGROUND
      ==================================================== -->
      <div class="mg-model-stage__backdrop"></div>
      <div class="mg-model-stage__grid"></div>
      <div class="mg-model-stage__ambient"></div>
      <div class="mg-model-stage__floor"></div>

      <!-- ===================================================
           TOP BRAND
      ==================================================== -->
      <div class="mg-model-stage__brand">
        <strong>MG</strong>
        <span>MODEL EXPERIENCE</span>
      </div>

      <!-- ===================================================
           RESET
      ==================================================== -->
      <button
        type="button"
        class="mg-model-stage__reset"
        @click="resetStage"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 12a8 8 0 1 0 2.3-5.6M4 5v4h4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span>Reset view</span>
      </button>

      <!-- ===================================================
           TITLE
      ==================================================== -->
      <header class="mg-model-stage__title">
        <span>100% ELECTRIC</span>

        <h2>MG S5 EV</h2>

        <p>
          Electric confidence,
          redefined.
        </p>

        <a
          href="#showroom"
          class="mg-model-stage__cta"
        >
          Book a test drive
        </a>
      </header>

      <!-- ===================================================
           PREMIUM EXTERIOR PAINT SELECTOR
      ==================================================== -->
      <aside class="mg-model-stage__colours">
        <div class="mg-model-stage__paint-head">
          <div>
            <span>EXTERIOR FINISH</span>

            <strong>
              {{ selectedColour.name }}
            </strong>
          </div>

          <small>
            {{ selectedColourIndex }}
            /
            {{ String(colours.length).padStart(2, "0") }}
          </small>
        </div>

        <div
          class="mg-model-stage__paint-preview"
          :style="{
            '--active-paint':
              selectedColour.hex,
          }"
        >
          <span class="mg-model-stage__paint-orb"></span>

          <div>
            <strong>
              {{ selectedColour.shortName }}
            </strong>

            <small>
              {{ selectedColour.finish }}
              ·
              {{ selectedColour.code }}
            </small>
          </div>
        </div>

        <div class="mg-model-stage__colour-list">
          <button
            v-for="colour in colours"
            :key="colour.id"
            type="button"
            class="mg-model-stage-colour"
            :class="{
              'is-active':
                selectedColorId === colour.id,
            }"
            :aria-label="`Select ${colour.name}`"
            :title="colour.name"
            @click="
              applyVehicleColour(
                colour
              )
            "
          >
            <span
              class="mg-model-stage-colour__chip"
              :style="{
                '--paint':
                  colour.hex,
              }"
            ></span>

            <span
              class="mg-model-stage-colour__label"
            >
              <strong>
                {{ colour.shortName }}
              </strong>

              <small>
                {{ colour.finish }}
              </small>
            </span>

            <i></i>
          </button>
        </div>
      </aside>

      <!-- ===================================================
           RIGHT SPECS
      ==================================================== -->
      <aside class="mg-model-stage__specs">
        <div
          v-for="spec in specs"
          :key="spec.label"
        >
          <strong>
            {{ spec.value }}

            <small v-if="spec.unit">
              {{ spec.unit }}
            </small>
          </strong>

          <span>
            {{ spec.label }}
          </span>
        </div>
      </aside>

      <!-- ===================================================
           3D MODEL
      ==================================================== -->
      <div class="mg-model-stage__vehicle-zone">
        <model-viewer
          ref="modelViewer"
          class="mg-model-stage__model"
          :class="{
            'is-loaded':
              modelLoaded,
          }"
          :style="modelFilterStyle"
          :src="modelPath"
          alt="Interactive MG S5 EV"
          loading="eager"
          reveal="auto"
          camera-controls
          auto-rotate
          auto-rotate-delay="1200"
          rotation-per-second="1.05deg"
          disable-zoom
          disable-pan
          interaction-prompt="none"
          camera-orbit="32deg 82deg 57%"
          min-camera-orbit="auto 75deg 52%"
          max-camera-orbit="auto 86deg 61%"
          camera-target="auto auto auto"
          field-of-view="20deg"
          min-field-of-view="20deg"
          max-field-of-view="20deg"
          interpolation-decay="85"
          orbit-sensitivity="0.65"
          shadow-intensity="1.35"
          shadow-softness="0.8"
          :exposure="modelExposure"
          environment-image="neutral"
          touch-action="pan-y"
          @load="handleModelLoad"
          @error="handleModelError"
        ></model-viewer>

        <!-- SHOWROOM PODIUM -->
        <div class="mg-model-stage__podium">
          <span
            class="
              mg-model-stage__ring
              mg-model-stage__ring--outer
            "
          ></span>

          <span
            class="
              mg-model-stage__ring
              mg-model-stage__ring--middle
            "
          ></span>

          <span
            class="
              mg-model-stage__ring
              mg-model-stage__ring--inner
            "
          ></span>

          <span
            class="mg-model-stage__podium-glow"
          ></span>
        </div>

        <div class="mg-model-stage__shadow"></div>

        <!-- LOADER -->
        <Transition name="model-loader">
          <div
            v-if="
              modelLoading &&
              !modelLoaded &&
              !modelError
            "
            class="mg-model-stage__loader"
          >
            <span></span>

            <strong>
              Preparing your MG
            </strong>
          </div>
        </Transition>

        <!-- ERROR -->
        <div
          v-if="modelError"
          class="mg-model-stage__error"
        >
          <strong>
            Vehicle preview unavailable
          </strong>

          <span>
            Check
            public/models/mg-car.glb
          </span>
        </div>
      </div>

      <!-- ===================================================
           DRAG GUIDE
      ==================================================== -->
      <Transition name="drag-guide">
        <div
          v-if="modelLoaded"
          class="mg-model-stage__drag"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M4 12a8 8 0 0 1 13.7-5.6L20 8.7M20 4v4.7h-4.7M20 12a8 8 0 0 1-13.7 5.6L4 15.3M4 20v-4.7h4.7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span>
            Drag to explore
          </span>
        </div>
      </Transition>

      <!-- ===================================================
           BOTTOM VIDEO CARDS
      ==================================================== -->
      <div class="mg-model-stage__cards">
        <a
          v-for="card in featureCards"
          :key="card.id"
          href="#mg-range"
          class="mg-model-stage-card"
        >
          <img
            class="mg-model-stage-card__image"
            :src="card.image"
            :alt="card.title"
            :style="{
              objectPosition:
                card.imagePosition,
            }"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
          />

          <span
            class="mg-model-stage-card__shade"
          ></span>

          <span
            class="mg-model-stage-card__eyebrow"
          >
            {{ card.eyebrow }}
          </span>

          <strong
            class="mg-model-stage-card__title"
          >
            {{ card.title }}
          </strong>

          <span
            class="mg-model-stage-card__arrow"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M6 18 18 6M9 6h9v9"
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
  </section>
</template>

<style scoped>
@import url(
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
);

/* =========================================================
   FULL-WIDTH SECTION
========================================================= */

.mg-model-stage {
  --red: #e51920;

  position: relative;

  width: 100%;

  overflow: hidden;

  background: #050505;

  font-family:
    "Manrope",
    sans-serif;
}

/*
  FULL WIDTH:
  no outer white gutters
  no max width
  no rounded container
*/
.mg-model-stage__frame {
  position: relative;

  width: 100%;

  height:
    min(
      58vw,
      980px
    );

  min-height: 780px;

  overflow: hidden;

  background: #050505;

  color: #fff;

  isolation: isolate;
}

/* =========================================================
   BACKDROP
========================================================= */

.mg-model-stage__backdrop {
  position: absolute;

  inset: 0;

  z-index: 1;

  background:
    radial-gradient(
      ellipse at 50% 42%,
      #171717 0%,
      #0b0b0b 36%,
      #050505 68%,
      #020202 100%
    );
}

.mg-model-stage__grid {
  position: absolute;

  inset: 0;

  z-index: 2;

  pointer-events: none;

  opacity: .14;

  background:
    linear-gradient(
      rgba(255, 255, 255, .026) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, .026) 1px,
      transparent 1px
    );

  background-size:
    5vw 5vw;

  -webkit-mask-image:
    linear-gradient(
      180deg,
      transparent,
      #000 19%,
      #000 74%,
      transparent
    );

  mask-image:
    linear-gradient(
      180deg,
      transparent,
      #000 19%,
      #000 74%,
      transparent
    );
}

.mg-model-stage__ambient {
  position: absolute;

  left: 50%;
  top: 26%;

  z-index: 3;

  width: 62%;
  height: 41%;

  transform:
    translateX(-50%);

  border-radius: 50%;

  pointer-events: none;

  opacity: .75;

  filter:
    blur(5vw);

  background:
    radial-gradient(
      ellipse,
      rgba(255, 255, 255, .14),
      transparent 69%
    );
}

.mg-model-stage__floor {
  position: absolute;

  left: -7%;
  right: -7%;
  bottom: -15%;

  z-index: 4;

  height: 50%;

  pointer-events: none;

  background:
    radial-gradient(
      ellipse at 50% 0%,
      rgba(255, 255, 255, .1),
      rgba(255, 255, 255, .018) 36%,
      transparent 68%
    );
}

/* =========================================================
   BRAND
========================================================= */

.mg-model-stage__brand {
  position: absolute;

  left: 4.4%;
  top: 3.8%;

  z-index: 90;

  display: flex;

  align-items: baseline;

  gap: .7vw;
}

.mg-model-stage__brand strong {
  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: 1.65vw;

  font-weight: 600;

  letter-spacing: .09em;
}

.mg-model-stage__brand span {
  color:
    rgba(255, 255, 255, .43);

  font-size: .46vw;

  font-weight: 700;

  letter-spacing: .18em;
}

/* =========================================================
   RESET
========================================================= */

.mg-model-stage__reset {
  position: absolute;

  right: 4.4%;
  top: 3.5%;

  z-index: 90;

  height: 2.2vw;

  display: flex;

  align-items: center;

  gap: .48vw;

  padding:
    0
    .9vw;

  border:
    1px solid
    rgba(255, 255, 255, .15);

  border-radius: 999px;

  background:
    rgba(255, 255, 255, .035);

  color:
    rgba(255, 255, 255, .75);

  font:
    inherit;

  font-size: .46vw;

  font-weight: 700;

  letter-spacing: .09em;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background .3s ease,
    color .3s ease;
}

.mg-model-stage__reset:hover {
  background: #fff;

  color: #111;
}

.mg-model-stage__reset svg {
  width: .78vw;
}

/* =========================================================
   TITLE
========================================================= */

.mg-model-stage__title {
  position: absolute;

  left: 50%;
  top: 6.8%;

  z-index: 80;

  width: 38%;

  transform:
    translateX(-50%);

  text-align: center;
}

.mg-model-stage__title > span {
  display: block;

  margin-bottom: .42vw;

  color:
    rgba(255, 255, 255, .43);

  font-size: .46vw;

  font-weight: 700;

  letter-spacing: .17em;
}

.mg-model-stage__title h2 {
  margin: 0;

  font-size: 3.45vw;

  font-weight: 500;

  line-height: 1;

  letter-spacing: -.055em;
}

.mg-model-stage__title p {
  margin:
    .48vw
    0
    0;

  color:
    rgba(255, 255, 255, .56);

  font-size: .82vw;
}

.mg-model-stage__cta {
  min-width: 7.4vw;

  height: 2vw;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  margin-top: .8vw;

  padding:
    0
    1vw;

  border-radius: 999px;

  background: #fff;

  color: #111;

  text-decoration: none;

  font-size: .52vw;

  font-weight: 700;

  letter-spacing: .055em;

  text-transform: uppercase;

  transition:
    background .3s ease,
    color .3s ease,
    transform .3s ease;
}

.mg-model-stage__cta:hover {
  background:
    var(--red);

  color: #fff;

  transform:
    translateY(-2px);
}

/* =========================================================
   PREMIUM EXTERIOR PAINT SELECTOR
========================================================= */

.mg-model-stage__colours {
  position: absolute;

  left: 3.8%;
  top: 16.5%;

  z-index: 88;

  width: 11.6vw;

  min-width: 164px;

  padding: .78vw;

  border:
    1px solid
    rgba(255, 255, 255, .105);

  border-radius: .9vw;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, .075),
      rgba(255, 255, 255, .025)
    );

  box-shadow:
    0 1.4vw 3vw rgba(0, 0, 0, .22),
    inset 0 1px 0 rgba(255, 255, 255, .055);

  backdrop-filter:
    blur(1.1vw)
    saturate(1.08);

  -webkit-backdrop-filter:
    blur(1.1vw)
    saturate(1.08);
}

.mg-model-stage__paint-head {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: .7vw;

  padding:
    .15vw
    .15vw
    .72vw;
}

.mg-model-stage__paint-head > div > span {
  display: block;

  margin-bottom: .28vw;

  color:
    rgba(255, 255, 255, .36);

  font-size: .34vw;

  font-weight: 700;

  letter-spacing: .16em;
}

.mg-model-stage__paint-head > div > strong {
  display: block;

  color: #fff;

  font-size: .62vw;

  font-weight: 550;

  line-height: 1.25;
}

.mg-model-stage__paint-head > small {
  padding-top: .05vw;

  color:
    rgba(255, 255, 255, .33);

  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: .5vw;

  letter-spacing: .08em;
}

.mg-model-stage__paint-preview {
  --active-paint: #B9BEC0;

  position: relative;

  display: flex;

  align-items: center;

  gap: .68vw;

  min-height: 3.2vw;

  margin-bottom: .55vw;

  padding:
    .5vw
    .56vw;

  overflow: hidden;

  border:
    1px solid
    rgba(255, 255, 255, .08);

  border-radius: .65vw;

  background:
    rgba(0, 0, 0, .24);
}

.mg-model-stage__paint-preview::before {
  content: "";

  position: absolute;

  right: -12%;
  top: -90%;

  width: 70%;
  height: 220%;

  border-radius: 50%;

  opacity: .28;

  filter: blur(.8vw);

  background:
    var(--active-paint);

  pointer-events: none;
}

.mg-model-stage__paint-orb {
  position: relative;

  z-index: 2;

  width: 1.75vw;
  height: 1.75vw;

  flex:
    0
    0
    1.75vw;

  border:
    1px solid
    rgba(255, 255, 255, .28);

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 34% 26%,
      rgba(255, 255, 255, .8) 0%,
      rgba(255, 255, 255, .14) 18%,
      transparent 38%
    ),
    var(--active-paint);

  box-shadow:
    inset
    -.16vw
    -.18vw
    .4vw
    rgba(0, 0, 0, .34),
    0
    .25vw
    .7vw
    rgba(0, 0, 0, .32);

  transition:
    background .45s ease,
    box-shadow .45s ease;
}

.mg-model-stage__paint-preview > div {
  position: relative;

  z-index: 2;

  min-width: 0;
}

.mg-model-stage__paint-preview strong {
  display: block;

  color: #fff;

  font-size: .6vw;

  font-weight: 600;
}

.mg-model-stage__paint-preview small {
  display: block;

  margin-top: .14vw;

  color:
    rgba(255, 255, 255, .4);

  font-size: .32vw;

  letter-spacing: .04em;
}

.mg-model-stage__colour-list {
  display: flex;

  flex-direction: column;

  gap: .26vw;
}

.mg-model-stage-colour {
  position: relative;

  width: 100%;

  min-height: 2.15vw;

  display: grid;

  grid-template-columns:
    1.3vw
    minmax(0, 1fr)
    .55vw;

  align-items: center;

  gap: .55vw;

  padding:
    .34vw
    .42vw;

  border:
    1px solid
    transparent;

  border-radius: .56vw;

  background: transparent;

  color:
    rgba(255, 255, 255, .56);

  text-align: left;

  cursor: pointer;

  transition:
    background .28s ease,
    border-color .28s ease,
    color .28s ease,
    transform .28s cubic-bezier(.16, 1, .3, 1);
}

.mg-model-stage-colour:hover {
  color: #fff;

  background:
    rgba(255, 255, 255, .05);

  transform:
    translateX(.08vw);
}

.mg-model-stage-colour.is-active {
  color: #fff;

  border-color:
    rgba(255, 255, 255, .11);

  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, .105),
      rgba(255, 255, 255, .035)
    );
}

.mg-model-stage-colour__chip {
  --paint: #ccc;

  position: relative;

  width: 1.16vw;
  height: 1.16vw;

  display: block;

  border:
    1px solid
    rgba(255, 255, 255, .24);

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 34% 26%,
      rgba(255, 255, 255, .72) 0%,
      rgba(255, 255, 255, .12) 20%,
      transparent 39%
    ),
    var(--paint);

  box-shadow:
    inset
    -.1vw
    -.12vw
    .28vw
    rgba(0, 0, 0, .34);

  transition:
    transform .28s ease,
    box-shadow .28s ease;
}

.mg-model-stage-colour.is-active
.mg-model-stage-colour__chip {
  transform:
    scale(1.08);

  box-shadow:
    inset
    -.1vw
    -.12vw
    .28vw
    rgba(0, 0, 0, .34),
    0
    0
    0
    .14vw
    rgba(255, 255, 255, .095);
}

.mg-model-stage-colour__label {
  min-width: 0;
}

.mg-model-stage-colour__label strong {
  display: block;

  overflow: hidden;

  font-size: .45vw;

  font-weight: 600;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.mg-model-stage-colour__label small {
  display: block;

  margin-top: .08vw;

  color:
    rgba(255, 255, 255, .29);

  font-size: .28vw;

  font-weight: 500;
}

.mg-model-stage-colour i {
  width: .26vw;
  height: .26vw;

  justify-self: center;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, .15);

  transition:
    background .28s ease,
    box-shadow .28s ease,
    transform .28s ease;
}

.mg-model-stage-colour.is-active i {
  background:
    var(--red);

  box-shadow:
    0
    0
    .5vw
    rgba(229, 25, 32, .78);

  transform:
    scale(1.2);
}

/* =========================================================
   RIGHT SPECS
========================================================= */

.mg-model-stage__specs {
  position: absolute;

  right: 4.8%;
  top: 18.5%;

  z-index: 80;

  width: 11%;

  display: flex;

  flex-direction: column;

  gap: 1.5vw;

  text-align: right;
}

.mg-model-stage__specs div {
  display: flex;

  flex-direction: column;

  align-items: flex-end;
}

.mg-model-stage__specs strong {
  font-family:
    "Barlow Condensed",
    sans-serif;

  font-size: 2vw;

  font-weight: 500;

  line-height: .92;

  letter-spacing: -.02em;
}

.mg-model-stage__specs strong small {
  margin-left: .13vw;

  font-family:
    "Manrope",
    sans-serif;

  font-size: .56vw;

  color:
    rgba(255, 255, 255, .56);
}

.mg-model-stage__specs span {
  margin-top: .3vw;

  color:
    rgba(255, 255, 255, .4);

  font-size: .52vw;
}

/* =========================================================
   3D VEHICLE ZONE
========================================================= */

.mg-model-stage__vehicle-zone {
  position: absolute;

  left: 17%;
  top: 13.8%;

  z-index: 25;

  width: 66%;
  height: 53%;
}

.mg-model-stage__model {
  position: absolute;

  inset: 0;

  z-index: 30;

  width: 100%;
  height: 100%;

  display: block;

  opacity: 0;

  transform:
    translateY(.7vw)
    scale(.985);

  background:
    transparent;

  --poster-color:
    transparent;

  transition:
    opacity .7s ease,
    transform 1s cubic-bezier(.16, 1, .3, 1),
    filter .35s ease;
}

.mg-model-stage__model.is-loaded {
  opacity: 1;

  transform:
    translateY(0)
    scale(1);
}

/* =========================================================
   PODIUM
========================================================= */

.mg-model-stage__podium {
  position: absolute;

  left: 50%;
  top: 77%;

  z-index: 12;

  width: 62%;
  height: 13.5%;

  transform:
    translateX(-50%);

  pointer-events: none;
}

.mg-model-stage__ring {
  position: absolute;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  border:
    1px solid
    rgba(255, 255, 255, .18);
}

.mg-model-stage__ring--outer {
  width: 100%;
  height: 100%;

  border-color:
    rgba(255, 255, 255, .4);

  box-shadow:
    0
    0
    1.3vw
    rgba(255, 255, 255, .04);
}

.mg-model-stage__ring--middle {
  width: 84%;
  height: 67%;

  border-color:
    rgba(255, 255, 255, .11);
}

.mg-model-stage__ring--inner {
  width: 67%;
  height: 40%;

  border-color:
    rgba(229, 25, 32, .17);
}

.mg-model-stage__podium-glow {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 81%;
  height: 55%;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  filter:
    blur(1.05vw);

  background:
    radial-gradient(
      ellipse,
      rgba(255, 255, 255, .16),
      rgba(229, 25, 32, .05) 44%,
      transparent 74%
    );
}

.mg-model-stage__shadow {
  position: absolute;

  left: 50%;
  top: 79%;

  z-index: 8;

  width: 43%;
  height: 7%;

  transform:
    translateX(-50%);

  border-radius: 50%;

  background:
    rgba(0, 0, 0, .88);

  filter:
    blur(1.25vw);
}

/* =========================================================
   MODEL LOADER
========================================================= */

.mg-model-stage__loader,
.mg-model-stage__error {
  position: absolute;

  left: 50%;
  top: 51%;

  z-index: 45;

  transform:
    translate(-50%, -50%);

  text-align: center;
}

.mg-model-stage__loader > span {
  width: 2.5vw;
  height: 2.5vw;

  display: block;

  margin:
    0
    auto
    .7vw;

  border:
    1px solid
    rgba(255, 255, 255, .15);

  border-top-color:
    var(--red);

  border-radius: 50%;

  animation:
    mgStageSpin
    1.1s
    linear
    infinite;
}

@keyframes mgStageSpin {
  to {
    transform:
      rotate(360deg);
  }
}

.mg-model-stage__loader strong,
.mg-model-stage__error strong {
  display: block;

  font-size: .5vw;

  font-weight: 600;
}

.mg-model-stage__error span {
  display: block;

  margin-top: .28vw;

  color:
    rgba(255, 255, 255, .4);

  font-size: .34vw;
}

.model-loader-leave-active {
  transition:
    opacity .3s ease;
}

.model-loader-leave-to {
  opacity: 0;
}

/* =========================================================
   DRAG GUIDE
========================================================= */

.mg-model-stage__drag {
  position: absolute;

  left: 50%;
  top: 62.5%;

  z-index: 80;

  display: flex;

  align-items: center;

  gap: .38vw;

  transform:
    translateX(-50%);

  color:
    rgba(255, 255, 255, .32);

  pointer-events: none;
}

.mg-model-stage__drag svg {
  width: .82vw;
  height: .82vw;
}

.mg-model-stage__drag span {
  font-size: .46vw;

  font-weight: 600;

  letter-spacing: .06em;
}

.drag-guide-enter-active,
.drag-guide-leave-active {
  transition:
    opacity .35s ease;
}

.drag-guide-enter-from,
.drag-guide-leave-to {
  opacity: 0;
}

/* =========================================================
   BOTTOM CINEMATIC CARDS
========================================================= */

.mg-model-stage__cards {
  position: absolute;

  left: 15.5%;
  right: 4.5%;
  bottom: 2.6%;

  z-index: 70;

  height: 26.5%;

  display: grid;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  gap: .58vw;
}

.mg-model-stage-card {
  position: relative;

  min-width: 0;

  overflow: hidden;

  border:
    1px solid
    rgba(255, 255, 255, .12);

  border-radius: .32vw;

  background:
    #101010;

  color: #fff;

  text-decoration: none;

  isolation: isolate;

  transition:
    transform .5s cubic-bezier(.16, 1, .3, 1),
    border-color .3s ease;
}

.mg-model-stage-card:hover {
  transform:
    translateY(-.4vw);

  border-color:
    rgba(255, 255, 255, .3);
}

.mg-model-stage-card__image {
  position: absolute;

  inset: 0;

  z-index: 2;

  width: 100%;
  height: 100%;

  object-fit: cover;

  opacity: .88;

  filter:
    saturate(.82)
    contrast(1.08)
    brightness(.67);

  transform:
    scale(1.025);

  transition:
    transform .85s cubic-bezier(.16, 1, .3, 1),
    filter .45s ease,
    opacity .45s ease;
}

.mg-model-stage-card:hover
.mg-model-stage-card__image {
  opacity: 1;

  transform:
    scale(1.07);

  filter:
    saturate(.98)
    contrast(1.06)
    brightness(.78);
}

.mg-model-stage-card__shade {
  position: absolute;

  inset: 0;

  z-index: 3;

  pointer-events: none;

  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, .04),
      rgba(0, 0, 0, .12) 40%,
      rgba(0, 0, 0, .8) 100%
    );
}

.mg-model-stage-card__eyebrow {
  position: absolute;

  left: .82vw;
  top: .78vw;

  z-index: 4;

  color:
    rgba(255, 255, 255, .52);

  font-size: .38vw;

  font-weight: 700;

  letter-spacing: .14em;
}

.mg-model-stage-card__title {
  position: absolute;

  left: .82vw;
  right: 2.7vw;
  bottom: .86vw;

  z-index: 4;

  font-size: .84vw;

  font-weight: 500;
}

.mg-model-stage-card__arrow {
  position: absolute;

  right: .8vw;
  bottom: .72vw;

  z-index: 4;

  width: 1.82vw;
  height: 1.82vw;

  display: grid;

  place-items: center;

  border:
    1px solid
    rgba(255, 255, 255, .23);

  border-radius: 50%;

  background:
    rgba(0, 0, 0, .22);

  backdrop-filter:
    blur(.5vw);

  -webkit-backdrop-filter:
    blur(.5vw);
}

.mg-model-stage-card__arrow svg {
  width: .74vw;
}


/* =========================================================
   PREMIUM CARD FINISH
========================================================= */

.mg-model-stage-card::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 3;

  pointer-events: none;

  border-radius: inherit;

  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .025),
    inset 0 1px 0 rgba(255, 255, 255, .06);
}

.mg-model-stage-card::after {
  content: "";

  position: absolute;

  left: .82vw;
  right: .82vw;
  bottom: 0;

  z-index: 5;

  height: 2px;

  background:
    linear-gradient(
      90deg,
      var(--red),
      rgba(229, 25, 32, 0)
    );

  opacity: 0;

  transform: scaleX(.25);

  transform-origin: left center;

  transition:
    opacity .35s ease,
    transform .5s cubic-bezier(.16, 1, .3, 1);
}

.mg-model-stage-card:hover::after {
  opacity: 1;

  transform: scaleX(1);
}

/* =========================================================
   LARGE DESKTOP
========================================================= */

@media (min-width: 1800px) {
  .mg-model-stage__frame {
    height: 56vw;

    min-height: 880px;
  }

  .mg-model-stage__title h2 {
    font-size: 2.7vw;
  }

  .mg-model-stage__vehicle-zone {
    left: 18%;

    width: 64%;
  }

  .mg-model-stage__cards {
    left: 19%;
    right: 6%;
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {
  .mg-model-stage__frame {
    height: 820px;

    min-height: 820px;
  }

  .mg-model-stage__brand {
    left: 28px;
    top: 28px;
  }

  .mg-model-stage__brand strong {
    font-size: 22px;
  }

  .mg-model-stage__brand span {
    font-size: 6px;
  }

  .mg-model-stage__reset {
    right: 28px;
    top: 25px;

    height: 34px;

    padding:
      0
      13px;

    gap: 7px;

    font-size: 6px;
  }

  .mg-model-stage__reset svg {
    width: 12px;
  }

  .mg-model-stage__title {
    top: 68px;

    width: 44%;
  }

  .mg-model-stage__title h2 {
    font-size: 38px;
  }

  .mg-model-stage__title > span {
    font-size: 6px;
  }

  .mg-model-stage__title p {
    font-size: 9px;
  }

  .mg-model-stage__cta {
    min-width: 118px;

    height: 32px;

    font-size: 7px;
  }

  .mg-model-stage__colours {
    left: 28px;
    top: 170px;

    width: 110px;

    min-width: 0;
  }

  .mg-model-stage__colour-copy > span {
    font-size: 5px;
  }

  .mg-model-stage__colour-copy strong {
    font-size: 8px;
  }

  .mg-model-stage__colour-copy small {
    font-size: 7px;
  }

  .mg-model-stage__colour-line {
    left: 11px;
    top: 69px;
  }

  .mg-model-stage__colour-list {
    gap: 8px;
  }

  .mg-model-stage-colour {
    width: 23px;
    height: 23px;

    flex-basis: 23px;
  }

  .mg-model-stage-colour > span {
    inset: 4px;
  }

  .mg-model-stage-colour.is-active::before {
    left: -10px;

    width: 3px;
    height: 3px;
  }

  .mg-model-stage__specs {
    right: 28px;
    top: 170px;

    width: 110px;

    gap: 20px;
  }

  .mg-model-stage__specs strong {
    font-size: 25px;
  }

  .mg-model-stage__specs span {
    font-size: 7px;
  }

  .mg-model-stage__vehicle-zone {
    left: 9%;
    top: 140px;

    width: 82%;
    height: 450px;
  }

  .mg-model-stage__drag {
    top: 560px;
  }

  .mg-model-stage__drag span {
    font-size: 6px;
  }

  .mg-model-stage__drag svg {
    width: 13px;
  }

  .mg-model-stage__cards {
    left: 14%;
    right: 3%;

    bottom: 24px;

    height: 205px;

    gap: 7px;
  }

  .mg-model-stage-card__title {
    font-size: 10px;
  }

  .mg-model-stage-card__eyebrow {
    font-size: 6px;
  }

  .mg-model-stage-card__arrow {
    width: 28px;
    height: 28px;
  }

  .mg-model-stage-card__arrow svg {
    width: 11px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .mg-model-stage__frame {
    height: 940px;

    min-height: 940px;
  }

  .mg-model-stage__brand {
    left: 15px;
    top: 18px;
  }

  .mg-model-stage__brand span {
    display: none;
  }

  .mg-model-stage__reset {
    right: 15px;
    top: 16px;

    width: 36px;
    height: 36px;

    justify-content: center;

    padding: 0;
  }

  .mg-model-stage__reset span {
    display: none;
  }

  .mg-model-stage__reset svg {
    width: 13px;
  }

  .mg-model-stage__title {
    top: 68px;

    width:
      calc(
        100% - 50px
      );
  }

  .mg-model-stage__title h2 {
    font-size: 35px;
  }

  .mg-model-stage__title > span {
    font-size: 6px;
  }

  .mg-model-stage__title p {
    font-size: 8px;
  }

  .mg-model-stage__cta {
    min-width: 124px;

    height: 34px;

    margin-top: 10px;

    font-size: 7px;
  }

  /* Horizontal colour strip */
  .mg-model-stage__colours {
    left: 15px;
    right: 15px;
    top: 178px;

    width: auto;

    display: grid;

    grid-template-columns:
      auto
      1fr;

    align-items: center;

    gap: 15px;
  }

  .mg-model-stage__colour-copy {
    margin: 0;
  }

  .mg-model-stage__colour-copy > span {
    font-size: 5px;
  }

  .mg-model-stage__colour-copy strong {
    max-width: 90px;

    font-size: 7px;
  }

  .mg-model-stage__colour-copy small {
    margin-top: 3px;

    font-size: 6px;
  }

  .mg-model-stage__colour-line {
    display: none;
  }

  .mg-model-stage__colour-list {
    flex-direction: row;

    justify-content: flex-end;

    gap: 5px;
  }

  .mg-model-stage-colour {
    width: 24px;
    height: 24px;

    flex-basis: 24px;
  }

  .mg-model-stage-colour > span {
    inset: 4px;
  }

  .mg-model-stage-colour i,
  .mg-model-stage-colour.is-active::before {
    display: none;
  }

  .mg-model-stage__vehicle-zone {
    left: -13%;
    top: 205px;

    width: 126%;
    height: 400px;
  }

  .mg-model-stage__podium {
    top: 77%;

    width: 70%;
  }

  .mg-model-stage__specs {
    left: 15px;
    right: auto;
    top: 585px;

    width: auto;

    flex-direction: row;

    gap: 18px;

    text-align: left;
  }

  .mg-model-stage__specs div {
    align-items: flex-start;
  }

  .mg-model-stage__specs strong {
    font-size: 20px;
  }

  .mg-model-stage__specs span {
    font-size: 6px;
  }

  .mg-model-stage__drag {
    top: 550px;
  }

  .mg-model-stage__cards {
    left: 15px;
    right: 15px;
    bottom: 24px;

    height: 220px;

    grid-template-columns: none;

    grid-auto-flow: column;

    grid-auto-columns: 76%;

    gap: 8px;

    overflow-x: auto;

    scroll-snap-type:
      x
      proximity;

    scrollbar-width: none;
  }

  .mg-model-stage__cards::-webkit-scrollbar {
    display: none;
  }

  .mg-model-stage-card {
    scroll-snap-align: center;

    border-radius: 7px;
  }

  .mg-model-stage-card__eyebrow {
    left: 10px;
    top: 9px;

    font-size: 6px;
  }

  .mg-model-stage-card__title {
    left: 10px;
    right: 44px;
    bottom: 11px;

    font-size: 13px;
  }

  .mg-model-stage-card__arrow {
    right: 10px;
    bottom: 9px;

    width: 30px;
    height: 30px;
  }

  .mg-model-stage-card__arrow svg {
    width: 12px;
  }

  .mg-model-stage__loader > span {
    width: 38px;
    height: 38px;
  }

  .mg-model-stage__loader strong,
  .mg-model-stage__error strong {
    font-size: 8px;
  }

  .mg-model-stage__error span {
    font-size: 6px;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 420px) {
  .mg-model-stage__frame {
    height: 900px;

    min-height: 900px;
  }

  .mg-model-stage__title {
    top: 64px;
  }

  .mg-model-stage__title h2 {
    font-size: 32px;
  }

  .mg-model-stage__colours {
    top: 165px;
  }

  .mg-model-stage__vehicle-zone {
    top: 194px;

    height: 380px;
  }

  .mg-model-stage__specs {
    top: 555px;
  }

  .mg-model-stage__drag {
    top: 525px;
  }

  .mg-model-stage__cards {
    height: 195px;

    bottom: 26px;
  }
}


/* =========================================================
   ONE-SECTION / 100VH FINAL LAYOUT
   ---------------------------------------------------------
   The model area + premium image cards now live inside one
   continuous viewport. No visual break / second-section feel.
========================================================= */

.mg-model-stage {
  height: 100vh;
  min-height: 100vh;
  background: #050505;
}

.mg-model-stage__frame {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  max-height: none;
  background: #050505;
}

/*
  This lower atmosphere visually connects the podium/model
  area to the image-card row so there is no hard split.
*/
.mg-model-stage__frame::after {
  content: "";

  position: absolute;

  left: 0;
  right: 0;
  top: 49%;
  bottom: 0;

  z-index: 5;

  pointer-events: none;

  background:
    radial-gradient(
      ellipse at 50% 16%,
      rgba(255, 255, 255, .055) 0%,
      rgba(255, 255, 255, .018) 28%,
      transparent 58%
    ),
    linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 255, 255, .008) 30%,
      rgba(255, 255, 255, .018) 100%
    );
}

/* Keep primary content above the connecting atmosphere. */
.mg-model-stage__brand,
.mg-model-stage__reset,
.mg-model-stage__title,
.mg-model-stage__colours,
.mg-model-stage__specs,
.mg-model-stage__vehicle-zone,
.mg-model-stage__drag,
.mg-model-stage__cards {
  position: absolute;
}

/* =========================================================
   DESKTOP / LARGE SCREEN
========================================================= */

@media (min-width: 1101px) {
  .mg-model-stage__brand {
    top: 3.1%;
  }

  .mg-model-stage__reset {
    top: 2.8%;
  }

  .mg-model-stage__title {
    top: 4.2%;
  }

  .mg-model-stage__title > span {
    margin-bottom: .32vw;
  }

  .mg-model-stage__title h2 {
    font-size: 3.15vw;
  }

  .mg-model-stage__title p {
    margin-top: .36vw;
    font-size: .76vw;
  }

  .mg-model-stage__cta {
    height: 1.82vw;
    margin-top: .62vw;
  }

  /* Left colour rail stays inside the same visual stage. */
  .mg-model-stage__colours {
    left: 4.2%;
    top: 17%;
  }

  .mg-model-stage__specs {
    right: 4.2%;
    top: 17%;
  }

  /* Model gets a little more vertical room but remains above cards. */
  .mg-model-stage__vehicle-zone {
    left: 13.5%;
    top: 10.2%;
    width: 73%;
    height: 55%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(-.2vw)
      scale(1.045);
  }

  .mg-model-stage__podium {
    top: 79%;
    width: 64%;
    height: 14%;
  }

  .mg-model-stage__shadow {
    top: 81%;
    width: 44%;
  }

  /* Drag hint now sits just above the premium card rail. */
  .mg-model-stage__drag {
    top: 61.2%;
  }

  /*
    Main fix:
    cards begin inside the model stage instead of reading like
    a separate block below it.
  */
  .mg-model-stage__cards {
    left: 14.5%;
    right: 4%;
    top: 64.2%;
    bottom: auto;

    height: 31.2%;

    gap: .6vw;

    background: transparent;
  }

  .mg-model-stage-card {
    border-radius: .42vw;

    box-shadow:
      0 1.2vw 2.8vw rgba(0, 0, 0, .2),
      inset 0 0 0 1px rgba(255, 255, 255, .018);

    backdrop-filter: blur(.15vw);
    -webkit-backdrop-filter: blur(.15vw);
  }

  .mg-model-stage-card__image {
    opacity: .92;

    filter:
      saturate(.84)
      contrast(1.07)
      brightness(.7);
  }

  .mg-model-stage-card:hover
  .mg-model-stage-card__image {
    opacity: 1;

    filter:
      saturate(1)
      contrast(1.06)
      brightness(.8);
  }

  .mg-model-stage-card__shade {
    background:
      linear-gradient(
        180deg,
        rgba(0, 0, 0, .035),
        rgba(0, 0, 0, .06) 35%,
        rgba(0, 0, 0, .76) 100%
      );
  }

  .mg-model-stage-card__eyebrow {
    left: .9vw;
    top: .82vw;

    font-size: .37vw;
  }

  .mg-model-stage-card__title {
    left: .9vw;
    right: 3vw;
    bottom: .92vw;

    font-size: .82vw;
  }

  .mg-model-stage-card__arrow {
    right: .82vw;
    bottom: .78vw;

    width: 1.8vw;
    height: 1.8vw;
  }
}

/* =========================================================
   SHORT DESKTOPS / LAPTOPS
   Still exactly one viewport high.
========================================================= */

@media (min-width: 768px) and (max-width: 1100px) {
  .mg-model-stage {
    height: 100vh;
    min-height: 100vh;
  }

  .mg-model-stage__frame {
    height: 100vh;
    min-height: 100vh;
  }

  .mg-model-stage__brand {
    top: 3%;
  }

  .mg-model-stage__reset {
    top: 2.7%;
  }

  .mg-model-stage__title {
    top: 5.8%;
  }

  .mg-model-stage__colours {
    top: 18%;
  }

  .mg-model-stage__specs {
    top: 18%;
  }

  .mg-model-stage__vehicle-zone {
    left: 7%;
    top: 12.5%;
    width: 86%;
    height: 52%;
  }

  .mg-model-stage__drag {
    top: 59.5%;
  }

  .mg-model-stage__cards {
    left: 13%;
    right: 3%;
    top: 64%;
    bottom: auto;

    height: 31.5%;

    gap: 7px;
  }
}

/* =========================================================
   MOBILE
   Still one complete viewport section.
========================================================= */

@media (max-width: 767px) {
  .mg-model-stage {
    height: 100svh;
    min-height: 100svh;
  }

  .mg-model-stage__frame {
    width: 100%;
    height: 100svh;
    min-height: 100svh;
    max-height: none;
  }

  .mg-model-stage__brand {
    top: 2%;
  }

  .mg-model-stage__reset {
    top: 1.7%;
  }

  .mg-model-stage__title {
    top: 6.5%;
  }

  .mg-model-stage__title h2 {
    font-size: 8.3vw;
  }

  .mg-model-stage__title p {
    font-size: 2.2vw;
  }

  .mg-model-stage__colours {
    top: 17.5%;
  }

  .mg-model-stage__vehicle-zone {
    left: -15%;
    top: 19.8%;
    width: 130%;
    height: 41.5%;
  }

  .mg-model-stage__specs {
    left: 15px;
    right: 15px;
    top: 57%;

    width: auto;

    display: grid;
    grid-template-columns:
      repeat(4, minmax(0, 1fr));

    gap: 8px;
  }

  .mg-model-stage__specs div {
    min-width: 0;
  }

  .mg-model-stage__specs strong {
    font-size: 4.4vw;
  }

  .mg-model-stage__specs span {
    font-size: 1.4vw;
  }

  .mg-model-stage__drag {
    top: 53.8%;
  }

  .mg-model-stage__cards {
    left: 15px;
    right: 15px;
    top: 66%;
    bottom: auto;

    height: 30%;

    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: 73%;

    gap: 8px;

    overflow-x: auto;

    scroll-snap-type: x proximity;
  }

  .mg-model-stage-card {
    height: 100%;
  }
}

/* Very short mobile screens: preserve 100svh and compact controls. */
@media (max-width: 767px) and (max-height: 700px) {
  .mg-model-stage__title {
    top: 5.2%;
  }

  .mg-model-stage__title p {
    display: none;
  }

  .mg-model-stage__cta {
    margin-top: 6px;
  }

  .mg-model-stage__colours {
    top: 15.5%;
  }

  .mg-model-stage__vehicle-zone {
    top: 18%;
    height: 39%;
  }

  .mg-model-stage__specs {
    top: 54.5%;
  }

  .mg-model-stage__drag {
    top: 51.8%;
  }

  .mg-model-stage__cards {
    top: 63.5%;
    height: 33%;
  }
}



/* =========================================================
   PREMIUM PAINT SELECTOR — RESPONSIVE
========================================================= */

@media (max-width: 1100px) and (min-width: 768px) {
  .mg-model-stage__colours {
    left: 22px;
    top: 17.5%;

    width: 150px;
    min-width: 150px;

    padding: 10px;

    border-radius: 12px;
  }

  .mg-model-stage__paint-head {
    padding: 2px 2px 10px;
  }

  .mg-model-stage__paint-head > div > span {
    font-size: 5px;
  }

  .mg-model-stage__paint-head > div > strong {
    font-size: 8px;
  }

  .mg-model-stage__paint-head > small {
    font-size: 7px;
  }

  .mg-model-stage__paint-preview {
    min-height: 44px;

    gap: 9px;

    margin-bottom: 7px;

    padding: 7px;

    border-radius: 9px;
  }

  .mg-model-stage__paint-orb {
    width: 24px;
    height: 24px;

    flex-basis: 24px;
  }

  .mg-model-stage__paint-preview strong {
    font-size: 8px;
  }

  .mg-model-stage__paint-preview small {
    font-size: 5px;
  }

  .mg-model-stage__colour-list {
    gap: 4px;
  }

  .mg-model-stage-colour {
    min-height: 31px;

    grid-template-columns:
      18px
      1fr
      7px;

    gap: 7px;

    padding: 5px 6px;

    border-radius: 8px;
  }

  .mg-model-stage-colour__chip {
    width: 17px;
    height: 17px;
  }

  .mg-model-stage-colour__label strong {
    font-size: 7px;
  }

  .mg-model-stage-colour__label small {
    font-size: 5px;
  }

  .mg-model-stage-colour i {
    width: 4px;
    height: 4px;
  }
}

@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 15px;
    right: 15px;
    top: 16.2%;

    width: auto;
    min-width: 0;

    padding: 7px;

    border-radius: 12px;

    display: grid;

    grid-template-columns:
      105px
      minmax(0, 1fr);

    gap: 8px;

    align-items: stretch;
  }

  .mg-model-stage__paint-head {
    display: none;
  }

  .mg-model-stage__paint-preview {
    min-height: 100%;

    margin: 0;

    padding: 7px;

    border-radius: 8px;
  }

  .mg-model-stage__paint-orb {
    width: 26px;
    height: 26px;

    flex-basis: 26px;
  }

  .mg-model-stage__paint-preview strong {
    font-size: 8px;
  }

  .mg-model-stage__paint-preview small {
    font-size: 5px;
  }

  .mg-model-stage__colour-list {
    min-width: 0;

    flex-direction: row;

    align-items: center;

    justify-content: flex-end;

    gap: 4px;
  }

  .mg-model-stage-colour {
    width: 31px;
    min-height: 31px;

    display: grid;

    grid-template-columns: 1fr;

    place-items: center;

    padding: 4px;

    border-radius: 50%;
  }

  .mg-model-stage-colour__chip {
    width: 20px;
    height: 20px;
  }

  .mg-model-stage-colour__label,
  .mg-model-stage-colour i {
    display: none;
  }
}



/* =========================================================
   TITLE / MODEL SPACING FIX
   Keeps the larger vehicle, but creates a deliberate premium
   breathing zone between the CTA and the vehicle roofline.
========================================================= */

@media (min-width: 1101px) {
  /* Keep the heading slightly higher and more compact. */
  .mg-model-stage__title {
    top: 3.9%;
  }

  .mg-model-stage__title > span {
    margin-bottom: .28vw;
  }

  .mg-model-stage__title h2 {
    line-height: .94;
  }

  .mg-model-stage__title p {
    margin-top: .32vw;
  }

  .mg-model-stage__cta {
    margin-top: .55vw;
  }

  /*
    Main fix:
    The model viewport begins lower, but its bottom edge stays
    nearly where it was. This creates space above the vehicle
    without shrinking the overall visual presence.
  */
  .mg-model-stage__vehicle-zone {
    left: 13.5%;
    top: 15.6%;
    width: 73%;
    height: 49.8%;
  }

  /*
    Preserve the strong, large vehicle look while pushing the
    actual rendered car slightly lower inside its viewport.
  */
  .mg-model-stage__model {
    transform:
      translateY(1vw)
      scale(1.02);
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(.72vw)
      scale(1.065);
  }

  /* Podium remains visually connected to the vehicle. */
  .mg-model-stage__podium {
    top: 80.5%;
  }

  .mg-model-stage__shadow {
    top: 82%;
  }

  /* Small separation before the image-card rail. */
  .mg-model-stage__drag {
    top: 62.2%;
  }

  .mg-model-stage__cards {
    top: 65.1%;
    height: 30.3%;
  }
}

/* =========================================================
   TABLET SPACING
========================================================= */

@media (min-width: 768px) and (max-width: 1100px) {
  .mg-model-stage__title {
    top: 4.8%;
  }

  .mg-model-stage__vehicle-zone {
    left: 7%;
    top: 17%;
    width: 86%;
    height: 47%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(7px)
      scale(1.035);
  }

  .mg-model-stage__drag {
    top: 59.8%;
  }

  .mg-model-stage__cards {
    top: 64.8%;
    height: 30.6%;
  }
}

/* =========================================================
   MOBILE SPACING
========================================================= */

@media (max-width: 767px) {
  .mg-model-stage__title {
    top: 5.6%;
  }

  .mg-model-stage__vehicle-zone {
    left: -15%;
    top: 22.2%;
    width: 130%;
    height: 39.3%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(5px)
      scale(1.035);
  }

  .mg-model-stage__drag {
    top: 54.7%;
  }

  .mg-model-stage__specs {
    top: 57.8%;
  }

  .mg-model-stage__cards {
    top: 66.8%;
    height: 29%;
  }
}

@media (max-width: 767px) and (max-height: 700px) {
  .mg-model-stage__title {
    top: 4.6%;
  }

  .mg-model-stage__vehicle-zone {
    top: 20%;
    height: 38%;
  }

  .mg-model-stage__drag {
    top: 51.8%;
  }

  .mg-model-stage__specs {
    top: 54.6%;
  }

  .mg-model-stage__cards {
    top: 64%;
    height: 32%;
  }
}



/* =========================================================
   WARM STUDIO BACKGROUND
   Inspired by a premium beige cyclorama / studio-floor setup,
   without adding any car image into the background.
========================================================= */

.mg-model-stage {
  background: #15100d;
}

.mg-model-stage__frame {
  background:
    linear-gradient(
      180deg,
      #e3c0ac 0%,
      #e1bcaa 44%,
      #d2ab97 56%,
      #9e6f5b 56.4%,
      #8c5e4d 68%,
      #6b4537 100%
    );
}

/* Main studio wall + tonal shaping */
.mg-model-stage__backdrop {
  background:
    radial-gradient(
      ellipse at 50% 18%,
      rgba(255, 245, 238, .42) 0%,
      rgba(255, 232, 219, .18) 22%,
      rgba(227, 192, 172, 0) 54%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, .06) 0%,
      rgba(255, 255, 255, .015) 24%,
      transparent 40%
    ),
    linear-gradient(
      180deg,
      #e3c0ac 0%,
      #dfbaa7 47%,
      #d5af9a 55%,
      transparent 56%
    );
}

/* Remove the black tech-grid feel */
.mg-model-stage__grid {
  opacity: 0;
}

/* Soft studio glow behind the vehicle */
.mg-model-stage__ambient {
  left: 50%;
  top: 25%;

  width: 72%;
  height: 34%;

  opacity: .9;

  filter: blur(4.2vw);

  background:
    radial-gradient(
      ellipse,
      rgba(255, 249, 244, .36) 0%,
      rgba(255, 234, 220, .12) 34%,
      transparent 72%
    );
}

/* Warm reflective floor */
.mg-model-stage__floor {
  left: -3%;
  right: -3%;
  bottom: -4%;

  height: 48%;

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, .02) 5%,
      rgba(255, 255, 255, .045) 8%,
      rgba(255, 255, 255, 0) 11%
    ),
    linear-gradient(
      180deg,
      rgba(125, 82, 64, .12) 0%,
      rgba(84, 52, 41, .22) 34%,
      rgba(42, 22, 16, .38) 100%
    );
}

/* Horizon seam + floor panel accent similar to the reference */
.mg-model-stage__frame::before {
  content: "";

  position: absolute;

  left: 0;
  right: 0;
  top: 55.9%;

  z-index: 6;

  height: 2px;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(32, 17, 12, .55) 18%,
      rgba(70, 40, 28, .72) 50%,
      rgba(32, 17, 12, .55) 82%,
      rgba(0, 0, 0, 0) 100%
    );

  opacity: .72;
}

.mg-model-stage__frame::after {
  content: "";

  position: absolute;

  right: 0;
  bottom: 0;

  z-index: 6;

  width: 22%;
  height: 28%;

  pointer-events: none;

  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, .14) 0%,
      rgba(255, 255, 255, .08) 22%,
      rgba(255, 255, 255, 0) 23%
    );

  opacity: .42;
}

/* Keep UI readable against the lighter studio wall */
.mg-model-stage__brand span,
.mg-model-stage__title > span,
.mg-model-stage__title p {
  color: rgba(255, 255, 255, .7);
}

.mg-model-stage__brand strong,
.mg-model-stage__title h2 {
  color: #fff;
}

/* Make the podium ring work with the warmer studio environment */
.mg-model-stage__podium {
  border-color: rgba(255, 255, 255, .32);

  background:
    radial-gradient(
      ellipse at center,
      rgba(229, 25, 32, .22) 0%,
      rgba(229, 25, 32, .08) 30%,
      rgba(255, 255, 255, .08) 52%,
      transparent 76%
    );
}

.mg-model-stage__shadow {
  background:
    radial-gradient(
      ellipse,
      rgba(52, 18, 11, .36) 0%,
      rgba(52, 18, 11, .16) 42%,
      transparent 78%
    );
}

/* Premium floating panel look so cards still sit nicely on the new studio bg */
.mg-model-stage-card {
  background: rgba(18, 14, 13, .4);
  border-color: rgba(255, 255, 255, .08);
}

.mg-model-stage-card__shade {
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, .02),
      rgba(0, 0, 0, .08) 35%,
      rgba(0, 0, 0, .72) 100%
    );
}

/* Responsive refinement */
@media (max-width: 767px) {
  .mg-model-stage__frame {
    background:
      linear-gradient(
        180deg,
        #e4c1ad 0%,
        #dfb9a6 46%,
        #d1aa96 56%,
        #9b6d5a 56.4%,
        #805543 69%,
        #633f31 100%
      );
  }

  .mg-model-stage__frame::after {
    width: 34%;
    height: 18%;
    opacity: .34;
  }

  .mg-model-stage__ambient {
    width: 92%;
    top: 26%;
  }
}



/* =========================================================
   FINAL BACKGROUND IMAGE
   Uses:
   public/images/Generated Image August 24, 2026 - 12_44PM.jpg
========================================================= */

.mg-model-stage__frame {
  background:
    #120f0d;
}

/*
  Actual generated studio image.
  It fills the full 100vh showcase.
*/
.mg-model-stage__backdrop {
  background:
    linear-gradient(
      180deg,
      rgba(5, 5, 5, .06) 0%,
      rgba(5, 5, 5, .015) 42%,
      rgba(5, 5, 5, .10) 67%,
      rgba(5, 5, 5, .22) 100%
    ),
    var(--studio-background)
    center center
    /
    cover
    no-repeat;
}

/*
  Remove the artificial warm wall/floor gradients because the
  supplied image already contains the complete studio environment.
*/
.mg-model-stage__ambient {
  opacity: .24;

  background:
    radial-gradient(
      ellipse,
      rgba(255, 255, 255, .10),
      transparent 70%
    );
}

.mg-model-stage__floor {
  background:
    linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, .03) 45%,
      rgba(0, 0, 0, .18) 100%
    );
}

/* Disable previously generated fake studio seams/panels. */
.mg-model-stage__frame::before,
.mg-model-stage__frame::after {
  display: none;
}

/* Keep UI readable regardless of bright areas in the image. */
.mg-model-stage__frame::selection {
  background: var(--red);
  color: #fff;
}

@media (max-width: 767px) {
  .mg-model-stage__backdrop {
    background-position:
      center center;
  }
}



/* =========================================================
   ACTIVE SHOWCASE — FINAL MODEL / CARD GAP FIX
   ---------------------------------------------------------
   IMPORTANT:
   This is intentionally the LAST normal layout override in
   this component. Earlier versions of this file contain
   several desktop/tablet/mobile positioning blocks.

   These rules must stay near the end so the visible section
   uses these final values.
========================================================= */

/* -------------------------
   DESKTOP
------------------------- */
@media (min-width: 1101px) {
  /*
    Vehicle ends around 61% of the viewport.
    Cards begin at 67%.
    This creates a clean ~6% breathing band.
  */
  .mg-model-stage__vehicle-zone {
    left: 13.5%;
    top: 13.2%;
    width: 73%;
    height: 47.8%;
  }

  /*
    Keep the car visually strong even though the viewport
    itself is slightly shorter.
  */
  .mg-model-stage__model {
    transform:
      translateY(.45vw)
      scale(1.015);
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(.18vw)
      scale(1.055);
  }

  /* Keep the stage visually attached to the car. */
  .mg-model-stage__podium {
    top: 79.2%;
    width: 63%;
    height: 13%;
  }

  .mg-model-stage__shadow {
    top: 81.4%;
    width: 43%;
  }

  /*
    Drag hint now occupies the empty breathing band instead
    of colliding with the model or cards.
  */
  .mg-model-stage__drag {
    top: 62.8%;
  }

  /*
    LOWER CARDS
    Moved down and made a little shorter.
  */
  .mg-model-stage__cards {
    left: 14.5%;
    right: 4%;
    top: 67%;
    bottom: auto;

    height: 28.2%;

    gap: .68vw;
  }
}

/* -------------------------
   TABLET
------------------------- */
@media (min-width: 768px) and (max-width: 1100px) {
  .mg-model-stage__vehicle-zone {
    left: 7%;
    top: 14.5%;
    width: 86%;
    height: 45.5%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(5px)
      scale(1.03);
  }

  .mg-model-stage__podium {
    top: 78.5%;
  }

  .mg-model-stage__shadow {
    top: 81%;
  }

  .mg-model-stage__drag {
    top: 61.5%;
  }

  .mg-model-stage__cards {
    left: 13%;
    right: 3%;
    top: 66.5%;
    bottom: auto;

    height: 28.5%;
  }
}

/* -------------------------
   MOBILE
------------------------- */
@media (max-width: 767px) {
  /*
    Keep the car large, but stop the model region earlier.
  */
  .mg-model-stage__vehicle-zone {
    left: -15%;
    top: 20%;
    width: 130%;
    height: 38.5%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(3px)
      scale(1.03);
  }

  .mg-model-stage__drag {
    top: 55.2%;
  }

  .mg-model-stage__specs {
    top: 58.2%;
  }

  /*
    Cards now start noticeably below the model/spec area.
  */
  .mg-model-stage__cards {
    left: 15px;
    right: 15px;
    top: 68%;
    bottom: auto;

    height: 27.5%;
  }
}

/* -------------------------
   SHORT MOBILE
------------------------- */
@media (max-width: 767px) and (max-height: 700px) {
  .mg-model-stage__vehicle-zone {
    top: 18.5%;
    height: 36.5%;
  }

  .mg-model-stage__drag {
    top: 52.5%;
  }

  .mg-model-stage__specs {
    top: 55.5%;
  }

  .mg-model-stage__cards {
    top: 66.5%;
    height: 29%;
  }
}




/* =========================================================
   FINAL MODEL / LOWER CARD SEPARATION
   ---------------------------------------------------------
   The model viewport used to end at almost the exact point
   where the lower cards started. Because model-viewer also
   scales the GLB, the car visually overlapped the cards.

   These rules are intentionally placed at the end of the
   component so they win over earlier experimental layout
   blocks without changing the rest of the stage.
========================================================= */

@media (min-width: 1101px) {
  .mg-model-stage__vehicle-zone {
    left: 13.5%;
    top: 13.8%;
    width: 73%;
    height: 45.5%;
  }

  .mg-model-stage__model {
    transform:
      translateY(.55vw)
      scale(1.01);
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(.25vw)
      scale(1.045);
  }

  .mg-model-stage__drag {
    top: 61.8%;
  }

  .mg-model-stage__cards {
    left: 14.5%;
    right: 2vw;
    top: 68%;
    bottom: auto;
    height: 27%;
  }
}

@media (min-width: 768px) and (max-width: 1100px) {
  .mg-model-stage__vehicle-zone {
    left: 7%;
    top: 16%;
    width: 86%;
    height: 42%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(4px)
      scale(1.02);
  }

  .mg-model-stage__drag {
    top: 60.5%;
  }

  .mg-model-stage__cards {
    left: 13%;
    right: 2vw;
    top: 68%;
    bottom: auto;
    height: 27.5%;
  }
}

@media (max-width: 767px) {
  .mg-model-stage__vehicle-zone {
    left: -15%;
    top: 21%;
    width: 130%;
    height: 34.5%;
  }

  .mg-model-stage__model.is-loaded {
    transform:
      translateY(3px)
      scale(1.02);
  }

  .mg-model-stage__drag {
    top: 56.2%;
  }

  .mg-model-stage__specs {
    top: 59%;
  }

  .mg-model-stage__cards {
    left: 2vw;
    right: 2vw;
    top: 69.5%;
    bottom: auto;
    height: 26.5%;
  }
}

@media (max-width: 767px) and (max-height: 700px) {
  .mg-model-stage__vehicle-zone {
    top: 19.5%;
    height: 33%;
  }

  .mg-model-stage__drag {
    top: 53.5%;
  }

  .mg-model-stage__specs {
    top: 56.5%;
  }

  .mg-model-stage__cards {
    top: 68%;
    height: 28%;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-model-stage *,
  .mg-model-stage *::before,
  .mg-model-stage *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
