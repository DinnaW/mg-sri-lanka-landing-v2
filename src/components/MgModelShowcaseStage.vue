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

const MODEL_REVISION = "paint-v3-20260831";

const modelPath =
  `${import.meta.env.BASE_URL}models/mg-car.glb?v=${MODEL_REVISION}`;

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
const paintMaterialReady = ref(false);

const selectedColorId = ref("silver");

/* =========================================================
   MODEL SETTINGS
========================================================= */

const DEFAULT_CAMERA = "32deg 82deg 57%";

/*
  IMPORTANT COLOUR NOTE
  ---------------------------------------------------------
  The original mg-car.glb has a material called "carpaint".
  Its baked baseColorFactor is BLUE. There is NO base colour
  texture in this GLB.

  <model-viewer> accepts a CSS colour string for
  setBaseColorFactor(). CSS colours are interpreted as sRGB
  and converted internally to the linear colour space used by
  glTF. Passing ordinary HEX channel values as a numeric array
  makes red too bright/pink and gives very dark colours a cool
  blue cast. Therefore the paint colours below are always sent
  as CSS HEX strings.
========================================================= */

const colours = [
  {
    id: "white",
    name: "Dover White",
    shortName: "White",
    finish: "Pearl",
    code: "DW01",
    hex: "#F5F4F0",
    paintHex: "#F5F4F0",
    metallic: 0.05,
    roughness: 0.19,
  },
  {
    id: "black",
    name: "Pebble Black",
    shortName: "Black",
    finish: "Metallic",
    code: "PB02",
    hex: "#090909",
    paintHex: "#090909",
    metallic: 0.08,
    roughness: 0.15,
  },
  {
    id: "silver",
    name: "Cosmic Silver",
    shortName: "Silver",
    finish: "Metallic",
    code: "CS03",
    hex: "#B4B8BA",
    paintHex: "#B4B8BA",
    metallic: 0.22,
    roughness: 0.17,
  },
  {
    id: "red",
    name: "Diamond Red",
    shortName: "Red",
    finish: "Metallic",
    code: "DR04",
    hex: "#A70B16",
    paintHex: "#A70B16",
    metallic: 0.10,
    roughness: 0.17,
  },
  {
    id: "grey",
    name: "Andes Grey",
    shortName: "Grey",
    finish: "Metallic",
    code: "AG05",
    hex: "#515657",
    paintHex: "#515657",
    metallic: 0.16,
    roughness: 0.18,
  },
  {
    id: "blue",
    name: "Piccadilly Blue",
    shortName: "Blue",
    finish: "Metallic",
    code: "PB06",
    hex: "#315B7A",
    paintHex: "#315B7A",
    metallic: 0.12,
    roughness: 0.17,
  },
];

const selectedColour = computed(() => {
  return (
    colours.find(
      (colour) => colour.id === selectedColorId.value
    ) || colours[0]
  );
});

const selectedColourIndex = computed(() => {
  const index = colours.findIndex(
    (colour) => colour.id === selectedColorId.value
  );

  return String(index + 1).padStart(2, "0");
});

/*
  Use one neutral exposure for every paint.
  Per-colour exposure was making comparisons misleading and
  could make black look cool/navy and red look brighter/pinker.
*/
const modelExposure = 1;

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
   CAR PAINT MATERIAL
========================================================= */

const getCarPaintMaterial = () => {
  const viewer = modelViewer.value;

  if (!viewer?.model) {
    return null;
  }

  // Prefer model-viewer's name lookup API. The inspected GLB
  // contains this exact material name.
  const byName = viewer.model.getMaterialByName?.("carpaint");

  if (byName) {
    return byName;
  }

  // Defensive fallback for older/alternate model-viewer builds.
  return (
    viewer.model.materials?.find(
      (material) =>
        (material.name || "").trim().toLowerCase() === "carpaint"
    ) || null
  );
};

const applyMaterialColour = async (material, colour) => {
  if (!material) {
    return false;
  }

  try {
    // Ensure the material resource is available before mutating it.
    await material.ensureLoaded?.();

    const pbr = material.pbrMetallicRoughness;

    if (!pbr) {
      return false;
    }

    /*
      CRITICAL FIX:
      Send CSS HEX directly. model-viewer converts this sRGB
      value to glTF's linear colour space correctly.

      Do NOT convert HEX to [r/255, g/255, b/255] here. Numeric
      arrays are already expected to be linear values.
    */
    pbr.setBaseColorFactor?.(colour.paintHex);

    // Keep the body paint glossy, but not mirror-like/raw metal.
    // This preserves the true red/black hue much better.
    pbr.setMetallicFactor?.(colour.metallic);
    pbr.setRoughnessFactor?.(colour.roughness);

    return true;
  } catch (error) {
    console.warn("MG car paint material update failed:", error);
    return false;
  }
};

const applyVehicleColour = async (colour) => {
  selectedColorId.value = colour.id;

  await nextTick();

  if (!modelLoaded.value) {
    return;
  }

  const material = getCarPaintMaterial();

  if (!material) {
    paintMaterialReady.value = false;
    console.warn(
      'MG colour selector: material "carpaint" was not found in the loaded GLB.'
    );
    return;
  }

  const applied = await applyMaterialColour(material, colour);
  paintMaterialReady.value = applied;
};

/* =========================================================
   MODEL EVENTS
========================================================= */

const handleModelLoad = async () => {
  modelLoaded.value = true;
  modelLoading.value = false;
  modelError.value = false;

  await nextTick();

  // Apply the selected silver immediately after model-viewer has
  // exposed its scene graph. The GLB itself is also patched to
  // neutral silver, so there is no blue flash before this runs.
  await applyVehicleColour(selectedColour.value);
};

const handleModelError = (event) => {
  modelLoading.value = false;
  modelError.value = true;
  paintMaterialReady.value = false;

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
      (colour) => colour.id === "silver"
    ) || colours[0];

  await applyVehicleColour(silver);
  await nextTick();

  const viewer = modelViewer.value;

  if (!viewer) return;

  try {
    viewer.cameraOrbit = DEFAULT_CAMERA;
    viewer.fieldOfView = "20deg";
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
           EXTERIOR FINISH — IMAGE MATCH PALETTE
      ==================================================== -->
      <aside
        class="mg-model-stage__colours"
        aria-label="Exterior finish selector"
      >


        <div class="mg-model-stage__paint-tray">
          <button
            v-for="colour in colours"
            :key="colour.id"
            type="button"
            class="mg-model-stage-colour"
            :class="{ 'is-active': selectedColorId === colour.id }"
            :aria-label="`Select ${colour.name}`"
            :aria-pressed="selectedColorId === colour.id"
            :title="`${colour.name} — ${colour.finish}`"
            @click="applyVehicleColour(colour)"
          >
            <span
              class="mg-model-stage-colour__chip"
              :style="{ '--paint': colour.hex }"
            ></span>

            <span class="mg-model-stage-colour__copy">
              <strong>{{ colour.name }}</strong>
              <template v-if="selectedColorId === colour.id">
                <small>{{ colour.finish }}</small>
                <em>{{ colour.code }}</em>
              </template>
            </span>
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
          tone-mapping="neutral"
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

  font-weight: 800;

  color:
    rgba(255, 255, 255, .92);
}

.mg-model-stage__specs span {
  margin-top: .3vw;

  color:
    rgba(255, 255, 255, .9);

  font-size: .52vw;

  font-weight: 800;
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
    font-weight: 800;
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


/* =========================================================
   EXACT REFERENCE-STYLE EXTERIOR FINISH PALETTE
   These final rules intentionally override the older
   vertical glass colour selector without affecting the
   working 3D paint logic.
========================================================= */

.mg-model-stage__colours {
  position: absolute !important;
  left: 50% !important;
  right: auto !important;
  top: 51.5% !important;
  z-index: 95 !important;

  width: min(58vw, 930px) !important;
  min-width: 0 !important;
  padding: 0 !important;

  transform: translateX(-50%) !important;

  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;

  font-family: "Manrope", sans-serif;
  overflow: visible !important;
}

/* Transparent upper menu plate */
.mg-model-stage__paint-tabs {
  position: relative;
  z-index: 3;

  width: 86%;
  height: clamp(38px, 2.65vw, 52px);

  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));

  margin: 0 auto;
  padding: 0 clamp(8px, .45vw, 12px);

  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, .16);
  border-radius: 0;

  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  overflow: hidden;
}

.mg-model-stage__paint-tabs::before {
  content: "";
  position: absolute;
  left: 4%;
  right: 4%;
  bottom: 0;
  height: 1px;
  background: rgba(255, 255, 255, .14);
}

.mg-model-stage__paint-tabs button {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 0;
  padding: 0 clamp(5px, .5vw, 12px);

  border: 0;
  border-right: 1px solid rgba(255, 255, 255, .10);
  background: transparent;

  color: rgba(255, 255, 255, .74);

  font: inherit;
  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(10px, .72vw, 14px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: .02em;
  text-transform: uppercase;
  white-space: nowrap;

  cursor: default;
}

.mg-model-stage__paint-tabs button:last-child {
  border-right: 0;
}

.mg-model-stage__paint-tabs button.is-active {
  color: #d9151d;
  font-weight: 700;
}

.mg-model-stage__paint-tabs button.is-active::after {
  content: "";

  position: absolute;
  left: 50%;
  bottom: 0;

  width: clamp(16px, 1.2vw, 22px);
  height: 4px;

  transform: translateX(-50%);

  border-radius: 5px 5px 0 0;
  background: #d9151d;

  box-shadow: 0 0 7px rgba(217, 21, 29, .35);
}

/* Transparent lower palette plate */
.mg-model-stage__paint-tray {
  position: relative;
  z-index: 2;

  width: 100%;
  height: clamp(92px, 6.8vw, 124px);

  display: grid;
  grid-template-columns: .9fr repeat(6, 1fr);
  align-items: stretch;

  margin-top: -2px;
  padding: 0 clamp(16px, 1.2vw, 24px);

  border: 0;
  border-radius: 0;

  background: transparent;
  box-shadow: none;

  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  overflow: visible;
}

.mg-model-stage__paint-tray::before {
  content: "";

  position: absolute;
  left: 7%;
  right: 7%;
  top: 12%;
  height: 70%;

  border-radius: 50%;

  background: transparent;

  pointer-events: none;
}

/* Back/reset circle */
.mg-model-stage__paint-back {
  position: relative;
  z-index: 2;

  display: grid;
  place-items: center;

  min-width: 0;
  padding: 0;

  border: 0;
  border-right: 1px solid rgba(255, 255, 255, .10);
  background: transparent;

  cursor: pointer;
}

.mg-model-stage__paint-back > span {
  width: clamp(48px, 3.5vw, 62px);
  height: clamp(48px, 3.5vw, 62px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;

  border: 2px solid rgba(213, 28, 35, .82);
  border-radius: 50%;

  background: rgba(255, 255, 255, .055);

  color: rgba(255, 255, 255, .78);

  font-size: clamp(6px, .42vw, 8px);
  font-weight: 700;
  letter-spacing: .03em;
  text-transform: uppercase;

  box-shadow:
    0 5px 14px rgba(0, 0, 0, .20),
    inset 0 1px 0 rgba(255, 255, 255, .12),
    0 0 0 3px rgba(255, 255, 255, .08);

  transition: transform .25s ease, box-shadow .25s ease;
}

.mg-model-stage__paint-back:hover > span {
  transform: translateY(-2px);
  box-shadow:
    0 8px 18px rgba(0, 0, 0, .26),
    inset 0 1px 0 rgba(255, 255, 255, .18),
    0 0 0 3px rgba(255, 255, 255, .13);
}

.mg-model-stage__paint-back svg {
  width: clamp(10px, .75vw, 14px);
  height: clamp(10px, .75vw, 14px);
}

/* Each colour gets its own subtle vertical cell like the reference */
.mg-model-stage-colour {
  position: relative !important;
  z-index: 2;

  width: auto !important;
  height: auto !important;
  min-height: 0 !important;

  display: grid !important;
  grid-template-columns: none !important;
  place-items: center !important;

  padding: 0 !important;
  gap: 0 !important;

  border: 0 !important;
  border-right: 1px solid rgba(255, 255, 255, .10) !important;
  border-radius: 0 !important;
  background: transparent !important;

  color: #fff !important;
  text-align: center !important;
  cursor: pointer;

  transform: none !important;
  overflow: visible !important;

  transition: background .25s ease !important;
}

.mg-model-stage-colour:last-child {
  border-right: 0 !important;
}

.mg-model-stage-colour:hover {
  background: rgba(255, 255, 255, .045) !important;
  transform: none !important;
}

.mg-model-stage-colour.is-active {
  background: rgba(255, 255, 255, .045) !important;

  border-color: rgba(255, 255, 255, .10) !important;
  box-shadow: none !important;
  transform: none !important;
}

/* The selected vertical stripe/cell visible in the screenshot */
.mg-model-stage-colour.is-active::before {
  content: "";

  position: absolute;
  left: 6%;
  right: 6%;
  top: -1px;
  bottom: -30px;
  z-index: -1;

  border-left: 1px solid rgba(255, 255, 255, .08);
  border-right: 1px solid rgba(255, 255, 255, .08);

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, .055),
    rgba(255, 255, 255, .018) 62%,
    transparent
  );

  pointer-events: none;
}

/* Triangle under the selected paint, pointing to its caption */
.mg-model-stage-colour.is-active::after {
  content: "";

  position: absolute;
  left: 50%;
  bottom: -10px;
  z-index: 6;

  width: 0;
  height: 0;

  transform: translateX(-50%);

  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 0;
  border-bottom: 14px solid rgba(255, 255, 255, .58);

  filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, .2));

  pointer-events: none;
}

/* Large glossy paint circles */
.mg-model-stage-colour__chip {
  --paint: #ccc;

  position: relative;

  width: clamp(48px, 3.7vw, 68px) !important;
  height: clamp(48px, 3.7vw, 68px) !important;

  display: block !important;

  border: 2px solid rgba(35, 35, 35, .22) !important;
  border-radius: 50% !important;

  background:
    radial-gradient(
      circle at 31% 24%,
      rgba(255, 255, 255, .92) 0%,
      rgba(255, 255, 255, .28) 13%,
      rgba(255, 255, 255, .04) 29%,
      transparent 37%
    ),
    radial-gradient(
      circle at 65% 75%,
      rgba(0, 0, 0, .25),
      transparent 56%
    ),
    var(--paint) !important;

  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, .45),
    inset -5px -8px 12px rgba(0, 0, 0, .22),
    0 4px 10px rgba(0, 0, 0, .24),
    0 0 0 3px rgba(255, 255, 255, .72) !important;

  transform: scale(.96) !important;

  transition:
    transform .28s cubic-bezier(.16, 1, .3, 1),
    box-shadow .28s ease !important;
}

.mg-model-stage-colour:hover .mg-model-stage-colour__chip {
  transform: translateY(-2px) scale(1) !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  transform: scale(1.08) !important;

  border-color: rgba(55, 55, 55, .27) !important;

  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, .5),
    inset -6px -9px 14px rgba(0, 0, 0, .22),
    0 7px 16px rgba(0, 0, 0, .28),
    0 0 0 4px rgba(255, 255, 255, .9),
    0 0 0 5px rgba(0, 0, 0, .1) !important;
}

/* Selected paint name panel hanging below the tray */
.mg-model-stage-colour__selected-label {
  position: absolute;
  left: 50%;
  top: calc(100% + 18px);
  z-index: 8;

  min-width: clamp(150px, 10.5vw, 190px);

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: clamp(10px, .8vw, 14px) clamp(10px, .9vw, 16px);

  transform: translateX(-50%);

  border-left: 1px solid rgba(255, 255, 255, .08);
  border-right: 1px solid rgba(255, 255, 255, .08);

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, .045),
    rgba(255, 255, 255, .015) 58%,
    transparent
  );

  color: rgba(255, 255, 255, .88);

  text-align: center;
  pointer-events: none;
}

.mg-model-stage-colour__selected-label strong {
  display: block;

  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(12px, .83vw, 15px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: .015em;
  text-transform: uppercase;
  white-space: nowrap;
}

.mg-model-stage-colour__selected-label small {
  display: block;
  margin-top: 4px;

  color: rgba(255, 255, 255, .52);

  font-size: clamp(8px, .55vw, 10px);
  font-weight: 600;
  letter-spacing: .055em;
  text-transform: uppercase;
}

.paint-label-enter-active,
.paint-label-leave-active {
  transition: opacity .22s ease, transform .22s ease;
}

.paint-label-enter-from,
.paint-label-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}

/* Reference image palette is centered below the vehicle. */
@media (min-width: 1101px) {
  .mg-model-stage__vehicle-zone {
    top: 12.6% !important;
  }

  .mg-model-stage__drag {
    top: 68.5% !important;
  }
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours {
    top: 490px !important;
    width: min(76vw, 760px) !important;
  }

  .mg-model-stage__paint-tabs {
    width: 88%;
    height: 38px;
  }

  .mg-model-stage__paint-tabs button {
    font-size: 9px;
  }

  .mg-model-stage__paint-tray {
    height: 92px;
    padding: 0 14px;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 48px !important;
    height: 48px !important;
  }

  .mg-model-stage-colour__selected-label {
    top: calc(100% + 16px);
    min-width: 138px;
  }
}

/* Mobile: keep the same visual language, but allow horizontal scroll. */
@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 16px !important;
    right: 16px !important;
    top: 505px !important;
    width: auto !important;

    transform: none !important;
  }

  .mg-model-stage__paint-tabs {
    width: 100%;
    height: 38px;

    overflow-x: auto;
    grid-template-columns: repeat(6, minmax(78px, 1fr));

    border-radius: 18px 18px 8px 8px;
    scrollbar-width: none;
  }

  .mg-model-stage__paint-tabs::-webkit-scrollbar {
    display: none;
  }

  .mg-model-stage__paint-tabs button {
    font-size: 9px;
  }

  .mg-model-stage__paint-tray {
    width: 100%;
    height: 84px;

    display: flex;
    align-items: stretch;

    padding: 0 10px;

    overflow-x: auto;
    overflow-y: visible;

    border-radius: 16px 16px 28px 28px;
    scrollbar-width: none;
  }

  .mg-model-stage__paint-tray::-webkit-scrollbar {
    display: none;
  }

  .mg-model-stage__paint-back,
  .mg-model-stage-colour {
    width: 78px !important;
    min-width: 78px !important;
    flex: 0 0 78px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 46px !important;
    height: 46px !important;
  }

  .mg-model-stage-colour__selected-label {
    display: none;
  }

  .mg-model-stage-colour.is-active::before,
  .mg-model-stage-colour.is-active::after {
    display: none;
  }
}


/* =========================================================
   FINAL PALETTE TUNING — SMALLER + CURVED + TRANSPARENT
   ========================================================= */

/* Smaller centered configurator */
.mg-model-stage__colours {
  left: 50% !important;
  top: 53.8% !important;
  width: min(48vw, 760px) !important;
  min-width: 560px !important;
  transform: translateX(-50%) !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: visible !important;
}

/* Curved upper tab rail */
.mg-model-stage__paint-tabs {
  width: 88% !important;
  height: clamp(34px, 2.25vw, 43px) !important;
  padding: 0 8px !important;
  overflow: visible !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Draw one shallow curved line behind the tabs */
.mg-model-stage__paint-tabs::before {
  content: "" !important;
  position: absolute !important;
  left: 1% !important;
  right: 1% !important;
  top: 14px !important;
  bottom: auto !important;
  height: 34px !important;
  border-top: 1px solid rgba(255, 255, 255, .26) !important;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0 !important;
  background: transparent !important;
  pointer-events: none !important;
}

.mg-model-stage__paint-tabs button {
  height: 34px !important;
  padding: 0 7px !important;
  border-right: 1px solid rgba(255, 255, 255, .09) !important;
  color: rgba(255, 255, 255, .66) !important;
  font-size: clamp(8px, .58vw, 11px) !important;
  background: transparent !important;
  transform-origin: center bottom;
}

/* Give the tab row the same shallow arc as the reference */
.mg-model-stage__paint-tabs button:nth-child(1),
.mg-model-stage__paint-tabs button:nth-child(6) {
  transform: translateY(7px) rotate(0deg);
}
.mg-model-stage__paint-tabs button:nth-child(2),
.mg-model-stage__paint-tabs button:nth-child(5) {
  transform: translateY(3px);
}
.mg-model-stage__paint-tabs button:nth-child(3),
.mg-model-stage__paint-tabs button:nth-child(4) {
  transform: translateY(0);
}

.mg-model-stage__paint-tabs button.is-active {
  color: #e51920 !important;
}

.mg-model-stage__paint-tabs button.is-active::after {
  bottom: -1px !important;
  width: 14px !important;
  height: 3px !important;
  border-radius: 999px !important;
}

/* Curved transparent colour rail */
.mg-model-stage__paint-tray {
  width: 100% !important;
  height: clamp(72px, 5.25vw, 88px) !important;
  margin-top: 1px !important;
  padding: 0 18px !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  overflow: visible !important;
}

/* Elliptical top/bottom guide to create the curved tray shape */
.mg-model-stage__paint-tray::before {
  content: "" !important;
  position: absolute !important;
  left: 1% !important;
  right: 1% !important;
  top: -9px !important;
  height: 82px !important;
  border-top: 1px solid rgba(255, 255, 255, .13) !important;
  border-bottom: 1px solid rgba(255, 255, 255, .09) !important;
  border-radius: 50% / 32% !important;
  background: transparent !important;
  pointer-events: none !important;
}

/* Smaller cells + subtle separators */
.mg-model-stage__paint-back,
.mg-model-stage-colour {
  min-height: 68px !important;
  border-right: 1px solid rgba(255, 255, 255, .075) !important;
  background: transparent !important;
}

.mg-model-stage-colour:last-child {
  border-right: 0 !important;
}

/* Arc the swatches: outside colours sit slightly lower */
.mg-model-stage__paint-back,
.mg-model-stage-colour:nth-child(2),
.mg-model-stage-colour:nth-child(7) {
  transform: translateY(8px) !important;
}
.mg-model-stage-colour:nth-child(3),
.mg-model-stage-colour:nth-child(6) {
  transform: translateY(4px) !important;
}
.mg-model-stage-colour:nth-child(4),
.mg-model-stage-colour:nth-child(5) {
  transform: translateY(1px) !important;
}

/* Smaller glossy circles */
.mg-model-stage__paint-back > span,
.mg-model-stage-colour__chip {
  width: clamp(38px, 2.65vw, 50px) !important;
  height: clamp(38px, 2.65vw, 50px) !important;
}

.mg-model-stage__paint-back > span {
  border-width: 1.5px !important;
  font-size: clamp(6px, .42vw, 8px) !important;
  background: transparent !important;
}

.mg-model-stage__paint-back svg {
  width: 11px !important;
  height: 11px !important;
}

.mg-model-stage-colour__chip {
  border-width: 1px !important;
  box-shadow:
    inset 0 1px 2px rgba(255,255,255,.42),
    inset -4px -6px 9px rgba(0,0,0,.22),
    0 3px 8px rgba(0,0,0,.2),
    0 0 0 2px rgba(255,255,255,.5) !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  transform: scale(1.08) !important;
  box-shadow:
    inset 0 1px 3px rgba(255,255,255,.5),
    inset -4px -7px 10px rgba(0,0,0,.22),
    0 5px 12px rgba(0,0,0,.25),
    0 0 0 3px rgba(255,255,255,.82),
    0 0 0 4px rgba(0,0,0,.08) !important;
}

/* Smaller active pointer */
.mg-model-stage-colour.is-active::before {
  top: -11px !important;
  border-left-width: 6px !important;
  border-right-width: 6px !important;
  border-bottom-width: 9px !important;
}

/* Compact selected colour label */
.mg-model-stage-colour__selected-label {
  top: calc(100% + 10px) !important;
  min-width: 122px !important;
  padding: 7px 9px !important;
  background: transparent !important;
  border-left-color: rgba(255,255,255,.06) !important;
  border-right-color: rgba(255,255,255,.06) !important;
}

.mg-model-stage-colour__selected-label strong {
  font-size: clamp(10px, .67vw, 12px) !important;
}

.mg-model-stage-colour__selected-label small {
  margin-top: 2px !important;
  font-size: clamp(7px, .45vw, 8px) !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours {
    top: 500px !important;
    width: min(68vw, 650px) !important;
    min-width: 500px !important;
  }

  .mg-model-stage__paint-tabs {
    height: 34px !important;
  }

  .mg-model-stage__paint-tray {
    height: 74px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 40px !important;
    height: 40px !important;
  }
}

/* Mobile — preserve curve but allow horizontal scrolling */
@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 14px !important;
    right: 14px !important;
    top: 510px !important;
    width: auto !important;
    min-width: 0 !important;
    transform: none !important;
  }

  .mg-model-stage__paint-tabs {
    width: 100% !important;
    grid-template-columns: repeat(6, minmax(68px, 1fr)) !important;
  }

  .mg-model-stage__paint-tray {
    padding: 0 6px !important;
  }

  .mg-model-stage__paint-back,
  .mg-model-stage-colour {
    width: 66px !important;
    min-width: 66px !important;
    flex-basis: 66px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 38px !important;
    height: 38px !important;
  }
}



/* =========================================================
   FINAL POSITION OVERRIDE — LEFT SIDE CURVED PALETTE
   ========================================================= */

/* Desktop: keep the transparent curved palette on the LEFT. */
.mg-model-stage__colours {
  left: 3.8% !important;
  right: auto !important;
  top: 43% !important;
  bottom: auto !important;
  width: min(43vw, 680px) !important;
  min-width: 520px !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;

  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: visible !important;
}

/* Keep the curved rail compact instead of stretching across the screen. */
.mg-model-stage__paint-tabs {
  width: 88% !important;
  margin-left: 0 !important;
  margin-right: auto !important;
}

.mg-model-stage__paint-tray {
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: auto !important;
}

/* Tablet: still left aligned. */
@media (max-width: 1100px) {
  .mg-model-stage__colours {
    left: 24px !important;
    right: auto !important;
    top: 455px !important;
    bottom: auto !important;
    width: min(62vw, 610px) !important;
    min-width: 490px !important;
    transform: none !important;
  }
}

/* Mobile: left edge, full available width so it does not overflow. */
@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 14px !important;
    right: 14px !important;
    top: 505px !important;
    bottom: auto !important;
    width: auto !important;
    min-width: 0 !important;
    transform: none !important;
  }

  .mg-model-stage__paint-tabs,
  .mg-model-stage__paint-tray {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}


/* =========================================================
   FINAL OVERRIDE — STRAIGHT TOP-TO-BOTTOM LEFT PALETTE
   ========================================================= */

/* Put the whole selector on the left side. */
.mg-model-stage__colours {
  position: absolute !important;
  left: 4.2% !important;
  right: auto !important;
  top: 22% !important;
  bottom: auto !important;

  width: 230px !important;
  min-width: 230px !important;
  height: 420px !important;

  padding: 0 !important;
  margin: 0 !important;
  transform: none !important;

  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: visible !important;
  z-index: 88 !important;
}

/* Hide the old horizontal tabs/curve so only the vertical palette remains. */
.mg-model-stage__paint-tabs {
  display: none !important;
}

/* Vertical colour rail. */
.mg-model-stage__paint-tray {
  position: relative !important;
  width: 230px !important;
  height: 420px !important;

  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  gap: 0 !important;

  margin: 0 !important;
  padding: 0 !important;

  overflow: visible !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

/* One clean STRAIGHT line from top to bottom. */
.mg-model-stage__paint-tray::before {
  content: "" !important;
  position: absolute !important;
  left: 23px !important;
  top: 24px !important;
  bottom: 24px !important;
  width: 2px !important;
  height: auto !important;

  border: 0 !important;
  border-radius: 999px !important;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,.18),
    rgba(255,255,255,.72) 16%,
    rgba(255,255,255,.72) 84%,
    rgba(255,255,255,.18)
  ) !important;
  box-shadow: 0 0 10px rgba(255,255,255,.08) !important;
  pointer-events: none !important;
  z-index: 0 !important;
}

/* Every item sits on the same straight vertical line. */
.mg-model-stage__paint-back,
.mg-model-stage-colour {
  position: relative !important;
  z-index: 2 !important;

  width: 230px !important;
  min-width: 230px !important;
  height: 50px !important;
  min-height: 50px !important;
  flex: 0 0 50px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;

  padding: 0 !important;
  margin: 0 !important;

  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  transform: none !important;
  overflow: visible !important;
}

/* Reset/back circle. */
.mg-model-stage__paint-back > span {
  position: relative !important;
  left: 0 !important;

  width: 46px !important;
  height: 46px !important;
  flex: 0 0 46px !important;

  display: grid !important;
  place-items: center !important;
  gap: 0 !important;

  border: 1px solid rgba(255,255,255,.58) !important;
  border-radius: 50% !important;
  background: rgba(5,5,5,.56) !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(0,0,0,.28) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;

  font-size: 0 !important;
}

.mg-model-stage__paint-back svg {
  width: 17px !important;
  height: 17px !important;
}

/* Colour circles. */
.mg-model-stage-colour__chip {
  position: relative !important;
  left: 0 !important;

  width: 46px !important;
  height: 46px !important;
  flex: 0 0 46px !important;

  border: 1px solid rgba(255,255,255,.52) !important;
  border-radius: 50% !important;
  background:
    radial-gradient(circle at 34% 26%, rgba(255,255,255,.7) 0%, rgba(255,255,255,.12) 22%, transparent 42%),
    var(--paint) !important;
  box-shadow:
    inset -5px -7px 11px rgba(0,0,0,.28),
    0 4px 12px rgba(0,0,0,.28) !important;
  transform: none !important;
  transition: transform .24s ease, box-shadow .24s ease !important;
}

.mg-model-stage-colour:hover .mg-model-stage-colour__chip {
  transform: scale(1.06) !important;
}

/* Selected swatch — slightly larger, not dramatically bigger. */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  transform: scale(1.12) !important;
  box-shadow:
    inset -5px -7px 11px rgba(0,0,0,.24),
    0 5px 16px rgba(0,0,0,.34),
    0 0 0 2px #fff,
    0 0 0 4px rgba(255,255,255,.22) !important;
}

/* Remove old curved-pointer triangles. */
.mg-model-stage-colour.is-active::before,
.mg-model-stage-colour.is-active::after {
  display: none !important;
}

/* Selected colour information appears to the RIGHT of the straight line. */
.mg-model-stage-colour__selected-label {
  position: absolute !important;
  left: 68px !important;
  top: 50% !important;
  width: 145px !important;
  min-width: 145px !important;

  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  transform: translateY(-50%) !important;

  border: 0 !important;
  background: transparent !important;
  color: #fff !important;
  text-align: left !important;
  pointer-events: none !important;
}

/* Small horizontal connector from selected circle to text. */
.mg-model-stage-colour__selected-label::before {
  content: "";
  position: absolute;
  left: -18px;
  top: 50%;
  width: 12px;
  height: 1px;
  background: rgba(255,255,255,.65);
  transform: translateY(-50%);
}

.mg-model-stage-colour__selected-label strong {
  display: block !important;
  color: #fff !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
  letter-spacing: .04em !important;
  text-transform: uppercase !important;
}

.mg-model-stage-colour__selected-label small {
  display: block !important;
  margin-top: 4px !important;
  color: rgba(255,255,255,.55) !important;
  font-size: 8px !important;
  font-weight: 600 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours {
    left: 24px !important;
    top: 185px !important;
    width: 205px !important;
    min-width: 205px !important;
    height: 365px !important;
  }

  .mg-model-stage__paint-tray {
    width: 205px !important;
    height: 365px !important;
  }

  .mg-model-stage__paint-back,
  .mg-model-stage-colour {
    width: 205px !important;
    min-width: 205px !important;
    height: 44px !important;
    min-height: 44px !important;
    flex-basis: 44px !important;
  }

  .mg-model-stage__paint-tray::before {
    left: 20px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 40px !important;
    height: 40px !important;
    flex-basis: 40px !important;
  }

  .mg-model-stage-colour__selected-label {
    left: 59px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 14px !important;
    right: auto !important;
    top: 205px !important;
    width: 170px !important;
    min-width: 170px !important;
    height: 330px !important;
    transform: none !important;
  }

  .mg-model-stage__paint-tray {
    width: 170px !important;
    height: 330px !important;
    overflow: visible !important;
  }

  .mg-model-stage__paint-back,
  .mg-model-stage-colour {
    width: 170px !important;
    min-width: 170px !important;
    height: 40px !important;
    min-height: 40px !important;
    flex: 0 0 40px !important;
  }

  .mg-model-stage__paint-tray::before {
    left: 18px !important;
    top: 20px !important;
    bottom: 20px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 36px !important;
    height: 36px !important;
    flex: 0 0 36px !important;
  }

  .mg-model-stage-colour__selected-label {
    left: 53px !important;
    width: 110px !important;
    min-width: 110px !important;
  }

  .mg-model-stage-colour__selected-label strong {
    font-size: 9px !important;
  }

  .mg-model-stage-colour__selected-label small {
    font-size: 7px !important;
  }
}


/* =========================================================
   FINAL IMAGE-MATCH COLOUR PALETTE — NO LINES
   ========================================================= */
.mg-model-stage__colours {
  position: absolute !important;
  left: 4.8% !important;
  right: auto !important;
  top: 16.2% !important;
  bottom: auto !important;
  z-index: 92 !important;
  width: clamp(230px, 17vw, 292px) !important;
  min-width: 0 !important;
  height: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  transform: none !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: visible !important;
}

/* Back row, matching the reference image. */
.mg-model-stage__paint-back {
  position: relative !important;
  width: 100% !important;
  min-width: 0 !important;
  height: clamp(42px, 3vw, 54px) !important;
  min-height: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: clamp(14px, 1.15vw, 20px) !important;
  padding: 0 !important;
  margin: 0 0 clamp(16px, 1.45vw, 24px) 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: #fff !important;
  box-shadow: none !important;
  transform: none !important;
  cursor: pointer !important;
}

.mg-model-stage__paint-back-icon {
  width: clamp(38px, 2.75vw, 48px) !important;
  height: clamp(38px, 2.75vw, 48px) !important;
  flex: 0 0 clamp(38px, 2.75vw, 48px) !important;
  display: grid !important;
  place-items: center !important;
  border: 1px solid rgba(255,255,255,.82) !important;
  border-radius: 50% !important;
  background: rgba(5,5,5,.24) !important;
  box-shadow: 0 5px 18px rgba(0,0,0,.16) !important;
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(2px) !important;
}

.mg-model-stage__paint-back-icon svg {
  width: 18px !important;
  height: 18px !important;
}

.mg-model-stage__paint-back-text {
  color: rgba(255,255,255,.94) !important;
  font-size: clamp(10px, .78vw, 14px) !important;
  font-weight: 600 !important;
  letter-spacing: .025em !important;
  text-transform: uppercase !important;
}

/* No track, no connector line, no curve. */
.mg-model-stage__paint-tray {
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
  gap: clamp(13px, 1.05vw, 18px) !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.mg-model-stage__paint-tray::before,
.mg-model-stage__paint-tray::after {
  display: none !important;
  content: none !important;
}

.mg-model-stage-colour {
  position: relative !important;
  width: 100% !important;
  min-width: 0 !important;
  height: clamp(50px, 3.65vw, 64px) !important;
  min-height: 0 !important;
  flex: 0 0 auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: clamp(18px, 1.35vw, 24px) !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: #fff !important;
  box-shadow: none !important;
  transform: none !important;
  text-align: left !important;
  overflow: visible !important;
  cursor: pointer !important;
}

.mg-model-stage-colour::before,
.mg-model-stage-colour::after {
  display: none !important;
  content: none !important;
}

.mg-model-stage-colour__chip {
  position: relative !important;
  inset: auto !important;
  left: auto !important;
  top: auto !important;
  width: clamp(46px, 3.4vw, 58px) !important;
  height: clamp(46px, 3.4vw, 58px) !important;
  flex: 0 0 clamp(46px, 3.4vw, 58px) !important;
  display: block !important;
  border: 1px solid rgba(255,255,255,.62) !important;
  border-radius: 50% !important;
  background:
    radial-gradient(circle at 33% 24%, rgba(255,255,255,.88) 0%, rgba(255,255,255,.22) 18%, transparent 39%),
    radial-gradient(circle at 70% 76%, rgba(0,0,0,.28), transparent 44%),
    var(--paint) !important;
  box-shadow:
    inset -5px -7px 12px rgba(0,0,0,.24),
    inset 2px 2px 4px rgba(255,255,255,.2),
    0 5px 14px rgba(0,0,0,.24) !important;
  transform: none !important;
  transition: transform .24s ease, box-shadow .24s ease !important;
}

.mg-model-stage-colour:hover .mg-model-stage-colour__chip {
  transform: scale(1.05) !important;
}

.mg-model-stage-colour.is-active {
  background: transparent !important;
  border: 0 !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  transform: scale(1.16) !important;
  box-shadow:
    inset -5px -7px 12px rgba(0,0,0,.22),
    inset 2px 2px 4px rgba(255,255,255,.25),
    0 7px 18px rgba(0,0,0,.30),
    0 0 0 3px #fff,
    0 0 0 5px rgba(255,255,255,.25) !important;
}

/* Small white triangular pointer on the active swatch, as in the image. */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip::after {
  content: "" !important;
  position: absolute !important;
  display: block !important;
  right: -13px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 0 !important;
  height: 0 !important;
  border-top: 7px solid transparent !important;
  border-bottom: 7px solid transparent !important;
  border-left: 10px solid #fff !important;
}

.mg-model-stage-colour__copy {
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: #fff !important;
  text-align: left !important;
  pointer-events: none !important;
}

.mg-model-stage-colour__copy strong {
  display: block !important;
  margin: 0 !important;
  color: rgba(255,255,255,.94) !important;
  font-size: clamp(10px, .78vw, 14px) !important;
  font-weight: 500 !important;
  line-height: 1.15 !important;
  letter-spacing: .015em !important;
  text-transform: uppercase !important;
  white-space: nowrap !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
  font-size: clamp(13px, 1vw, 17px) !important;
  font-weight: 700 !important;
  color: #fff !important;
}

.mg-model-stage-colour__copy small,
.mg-model-stage-colour__copy em {
  display: block !important;
  margin: 4px 0 0 0 !important;
  color: rgba(255,255,255,.86) !important;
  font-size: clamp(9px, .68vw, 12px) !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: 1.05 !important;
  letter-spacing: .02em !important;
  text-transform: uppercase !important;
}

.mg-model-stage-colour__copy em {
  color: rgba(255,255,255,.72) !important;
}

/* Hide legacy palette pieces that can leak through old CSS. */
.mg-model-stage__paint-tabs,
.mg-model-stage-colour__selected-label,
.mg-model-stage__colour-line,
.mg-model-stage__paint-head,
.mg-model-stage__paint-preview {
  display: none !important;
}

@media (max-width: 1100px) {
  .mg-model-stage__colours {
    left: 24px !important;
    top: 170px !important;
    width: 220px !important;
  }

  .mg-model-stage__paint-back {
    margin-bottom: 14px !important;
  }

  .mg-model-stage__paint-tray {
    gap: 11px !important;
  }

  .mg-model-stage-colour {
    height: 50px !important;
    gap: 16px !important;
  }

  .mg-model-stage__paint-back-icon,
  .mg-model-stage-colour__chip {
    width: 44px !important;
    height: 44px !important;
    flex-basis: 44px !important;
  }
}

@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 14px !important;
    right: auto !important;
    top: 180px !important;
    width: 175px !important;
    transform: none !important;
  }

  .mg-model-stage__paint-back {
    gap: 12px !important;
    margin-bottom: 10px !important;
  }

  .mg-model-stage__paint-tray {
    gap: 7px !important;
  }

  .mg-model-stage-colour {
    height: 42px !important;
    gap: 12px !important;
  }

  .mg-model-stage__paint-back-icon,
  .mg-model-stage-colour__chip {
    width: 36px !important;
    height: 36px !important;
    flex-basis: 36px !important;
  }

  .mg-model-stage__paint-back-text,
  .mg-model-stage-colour__copy strong {
    font-size: 9px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
    font-size: 11px !important;
  }

  .mg-model-stage-colour__copy small,
  .mg-model-stage-colour__copy em {
    margin-top: 2px !important;
    font-size: 7px !important;
  }
}


/* =========================================================
   FINAL SIZE TUNING — LARGE + CLEAR LEFT COLOUR PALETTE
   ========================================================= */
@media (min-width: 1101px) {
  .mg-model-stage__colours {
    left: 4.8% !important;
    top: 17.5% !important;
    width: 330px !important;
    min-width: 330px !important;
    padding: 0 !important;
    transform: none !important;
  }

  .mg-model-stage__paint-back {
    height: 58px !important;
    gap: 18px !important;
    margin: 0 0 22px 0 !important;
  }

  .mg-model-stage__paint-back-icon {
    width: 48px !important;
    height: 48px !important;
    flex: 0 0 48px !important;
    border: 1.5px solid rgba(255,255,255,.72) !important;
    box-shadow: 0 6px 18px rgba(0,0,0,.26) !important;
  }

  .mg-model-stage__paint-back-icon svg {
    width: 21px !important;
    height: 21px !important;
  }

  .mg-model-stage__paint-back-text {
    font-size: 14px !important;
    font-weight: 650 !important;
    letter-spacing: .035em !important;
  }

  .mg-model-stage__paint-tray {
    gap: 18px !important;
  }

  .mg-model-stage-colour {
    height: 72px !important;
    gap: 24px !important;
  }

  .mg-model-stage-colour__chip {
    width: 62px !important;
    height: 62px !important;
    flex: 0 0 62px !important;
    border: 1.5px solid rgba(255,255,255,.72) !important;
    box-shadow:
      inset -6px -8px 14px rgba(0,0,0,.25),
      inset 2px 2px 5px rgba(255,255,255,.28),
      0 6px 16px rgba(0,0,0,.28) !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    transform: scale(1.16) !important;
    box-shadow:
      inset -6px -8px 14px rgba(0,0,0,.22),
      inset 2px 2px 5px rgba(255,255,255,.30),
      0 8px 22px rgba(0,0,0,.34),
      0 0 0 4px #fff,
      0 0 0 6px rgba(255,255,255,.22) !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip::after {
    right: -16px !important;
    border-top-width: 8px !important;
    border-bottom-width: 8px !important;
    border-left-width: 12px !important;
  }

  .mg-model-stage-colour__copy strong {
    font-size: 14px !important;
    font-weight: 600 !important;
    letter-spacing: .025em !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
    font-size: 18px !important;
    font-weight: 750 !important;
    line-height: 1.1 !important;
  }

  .mg-model-stage-colour__copy small,
  .mg-model-stage-colour__copy em {
    margin-top: 4px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: .035em !important;
  }
}

@media (min-width: 1600px) {
  .mg-model-stage__colours {
    left: 5.2% !important;
    top: 17% !important;
    width: 360px !important;
    min-width: 360px !important;
  }

  .mg-model-stage__paint-tray {
    gap: 20px !important;
  }

  .mg-model-stage-colour {
    height: 76px !important;
    gap: 26px !important;
  }

  .mg-model-stage-colour__chip {
    width: 66px !important;
    height: 66px !important;
    flex-basis: 66px !important;
  }

  .mg-model-stage-colour__copy strong {
    font-size: 15px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
    font-size: 19px !important;
  }

  .mg-model-stage-colour__copy small,
  .mg-model-stage-colour__copy em {
    font-size: 11.5px !important;
  }
}


/* =========================================================
   FINAL COMPACT SIDE SECTIONS
   Slightly smaller exterior colour palette + vehicle specs.
   Keeps positions, curves and 3D paint behaviour unchanged.
   ========================================================= */

/* Desktop / large screens */
.mg-model-stage__colours,
.mg-model-stage__specs {
  height: 390px !important;
}

.mg-model-stage__colours {
  width: 215px !important;
  min-width: 215px !important;
}

.mg-model-stage__specs {
  width: 210px !important;
}

.mg-model-stage-colour,
.mg-model-stage__specs > div {
  height: 56px !important;
  min-height: 56px !important;
  flex-basis: 56px !important;
}

.mg-model-stage-colour {
  width: 190px !important;
}

.mg-model-stage__specs > div {
  width: 184px !important;
}

/* Slightly smaller specification typography */
.mg-model-stage__specs strong {
  font-size: clamp(25px, 1.55vw, 32px) !important;
  line-height: .95 !important;
}

.mg-model-stage__specs strong small {
  margin-left: 3px !important;
  font-size: clamp(8px, .48vw, 10px) !important;
  font-weight: 700 !important;
}

.mg-model-stage__specs span {
  margin-top: 5px !important;
  font-size: clamp(8px, .46vw, 10px) !important;
  font-weight: 700 !important;
  line-height: 1.15 !important;
}

/* Keep the C-shaped palette balanced after making it smaller. */
.mg-model-stage-colour:nth-child(1) {
  transform: translateX(54px) !important;
}
.mg-model-stage-colour:nth-child(2) {
  transform: translateX(27px) !important;
}
.mg-model-stage-colour:nth-child(3) {
  transform: translateX(6px) !important;
}
.mg-model-stage-colour:nth-child(4) {
  transform: translateX(0) !important;
}
.mg-model-stage-colour:nth-child(5) {
  transform: translateX(22px) !important;
}
.mg-model-stage-colour:nth-child(6) {
  transform: translateX(51px) !important;
}

/* Mirror the same compact curve on the right. */
.mg-model-stage__specs > div:nth-child(1) {
  transform: translateX(-50px) !important;
}
.mg-model-stage__specs > div:nth-child(2) {
  transform: translateX(-13px) !important;
}
.mg-model-stage__specs > div:nth-child(3) {
  transform: translateX(0) !important;
}
.mg-model-stage__specs > div:nth-child(4) {
  transform: translateX(-45px) !important;
}

/* Large desktop: stop side UI from growing too much. */
@media (min-width: 1800px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    height: 390px !important;
  }

  .mg-model-stage__colours {
    width: 215px !important;
    min-width: 215px !important;
  }

  .mg-model-stage__specs {
    width: 210px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 56px !important;
    min-height: 56px !important;
    flex-basis: 56px !important;
  }

  .mg-model-stage__specs strong {
    font-size: 32px !important;
  }

  .mg-model-stage__specs strong small {
    font-size: 10px !important;
  }

  .mg-model-stage__specs span {
    font-size: 10px !important;
  }
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    height: 305px !important;
  }

  .mg-model-stage__colours {
    width: 165px !important;
    min-width: 165px !important;
  }

  .mg-model-stage__specs {
    width: 165px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 47px !important;
    min-height: 47px !important;
    flex-basis: 47px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    width: 148px !important;
  }

  .mg-model-stage__specs strong {
    font-size: 23px !important;
  }

  .mg-model-stage__specs strong small {
    font-size: 8px !important;
  }

  .mg-model-stage__specs span {
    font-size: 7px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    height: 250px !important;
  }

  .mg-model-stage__colours {
    width: 132px !important;
    min-width: 132px !important;
  }

  .mg-model-stage__specs {
    width: 128px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 38px !important;
    min-height: 38px !important;
    flex-basis: 38px !important;
  }

  .mg-model-stage-colour {
    width: 118px !important;
  }

  .mg-model-stage__specs > div {
    width: 114px !important;
  }

  .mg-model-stage__specs strong {
    font-size: 19px !important;
  }

  .mg-model-stage__specs strong small {
    font-size: 7px !important;
  }

  .mg-model-stage__specs span {
    font-size: 6px !important;
  }
}

</style>

<style scoped>
/* FINAL OVERRIDE — SMALLER PALETTE SECTION, KEEP TEXT CLEAR */
.mg-model-stage__colours {
  width: 220px !important;
  min-width: 220px !important;
  left: 4.2% !important;
  top: 42% !important;
  transform: translateY(-50%) !important;
}

.mg-model-stage__paint-tray {
  width: 220px !important;
  gap: 10px !important;
}

.mg-model-stage__paint-back,
.mg-model-stage-colour {
  min-height: 54px !important;
}

.mg-model-stage__paint-back > span,
.mg-model-stage-colour__chip {
  width: 46px !important;
  height: 46px !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  transform: scale(1.08) !important;
}

.mg-model-stage-colour__selected-label {
  left: 62px !important;
  min-width: 118px !important;
  padding: 0 !important;
}

.mg-model-stage-colour__selected-label strong {
  font-size: 12px !important;
}

.mg-model-stage-colour__selected-label small {
  font-size: 9px !important;
}

@media (max-width: 1100px) {
  .mg-model-stage__colours {
    width: 190px !important;
    min-width: 190px !important;
    left: 22px !important;
    top: 430px !important;
    transform: none !important;
  }

  .mg-model-stage__paint-tray {
    width: 190px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 42px !important;
    height: 42px !important;
  }
}

@media (max-width: 767px) {
  .mg-model-stage__colours {
    width: 170px !important;
    min-width: 170px !important;
    left: 14px !important;
    right: auto !important;
    top: 500px !important;
  }

  .mg-model-stage__paint-tray {
    width: 170px !important;
  }

  .mg-model-stage__paint-back > span,
  .mg-model-stage-colour__chip {
    width: 38px !important;
    height: 38px !important;
  }

  .mg-model-stage-colour__selected-label {
    left: 52px !important;
    min-width: 105px !important;
  }
}
</style>

<!-- NOTE: circle-size override is intentionally appended after the scoped style block via a second scoped style. -->
<style scoped>
/* SMALL CIRCLES — keep the section/layout unchanged */
.mg-model-stage__paint-back {
  width: 34px !important;
  height: 34px !important;
  min-width: 34px !important;
}

.mg-model-stage__paint-back svg {
  width: 13px !important;
  height: 13px !important;
}

.mg-model-stage-colour__chip {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  min-height: 36px !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
  min-height: 42px !important;
  transform: none !important;
}

@media (max-width: 1100px) {
  .mg-model-stage__paint-back {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
  }

  .mg-model-stage-colour__chip {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
    min-height: 38px !important;
  }
}

@media (max-width: 767px) {
  .mg-model-stage__paint-back {
    width: 28px !important;
    height: 28px !important;
    min-width: 28px !important;
  }

  .mg-model-stage-colour__chip {
    width: 29px !important;
    height: 29px !important;
    min-width: 29px !important;
    min-height: 29px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
    min-height: 34px !important;
  }
}
</style>

<style scoped>
/* =========================================================
   FINAL PALETTE OVERRIDE — GENTLE CURVE + SMALL TRUE CIRCLES
   Matches the supplied reference: no connecting line, only
   the swatch rows themselves form a very soft C-shaped arc.
   ========================================================= */

.mg-model-stage__colours {
  left: 4.4% !important;
  top: 42% !important;
  width: 235px !important;
  min-width: 235px !important;
  height: auto !important;
  padding: 0 !important;
  transform: translateY(-50%) !important;
  overflow: visible !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

.mg-model-stage__paint-tray {
  width: 235px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 10px !important;
  overflow: visible !important;
  background: transparent !important;
}

/* Absolutely no connector/track/curve line. */
.mg-model-stage__paint-tray::before,
.mg-model-stage__paint-tray::after {
  display: none !important;
  content: none !important;
}

/* Back control: keep it compact and on the same gentle arc. */
.mg-model-stage__paint-back {
  width: 190px !important;
  min-width: 190px !important;
  height: 36px !important;
  min-height: 36px !important;
  display: flex !important;
  align-items: center !important;
  gap: 13px !important;
  margin: 0 0 14px 18px !important;
  padding: 0 !important;
  transform: none !important;
  background: transparent !important;
  border: 0 !important;
}

.mg-model-stage__paint-back-icon {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
  flex: 0 0 30px !important;
  aspect-ratio: 1 / 1 !important;
  box-sizing: border-box !important;
  border-radius: 50% !important;
}

.mg-model-stage__paint-back-icon svg {
  width: 12px !important;
  height: 12px !important;
}

.mg-model-stage__paint-back-text {
  font-size: 10px !important;
}

/* Every row keeps a fixed height so the arc stays clean. */
.mg-model-stage-colour {
  width: 210px !important;
  min-width: 210px !important;
  height: 46px !important;
  min-height: 46px !important;
  flex: 0 0 46px !important;
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: visible !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* Gentle C shape — deliberately small offsets, not a big curve. */
.mg-model-stage-colour:nth-child(1) { transform: translateX(18px) !important; }
.mg-model-stage-colour:nth-child(2) { transform: translateX(6px) !important; }
.mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
.mg-model-stage-colour:nth-child(4) { transform: translateX(5px) !important; }
.mg-model-stage-colour:nth-child(5) { transform: translateX(17px) !important; }
.mg-model-stage-colour:nth-child(6) { transform: translateX(30px) !important; }

/* True circular swatches: width, height and flex-basis are identical. */
.mg-model-stage-colour__chip {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
  max-width: 30px !important;
  max-height: 30px !important;
  flex: 0 0 30px !important;
  flex-basis: 30px !important;
  aspect-ratio: 1 / 1 !important;
  box-sizing: border-box !important;
  border-radius: 50% !important;
  transform: none !important;
}

.mg-model-stage-colour:hover .mg-model-stage-colour__chip {
  transform: scale(1.05) !important;
}

/* Active swatch is only slightly larger than the others. */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 38px !important;
  height: 38px !important;
  min-width: 38px !important;
  min-height: 38px !important;
  max-width: 38px !important;
  max-height: 38px !important;
  flex: 0 0 38px !important;
  flex-basis: 38px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  transform: none !important;
  box-shadow:
    inset -4px -5px 9px rgba(0,0,0,.22),
    inset 1px 1px 3px rgba(255,255,255,.30),
    0 4px 10px rgba(0,0,0,.22),
    0 0 0 2px #fff,
    0 0 0 3px rgba(255,255,255,.20) !important;
}

/* Small pointer like the reference image. */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip::after {
  right: -8px !important;
  border-top-width: 4px !important;
  border-bottom-width: 4px !important;
  border-left-width: 6px !important;
}

.mg-model-stage-colour__copy strong {
  font-size: 10px !important;
  line-height: 1.12 !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
  font-size: 12px !important;
  line-height: 1.08 !important;
}

.mg-model-stage-colour__copy small,
.mg-model-stage-colour__copy em {
  margin-top: 2px !important;
  font-size: 7px !important;
}

@media (max-width: 1100px) {
  .mg-model-stage__colours {
    left: 22px !important;
    top: 430px !important;
    width: 205px !important;
    min-width: 205px !important;
    transform: none !important;
  }

  .mg-model-stage__paint-tray { width: 205px !important; }
  .mg-model-stage-colour { width: 190px !important; height: 42px !important; min-height: 42px !important; flex-basis: 42px !important; gap: 13px !important; }
  .mg-model-stage-colour:nth-child(1) { transform: translateX(14px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(5px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(4px) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(13px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(22px) !important; }

  .mg-model-stage-colour__chip {
    width: 28px !important; height: 28px !important;
    min-width: 28px !important; min-height: 28px !important;
    max-width: 28px !important; max-height: 28px !important;
    flex: 0 0 28px !important; flex-basis: 28px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 35px !important; height: 35px !important;
    min-width: 35px !important; min-height: 35px !important;
    max-width: 35px !important; max-height: 35px !important;
    flex: 0 0 35px !important; flex-basis: 35px !important;
  }
}

@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 14px !important;
    top: 500px !important;
    width: 180px !important;
    min-width: 180px !important;
  }

  .mg-model-stage__paint-tray { width: 180px !important; gap: 7px !important; }
  .mg-model-stage-colour { width: 168px !important; height: 38px !important; min-height: 38px !important; flex-basis: 38px !important; gap: 11px !important; }

  .mg-model-stage-colour:nth-child(1) { transform: translateX(11px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(4px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(3px) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(10px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(17px) !important; }

  .mg-model-stage-colour__chip {
    width: 25px !important; height: 25px !important;
    min-width: 25px !important; min-height: 25px !important;
    max-width: 25px !important; max-height: 25px !important;
    flex: 0 0 25px !important; flex-basis: 25px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 31px !important; height: 31px !important;
    min-width: 31px !important; min-height: 31px !important;
    max-width: 31px !important; max-height: 31px !important;
    flex: 0 0 31px !important; flex-basis: 31px !important;
  }
}
</style>

<style scoped>
/* FINAL OVERRIDE — SLIGHTLY LARGER COLOUR PALETTE */
.mg-model-stage__colours {
  width: 270px !important;
  min-width: 270px !important;
}
.mg-model-stage__paint-tray { width: 270px !important; gap: 13px !important; }
.mg-model-stage__paint-back { width: 220px !important; margin-bottom: 17px !important; }
.mg-model-stage-colour { width: 245px !important; height: 54px !important; min-height: 54px !important; flex-basis: 54px !important; gap: 18px !important; }
.mg-model-stage-colour__chip { width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; max-width: 36px !important; max-height: 36px !important; flex: 0 0 36px !important; }
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip { width: 45px !important; height: 45px !important; min-width: 45px !important; min-height: 45px !important; max-width: 45px !important; max-height: 45px !important; flex: 0 0 45px !important; }
.mg-model-stage-colour__copy strong { font-size: 12px !important; }
.mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong { font-size: 15px !important; }
.mg-model-stage-colour__copy small, .mg-model-stage-colour__copy em { font-size: 8px !important; }
@media (max-width:1100px){.mg-model-stage__colours{width:225px!important;min-width:225px!important}.mg-model-stage__paint-tray{width:225px!important}.mg-model-stage-colour{width:210px!important;height:47px!important;min-height:47px!important;flex-basis:47px!important}.mg-model-stage-colour__chip{width:31px!important;height:31px!important;min-width:31px!important;min-height:31px!important;max-width:31px!important;max-height:31px!important;flex:0 0 31px!important}.mg-model-stage-colour.is-active .mg-model-stage-colour__chip{width:39px!important;height:39px!important;min-width:39px!important;min-height:39px!important;max-width:39px!important;max-height:39px!important;flex:0 0 39px!important}}
@media (max-width:767px){.mg-model-stage__colours{width:195px!important;min-width:195px!important}.mg-model-stage__paint-tray{width:195px!important}.mg-model-stage-colour{width:180px!important;height:42px!important;min-height:42px!important;flex-basis:42px!important}.mg-model-stage-colour__chip{width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;max-width:28px!important;max-height:28px!important;flex:0 0 28px!important}.mg-model-stage-colour.is-active .mg-model-stage-colour__chip{width:35px!important;height:35px!important;min-width:35px!important;min-height:35px!important;max-width:35px!important;max-height:35px!important;flex:0 0 35px!important}}

/* =========================================================
   FINAL REFERENCE OVERRIDE — ARC PALETTE LIKE PROVIDED IMAGE
   - left-side vertical palette
   - small circular swatches
   - selected swatch larger
   - no connecting line
   - gentle C-shaped positioning created only by swatch offsets
   ========================================================= */

/* Main palette placement */
.mg-model-stage__colours {
  left: 4.2% !important;
  top: 43% !important;

  width: 300px !important;
  min-width: 300px !important;

  padding: 0 !important;
  margin: 0 !important;

  transform: translateY(-50%) !important;

  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;

  overflow: visible !important;
}

/* Back row */
.mg-model-stage__paint-back {
  width: 220px !important;
  min-width: 220px !important;
  height: 44px !important;
  min-height: 44px !important;

  display: flex !important;
  align-items: center !important;

  gap: 16px !important;

  margin: 0 0 20px 48px !important;
  padding: 0 !important;

  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;

  color: #fff !important;

  transform: none !important;
}

.mg-model-stage__paint-back-icon {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  flex: 0 0 40px !important;

  display: grid !important;
  place-items: center !important;

  border: 1.5px solid rgba(255,255,255,.82) !important;
  border-radius: 50% !important;

  background: rgba(0,0,0,.18) !important;
  box-shadow: none !important;
}

.mg-model-stage__paint-back-icon svg {
  width: 17px !important;
  height: 17px !important;
}

.mg-model-stage__paint-back-text {
  color: rgba(255,255,255,.94) !important;

  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: .01em !important;
  text-transform: uppercase !important;
}

/* Palette stack */
.mg-model-stage__paint-tray {
  width: 300px !important;
  height: auto !important;

  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;

  gap: 14px !important;

  padding: 0 !important;
  margin: 0 !important;

  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;

  overflow: visible !important;
}

/* No line / track behind the colours */
.mg-model-stage__paint-tray::before,
.mg-model-stage__paint-tray::after {
  display: none !important;
  content: none !important;
}

/* Colour row */
.mg-model-stage-colour {
  width: 280px !important;
  min-width: 280px !important;

  height: 56px !important;
  min-height: 56px !important;
  flex: 0 0 56px !important;

  display: flex !important;
  align-items: center !important;

  gap: 20px !important;

  padding: 0 !important;
  margin: 0 !important;

  overflow: visible !important;

  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;

  color: #fff !important;
  text-align: left !important;
}

/* Reference-style arc.
   White and blue sit furthest to the right.
   Silver sits furthest left and becomes the visual focal point. */
.mg-model-stage-colour:nth-child(1) {
  transform: translateX(44px) !important;
}
.mg-model-stage-colour:nth-child(2) {
  transform: translateX(16px) !important;
}
.mg-model-stage-colour:nth-child(3) {
  transform: translateX(0) !important;
}
.mg-model-stage-colour:nth-child(4) {
  transform: translateX(16px) !important;
}
.mg-model-stage-colour:nth-child(5) {
  transform: translateX(45px) !important;
}
.mg-model-stage-colour:nth-child(6) {
  transform: translateX(78px) !important;
}

/* Small glossy circular swatch */
.mg-model-stage-colour__chip {
  position: relative !important;

  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  max-width: 40px !important;
  max-height: 40px !important;

  flex: 0 0 40px !important;

  aspect-ratio: 1 / 1 !important;
  box-sizing: border-box !important;

  border: 1px solid rgba(255,255,255,.72) !important;
  border-radius: 50% !important;

  background:
    radial-gradient(
      circle at 32% 24%,
      rgba(255,255,255,.72) 0%,
      rgba(255,255,255,.20) 17%,
      transparent 40%
    ),
    var(--paint) !important;

  box-shadow:
    inset -4px -5px 9px rgba(0,0,0,.28),
    inset 1px 1px 3px rgba(255,255,255,.24),
    0 3px 8px rgba(0,0,0,.22) !important;

  transform: none !important;
  transition:
    width .25s ease,
    height .25s ease,
    box-shadow .25s ease,
    transform .25s ease !important;
}

/* Selected colour is larger, as in the reference */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 62px !important;
  height: 62px !important;
  min-width: 62px !important;
  min-height: 62px !important;
  max-width: 62px !important;
  max-height: 62px !important;

  flex: 0 0 62px !important;

  border: 2px solid #fff !important;
  border-radius: 50% !important;

  box-shadow:
    inset -5px -7px 12px rgba(0,0,0,.24),
    inset 1px 1px 4px rgba(255,255,255,.34),
    0 5px 12px rgba(0,0,0,.24),
    0 0 0 4px rgba(255,255,255,.88) !important;

  transform: none !important;
}

/* Selected pointer */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip::after {
  content: "" !important;

  position: absolute !important;
  right: -15px !important;
  top: 50% !important;

  width: 0 !important;
  height: 0 !important;

  transform: translateY(-50%) !important;

  border-top: 7px solid transparent !important;
  border-bottom: 7px solid transparent !important;
  border-left: 10px solid #fff !important;

  background: transparent !important;
}

/* Prevent any older selected pseudo element from appearing elsewhere */
.mg-model-stage-colour.is-active::before,
.mg-model-stage-colour.is-active::after {
  display: none !important;
}

/* Text */
.mg-model-stage-colour__copy {
  min-width: 0 !important;

  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.mg-model-stage-colour__copy strong {
  display: block !important;

  color: rgba(255,255,255,.96) !important;

  font-family: "Manrope", sans-serif !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  line-height: 1.12 !important;

  letter-spacing: .005em !important;
  text-transform: uppercase !important;
  white-space: nowrap !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 1.06 !important;
}

.mg-model-stage-colour__copy small,
.mg-model-stage-colour__copy em {
  display: block !important;

  margin-top: 4px !important;

  color: rgba(255,255,255,.82) !important;

  font-family: "Manrope", sans-serif !important;
  font-size: 11px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: 1 !important;

  letter-spacing: .02em !important;
  text-transform: uppercase !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours {
    left: 24px !important;
    top: 430px !important;

    width: 250px !important;
    min-width: 250px !important;

    transform: none !important;
  }

  .mg-model-stage__paint-back {
    width: 190px !important;
    margin-left: 38px !important;
    margin-bottom: 16px !important;
  }

  .mg-model-stage__paint-tray {
    width: 250px !important;
    gap: 11px !important;
  }

  .mg-model-stage-colour {
    width: 235px !important;
    min-width: 235px !important;

    height: 49px !important;
    min-height: 49px !important;
    flex-basis: 49px !important;

    gap: 16px !important;
  }

  .mg-model-stage-colour:nth-child(1) { transform: translateX(34px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(12px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(12px) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(35px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(58px) !important; }

  .mg-model-stage-colour__chip {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
    min-height: 34px !important;
    max-width: 34px !important;
    max-height: 34px !important;
    flex: 0 0 34px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 52px !important;
    height: 52px !important;
    min-width: 52px !important;
    min-height: 52px !important;
    max-width: 52px !important;
    max-height: 52px !important;
    flex: 0 0 52px !important;
  }

  .mg-model-stage-colour__copy strong {
    font-size: 11px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
    font-size: 15px !important;
  }

  .mg-model-stage-colour__copy small,
  .mg-model-stage-colour__copy em {
    font-size: 9px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__colours {
    left: 12px !important;
    top: 495px !important;

    width: 205px !important;
    min-width: 205px !important;
  }

  .mg-model-stage__paint-back {
    width: 160px !important;
    height: 34px !important;
    min-height: 34px !important;

    gap: 11px !important;
    margin: 0 0 13px 28px !important;
  }

  .mg-model-stage__paint-back-icon {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
    min-height: 30px !important;
    flex: 0 0 30px !important;
  }

  .mg-model-stage__paint-back-text {
    font-size: 10px !important;
  }

  .mg-model-stage__paint-tray {
    width: 205px !important;
    gap: 8px !important;
  }

  .mg-model-stage-colour {
    width: 195px !important;
    min-width: 195px !important;

    height: 42px !important;
    min-height: 42px !important;
    flex-basis: 42px !important;

    gap: 13px !important;
  }

  .mg-model-stage-colour:nth-child(1) { transform: translateX(25px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(9px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(9px) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(25px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(42px) !important; }

  .mg-model-stage-colour__chip {
    width: 29px !important;
    height: 29px !important;
    min-width: 29px !important;
    min-height: 29px !important;
    max-width: 29px !important;
    max-height: 29px !important;
    flex: 0 0 29px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 43px !important;
    height: 43px !important;
    min-width: 43px !important;
    min-height: 43px !important;
    max-width: 43px !important;
    max-height: 43px !important;
    flex: 0 0 43px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip::after {
    right: -11px !important;

    border-top-width: 5px !important;
    border-bottom-width: 5px !important;
    border-left-width: 7px !important;
  }

  .mg-model-stage-colour__copy strong {
    font-size: 9px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__copy strong {
    font-size: 12px !important;
  }

  .mg-model-stage-colour__copy small,
  .mg-model-stage-colour__copy em {
    margin-top: 2px !important;
    font-size: 7px !important;
  }
}

/* =========================================================
   FINAL CLEANUP — REMOVE PALETTE EXTRA BUTTONS
   ========================================================= */
.mg-model-stage__paint-back {
  display: none !important;
}

/* If any old decorative button-like element survived older CSS,
   hide it inside the palette only. */
.mg-model-stage__colours > button:not(.mg-model-stage-colour) {
  display: none !important;
}


/* =========================================================
   FINAL PALETTE SPACING OVERRIDE
   Increase colour row/line height to match the reference image
   while preserving the same circles, arc, text and paint logic.
   ========================================================= */

.mg-model-stage__colours {
  top: 44% !important;
}

.mg-model-stage__paint-tray {
  gap: 22px !important;
}

/* Each colour option gets more vertical breathing room */
.mg-model-stage-colour {
  height: 72px !important;
  min-height: 72px !important;
  flex: 0 0 72px !important;
  align-items: center !important;
}

/* Keep circle size unchanged */
.mg-model-stage-colour__chip {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  max-width: 40px !important;
  max-height: 40px !important;
  flex: 0 0 40px !important;
}

/* Selected swatch stays larger */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 62px !important;
  height: 62px !important;
  min-width: 62px !important;
  min-height: 62px !important;
  max-width: 62px !important;
  max-height: 62px !important;
  flex: 0 0 62px !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__paint-tray {
    gap: 17px !important;
  }

  .mg-model-stage-colour {
    height: 62px !important;
    min-height: 62px !important;
    flex-basis: 62px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__paint-tray {
    gap: 13px !important;
  }

  .mg-model-stage-colour {
    height: 52px !important;
    min-height: 52px !important;
    flex-basis: 52px !important;
  }
}


/* =========================================================
   FINAL PALETTE POSITION OVERRIDE
   Move the complete colour palette higher on the left side
   while keeping the current row height, arc, circles and labels.
   ========================================================= */

/* Desktop: move palette upward */
.mg-model-stage__colours {
  top: 36% !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours {
    top: 355px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__colours {
    top: 430px !important;
  }
}


/* =========================================================
   FINAL CURVE SHAPE OVERRIDE
   Slightly stronger vertical arc for the exterior-finish palette.
   Existing position, row height, swatch sizes and paint behaviour
   remain unchanged.
   ========================================================= */

/* Desktop */
.mg-model-stage-colour:nth-child(1) { transform: translateX(34px) !important; }
.mg-model-stage-colour:nth-child(2) { transform: translateX(13px) !important; }
.mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
.mg-model-stage-colour:nth-child(4) { transform: translateX(7px) !important; }
.mg-model-stage-colour:nth-child(5) { transform: translateX(25px) !important; }
.mg-model-stage-colour:nth-child(6) { transform: translateX(50px) !important; }

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage-colour:nth-child(1) { transform: translateX(38px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(15px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(8px) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(28px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(54px) !important; }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage-colour:nth-child(1) { transform: translateX(29px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(11px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(7px) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(29px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(47px) !important; }
}


/* =========================================================
   FINAL C-SHAPE PALETTE OVERRIDE
   Stronger C-shaped colour arrangement using only row offsets.
   No connecting line is added.
   Existing position, spacing, circle sizes, selected style and
   paint-changing behaviour remain unchanged.
   ========================================================= */

/* Desktop — C shape */
.mg-model-stage-colour:nth-child(1) { transform: translateX(72px) !important; }
.mg-model-stage-colour:nth-child(2) { transform: translateX(38px) !important; }
.mg-model-stage-colour:nth-child(3) { transform: translateX(10px) !important; }
.mg-model-stage-colour:nth-child(4) { transform: translateX(0) !important; }
.mg-model-stage-colour:nth-child(5) { transform: translateX(28px) !important; }
.mg-model-stage-colour:nth-child(6) { transform: translateX(68px) !important; }

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage-colour:nth-child(1) { transform: translateX(58px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(30px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(8px) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(22px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(54px) !important; }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage-colour:nth-child(1) { transform: translateX(44px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(24px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(7px) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(18px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(40px) !important; }
}


/* =========================================================
   FINAL SPECS CURVE OVERRIDE
   Arrange the four right-side performance specs in a C-shaped
   vertical curve, similar to the exterior colour palette.
   ========================================================= */

.mg-model-stage__specs {
  right: 3.2% !important;
  top: 24% !important;
  width: 230px !important;
  gap: 34px !important;
  overflow: visible !important;
}

/* Each spec keeps its vertical value/label layout */
.mg-model-stage__specs > div {
  width: 200px !important;
  min-width: 200px !important;
  align-items: flex-end !important;
  text-align: right !important;
  transition: transform .3s ease !important;
}

/* C-shape curve */
.mg-model-stage__specs > div:nth-child(1) {
  transform: translateX(34px) !important;
}
.mg-model-stage__specs > div:nth-child(2) {
  transform: translateX(10px) !important;
}
.mg-model-stage__specs > div:nth-child(3) {
  transform: translateX(0) !important;
}
.mg-model-stage__specs > div:nth-child(4) {
  transform: translateX(30px) !important;
}

/* Slightly clearer text like the reference */
.mg-model-stage__specs strong {
  font-size: 34px !important;
  line-height: .92 !important;
}

.mg-model-stage__specs strong small {
  font-size: 12px !important;
}

.mg-model-stage__specs span {
  margin-top: 6px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__specs {
    right: 20px !important;
    top: 180px !important;
    width: 170px !important;
    gap: 25px !important;
  }

  .mg-model-stage__specs > div {
    width: 155px !important;
    min-width: 155px !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(26px) !important;
  }
  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(8px) !important;
  }
  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(23px) !important;
  }

  .mg-model-stage__specs strong {
    font-size: 27px !important;
  }

  .mg-model-stage__specs strong small,
  .mg-model-stage__specs span {
    font-size: 9px !important;
  }
}

/* Mobile: keep readable and reduce the curve */
@media (max-width: 767px) {
  .mg-model-stage__specs {
    right: 12px !important;
    top: 205px !important;
    width: 135px !important;
    gap: 18px !important;
  }

  .mg-model-stage__specs > div {
    width: 122px !important;
    min-width: 122px !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(18px) !important;
  }
  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(6px) !important;
  }
  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(16px) !important;
  }

  .mg-model-stage__specs strong {
    font-size: 22px !important;
  }

  .mg-model-stage__specs strong small,
  .mg-model-stage__specs span {
    font-size: 8px !important;
  }
}


/* =========================================================
   FINAL RIGHT SPECS — OPPOSITE C CURVE
   Mirror the left colour-palette curve on the right side.
   Top/bottom specs move LEFT; middle specs move RIGHT.
   ========================================================= */

.mg-model-stage__specs {
  right: 4.8% !important;
  top: 18.5% !important;
  width: 230px !important;
  gap: 34px !important;
  overflow: visible !important;
  text-align: right !important;
}

.mg-model-stage__specs > div {
  width: 200px !important;
  min-width: 200px !important;
  align-items: flex-end !important;
  text-align: right !important;
}

/* Opposite / mirrored C shape on the RIGHT */
.mg-model-stage__specs > div:nth-child(1) {
  transform: translateX(-42px) !important;
}

.mg-model-stage__specs > div:nth-child(2) {
  transform: translateX(-12px) !important;
}

.mg-model-stage__specs > div:nth-child(3) {
  transform: translateX(0) !important;
}

.mg-model-stage__specs > div:nth-child(4) {
  transform: translateX(-36px) !important;
}

.mg-model-stage__specs strong {
  font-size: 34px !important;
  line-height: .92 !important;
}

.mg-model-stage__specs strong small {
  font-size: 12px !important;
}

.mg-model-stage__specs span {
  margin-top: 6px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__specs {
    right: 28px !important;
    top: 170px !important;
    width: 180px !important;
    gap: 25px !important;
  }

  .mg-model-stage__specs > div {
    width: 160px !important;
    min-width: 160px !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(-30px) !important;
  }

  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(-9px) !important;
  }

  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }

  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(-26px) !important;
  }

  .mg-model-stage__specs strong {
    font-size: 27px !important;
  }

  .mg-model-stage__specs strong small,
  .mg-model-stage__specs span {
    font-size: 9px !important;
  }
}

/* Mobile — smaller mirrored curve */
@media (max-width: 767px) {
  .mg-model-stage__specs {
    right: 12px !important;
    width: 140px !important;
    gap: 18px !important;
  }

  .mg-model-stage__specs > div {
    width: 125px !important;
    min-width: 125px !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(-20px) !important;
  }

  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(-6px) !important;
  }

  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }

  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(-17px) !important;
  }

  .mg-model-stage__specs strong {
    font-size: 22px !important;
  }

  .mg-model-stage__specs strong small,
  .mg-model-stage__specs span {
    font-size: 8px !important;
  }
}


/* =========================================================
   FINAL RIGHT SPECS SPACING OVERRIDE
   Increase the vertical line/row height between:
   480 km / 6.3 s / 170 kW / 64 kWh
   while preserving the opposite C-curve layout.
   ========================================================= */

.mg-model-stage__specs {
  gap: 48px !important;
}

.mg-model-stage__specs > div {
  min-height: 76px !important;
  justify-content: center !important;
}

.mg-model-stage__specs strong {
  line-height: 1 !important;
}

.mg-model-stage__specs span {
  margin-top: 9px !important;
  line-height: 1.25 !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__specs {
    gap: 36px !important;
  }

  .mg-model-stage__specs > div {
    min-height: 64px !important;
  }

  .mg-model-stage__specs span {
    margin-top: 7px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__specs {
    gap: 26px !important;
  }

  .mg-model-stage__specs > div {
    min-height: 54px !important;
  }

  .mg-model-stage__specs span {
    margin-top: 5px !important;
  }
}


/* =========================================================
   FINAL BALANCED LEFT / RIGHT SIDE RHYTHM
   Left: 6 exterior colours
   Right: 4 performance specs

   Both side panels occupy the same vertical visual height.
   The right-side four rows are distributed evenly across the
   same top/bottom bounds as the six colour rows.
   Existing colour selection and vehicle paint behaviour remain.
   ========================================================= */

.mg-model-stage__colours,
.mg-model-stage__specs {
  top: 24% !important;
  height: 430px !important;
  box-sizing: border-box !important;
}

/* LEFT — six colour rows fill the common height */
.mg-model-stage__colours {
  left: 3.8% !important;
  width: 230px !important;
  min-width: 230px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.mg-model-stage__paint-tray {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  gap: 0 !important;
}

.mg-model-stage-colour {
  height: 62px !important;
  min-height: 62px !important;
  flex: 0 0 62px !important;
  display: flex !important;
  align-items: center !important;
}

/* Preserve the left C curve */
.mg-model-stage-colour:nth-child(1) {
  transform: translateX(42px) !important;
}
.mg-model-stage-colour:nth-child(2) {
  transform: translateX(17px) !important;
}
.mg-model-stage-colour:nth-child(3) {
  transform: translateX(0) !important;
}
.mg-model-stage-colour:nth-child(4) {
  transform: translateX(9px) !important;
}
.mg-model-stage-colour:nth-child(5) {
  transform: translateX(32px) !important;
}
.mg-model-stage-colour:nth-child(6) {
  transform: translateX(62px) !important;
}

/* RIGHT — four specs fill exactly the same common height */
.mg-model-stage__specs {
  right: 4.8% !important;
  width: 230px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  gap: 0 !important;
  overflow: visible !important;
  text-align: right !important;
}

.mg-model-stage__specs > div {
  width: 200px !important;
  height: 62px !important;
  min-height: 62px !important;
  flex: 0 0 62px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: flex-end !important;
  text-align: right !important;
}

/* Mirrored C curve on the right */
.mg-model-stage__specs > div:nth-child(1) {
  transform: translateX(-42px) !important;
}
.mg-model-stage__specs > div:nth-child(2) {
  transform: translateX(-10px) !important;
}
.mg-model-stage__specs > div:nth-child(3) {
  transform: translateX(0) !important;
}
.mg-model-stage__specs > div:nth-child(4) {
  transform: translateX(-36px) !important;
}

.mg-model-stage__specs strong {
  line-height: 1 !important;
}

.mg-model-stage__specs span {
  margin-top: 7px !important;
  line-height: 1.2 !important;
}

/* TABLET */
@media (max-width: 1100px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    top: 300px !important;
    height: 330px !important;
  }

  .mg-model-stage__colours {
    left: 28px !important;
    width: 180px !important;
    min-width: 180px !important;
  }

  .mg-model-stage__specs {
    right: 28px !important;
    width: 180px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 52px !important;
    min-height: 52px !important;
    flex-basis: 52px !important;
  }

  .mg-model-stage__specs > div {
    width: 160px !important;
  }

  .mg-model-stage-colour:nth-child(1) {
    transform: translateX(30px) !important;
  }
  .mg-model-stage-colour:nth-child(2) {
    transform: translateX(12px) !important;
  }
  .mg-model-stage-colour:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage-colour:nth-child(4) {
    transform: translateX(7px) !important;
  }
  .mg-model-stage-colour:nth-child(5) {
    transform: translateX(23px) !important;
  }
  .mg-model-stage-colour:nth-child(6) {
    transform: translateX(44px) !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(-30px) !important;
  }
  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(-8px) !important;
  }
  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(-26px) !important;
  }
}

/* MOBILE */
@media (max-width: 767px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    top: 410px !important;
    height: 270px !important;
  }

  .mg-model-stage__colours {
    left: 12px !important;
    width: 145px !important;
    min-width: 145px !important;
  }

  .mg-model-stage__specs {
    right: 12px !important;
    width: 140px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 42px !important;
    min-height: 42px !important;
    flex-basis: 42px !important;
  }

  .mg-model-stage__specs > div {
    width: 125px !important;
  }

  .mg-model-stage-colour:nth-child(1) {
    transform: translateX(22px) !important;
  }
  .mg-model-stage-colour:nth-child(2) {
    transform: translateX(9px) !important;
  }
  .mg-model-stage-colour:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage-colour:nth-child(4) {
    transform: translateX(6px) !important;
  }
  .mg-model-stage-colour:nth-child(5) {
    transform: translateX(21px) !important;
  }
  .mg-model-stage-colour:nth-child(6) {
    transform: translateX(35px) !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(-20px) !important;
  }
  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(-6px) !important;
  }
  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(-17px) !important;
  }
}


/* =========================================================
   FINAL BOTH-SIDES CENTERED OVERRIDE
   Vertically center the LEFT colour palette and RIGHT specs
   around the same center line of the stage.

   Keeps:
   - existing colour data / paint functionality
   - left C-shaped palette
   - mirrored right specs curve
   - equal visual balance on both sides
   ========================================================= */

/* Shared vertical centre */
.mg-model-stage__colours,
.mg-model-stage__specs {
  top: 46% !important;
  bottom: auto !important;
  height: 430px !important;
  box-sizing: border-box !important;
}

/* LEFT */
.mg-model-stage__colours {
  left: 3.8% !important;
  right: auto !important;
  width: 230px !important;
  min-width: 230px !important;
  transform: translateY(-50%) !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.mg-model-stage__paint-tray {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  gap: 0 !important;
}

.mg-model-stage-colour {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  width: 205px !important;
  height: 62px !important;
  min-height: 62px !important;
  flex: 0 0 62px !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
}

/* Left C curve */
.mg-model-stage-colour:nth-child(1) {
  transform: translateX(62px) !important;
}
.mg-model-stage-colour:nth-child(2) {
  transform: translateX(30px) !important;
}
.mg-model-stage-colour:nth-child(3) {
  transform: translateX(7px) !important;
}
.mg-model-stage-colour:nth-child(4) {
  transform: translateX(0) !important;
}
.mg-model-stage-colour:nth-child(5) {
  transform: translateX(25px) !important;
}
.mg-model-stage-colour:nth-child(6) {
  transform: translateX(58px) !important;
}

/* RIGHT */
.mg-model-stage__specs {
  left: auto !important;
  right: 4.8% !important;
  width: 230px !important;
  transform: translateY(-50%) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  gap: 0 !important;
  overflow: visible !important;
  text-align: right !important;
}

.mg-model-stage__specs > div {
  position: relative !important;
  top: auto !important;
  right: auto !important;
  width: 200px !important;
  height: 62px !important;
  min-height: 62px !important;
  flex: 0 0 62px !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: flex-end !important;
  text-align: right !important;
}

/* Mirrored curve on right */
.mg-model-stage__specs > div:nth-child(1) {
  transform: translateX(-58px) !important;
}
.mg-model-stage__specs > div:nth-child(2) {
  transform: translateX(-15px) !important;
}
.mg-model-stage__specs > div:nth-child(3) {
  transform: translateX(0) !important;
}
.mg-model-stage__specs > div:nth-child(4) {
  transform: translateX(-52px) !important;
}

.mg-model-stage__specs strong {
  line-height: 1 !important;
}

.mg-model-stage__specs span {
  margin-top: 7px !important;
  line-height: 1.2 !important;
}

/* TABLET */
@media (max-width: 1100px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    top: 46% !important;
    height: 330px !important;
  }

  .mg-model-stage__colours {
    left: 28px !important;
    width: 180px !important;
    min-width: 180px !important;
  }

  .mg-model-stage__specs {
    right: 28px !important;
    width: 180px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 52px !important;
    min-height: 52px !important;
    flex-basis: 52px !important;
  }

  .mg-model-stage-colour {
    width: 160px !important;
  }

  .mg-model-stage__specs > div {
    width: 160px !important;
  }

  .mg-model-stage-colour:nth-child(1) {
    transform: translateX(44px) !important;
  }
  .mg-model-stage-colour:nth-child(2) {
    transform: translateX(22px) !important;
  }
  .mg-model-stage-colour:nth-child(3) {
    transform: translateX(5px) !important;
  }
  .mg-model-stage-colour:nth-child(4) {
    transform: translateX(0) !important;
  }
  .mg-model-stage-colour:nth-child(5) {
    transform: translateX(18px) !important;
  }
  .mg-model-stage-colour:nth-child(6) {
    transform: translateX(41px) !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(-41px) !important;
  }
  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(-11px) !important;
  }
  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(-37px) !important;
  }
}

/* MOBILE */
@media (max-width: 767px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    top: 49% !important;
    height: 270px !important;
  }

  .mg-model-stage__colours {
    left: 12px !important;
    width: 145px !important;
    min-width: 145px !important;
  }

  .mg-model-stage__specs {
    right: 12px !important;
    width: 140px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 42px !important;
    min-height: 42px !important;
    flex-basis: 42px !important;
  }

  .mg-model-stage-colour {
    width: 130px !important;
  }

  .mg-model-stage__specs > div {
    width: 125px !important;
  }

  .mg-model-stage-colour:nth-child(1) {
    transform: translateX(34px) !important;
  }
  .mg-model-stage-colour:nth-child(2) {
    transform: translateX(17px) !important;
  }
  .mg-model-stage-colour:nth-child(3) {
    transform: translateX(4px) !important;
  }
  .mg-model-stage-colour:nth-child(4) {
    transform: translateX(0) !important;
  }
  .mg-model-stage-colour:nth-child(5) {
    transform: translateX(14px) !important;
  }
  .mg-model-stage-colour:nth-child(6) {
    transform: translateX(31px) !important;
  }

  .mg-model-stage__specs > div:nth-child(1) {
    transform: translateX(-31px) !important;
  }
  .mg-model-stage__specs > div:nth-child(2) {
    transform: translateX(-8px) !important;
  }
  .mg-model-stage__specs > div:nth-child(3) {
    transform: translateX(0) !important;
  }
  .mg-model-stage__specs > div:nth-child(4) {
    transform: translateX(-28px) !important;
  }
}


/* =========================================================
   FINAL POSITION OVERRIDE — MOVE BOTH SIDE SECTIONS UP
   Exterior colours + vehicle specifications only.
   ========================================================= */

.mg-model-stage__colours,
.mg-model-stage__specs {
  top: 40% !important;
  bottom: auto !important;
  transform: translateY(-50%) !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    top: 39% !important;
    bottom: auto !important;
    transform: translateY(-50%) !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    top: 40% !important;
    bottom: auto !important;
    transform: translateY(-50%) !important;
  }
}


/* =========================================================
   FINAL COLOUR SWATCH SIZE — SLIGHTLY SMALLER CIRCLES ONLY
   Position, colour names, paint behaviour and specs unchanged.
   ========================================================= */

.mg-model-stage-colour__chip {
  width: 34px !important;
  height: 34px !important;
  min-width: 34px !important;
  min-height: 34px !important;
}

/* Keep the selected colour slightly larger, but more compact */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 50px !important;
  height: 50px !important;
  min-width: 50px !important;
  min-height: 50px !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage-colour__chip {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
    min-height: 30px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 42px !important;
    height: 42px !important;
    min-width: 42px !important;
    min-height: 42px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage-colour__chip {
    width: 26px !important;
    height: 26px !important;
    min-width: 26px !important;
    min-height: 26px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
  }
}


/* =========================================================
   FINAL COLOUR SWATCH SHAPE — PERFECT CIRCLES
   Prevent flex/grid sizing from stretching swatches into ovals.
   ========================================================= */

.mg-model-stage-colour__chip {
  box-sizing: border-box !important;
  width: 34px !important;
  height: 34px !important;
  min-width: 34px !important;
  min-height: 34px !important;
  max-width: 34px !important;
  max-height: 34px !important;
  flex: 0 0 34px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
}

/* Selected swatch stays round */
.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 50px !important;
  height: 50px !important;
  min-width: 50px !important;
  min-height: 50px !important;
  max-width: 50px !important;
  max-height: 50px !important;
  flex-basis: 50px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
}

@media (max-width: 1100px) {
  .mg-model-stage-colour__chip {
    width: 30px !important;
    height: 30px !important;
    min-width: 30px !important;
    min-height: 30px !important;
    max-width: 30px !important;
    max-height: 30px !important;
    flex-basis: 30px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 42px !important;
    height: 42px !important;
    min-width: 42px !important;
    min-height: 42px !important;
    max-width: 42px !important;
    max-height: 42px !important;
    flex-basis: 42px !important;
  }
}

@media (max-width: 767px) {
  .mg-model-stage-colour__chip {
    width: 26px !important;
    height: 26px !important;
    min-width: 26px !important;
    min-height: 26px !important;
    max-width: 26px !important;
    max-height: 26px !important;
    flex-basis: 26px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    max-width: 36px !important;
    max-height: 36px !important;
    flex-basis: 36px !important;
  }
}



/* =========================================================
   FINAL EXTRA-SMALL SIDE UI
   Smaller colour palette + vehicle specifications.
   This block is intentionally last so it wins over all
   earlier desktop/tablet/mobile overrides.
   ========================================================= */

/* Desktop */
.mg-model-stage__colours,
.mg-model-stage__specs {
  height: 330px !important;
}

.mg-model-stage__colours {
  width: 185px !important;
  min-width: 185px !important;
}

.mg-model-stage__specs {
  width: 180px !important;
}

.mg-model-stage-colour,
.mg-model-stage__specs > div {
  height: 48px !important;
  min-height: 48px !important;
  flex-basis: 48px !important;
}

.mg-model-stage-colour {
  width: 164px !important;
}

.mg-model-stage__specs > div {
  width: 158px !important;
}

.mg-model-stage__specs strong {
  font-size: clamp(22px, 1.3vw, 27px) !important;
  line-height: .94 !important;
}

.mg-model-stage__specs strong small {
  margin-left: 3px !important;
  font-size: clamp(7px, .4vw, 9px) !important;
}

.mg-model-stage__specs span {
  margin-top: 4px !important;
  font-size: clamp(7px, .38vw, 9px) !important;
  line-height: 1.1 !important;
}

/* Smaller colour circles */
.mg-model-stage-colour__chip {
  box-sizing: border-box !important;
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  min-height: 28px !important;
  max-width: 28px !important;
  max-height: 28px !important;
  flex: 0 0 28px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
  min-height: 42px !important;
  max-width: 42px !important;
  max-height: 42px !important;
  flex: 0 0 42px !important;
}

/* Tighter C curve */
.mg-model-stage-colour:nth-child(1) { transform: translateX(44px) !important; }
.mg-model-stage-colour:nth-child(2) { transform: translateX(22px) !important; }
.mg-model-stage-colour:nth-child(3) { transform: translateX(5px) !important; }
.mg-model-stage-colour:nth-child(4) { transform: translateX(0) !important; }
.mg-model-stage-colour:nth-child(5) { transform: translateX(18px) !important; }
.mg-model-stage-colour:nth-child(6) { transform: translateX(42px) !important; }

.mg-model-stage__specs > div:nth-child(1) { transform: translateX(-41px) !important; }
.mg-model-stage__specs > div:nth-child(2) { transform: translateX(-11px) !important; }
.mg-model-stage__specs > div:nth-child(3) { transform: translateX(0) !important; }
.mg-model-stage__specs > div:nth-child(4) { transform: translateX(-37px) !important; }

/* Large / 2K / 4K */
@media (min-width: 1800px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    height: 330px !important;
  }

  .mg-model-stage__colours {
    width: 185px !important;
    min-width: 185px !important;
  }

  .mg-model-stage__specs {
    width: 180px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 48px !important;
    min-height: 48px !important;
    flex-basis: 48px !important;
  }

  .mg-model-stage__specs strong { font-size: 27px !important; }
  .mg-model-stage__specs strong small { font-size: 9px !important; }
  .mg-model-stage__specs span { font-size: 9px !important; }
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    height: 270px !important;
  }

  .mg-model-stage__colours {
    width: 145px !important;
    min-width: 145px !important;
  }

  .mg-model-stage__specs {
    width: 142px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 41px !important;
    min-height: 41px !important;
    flex-basis: 41px !important;
  }

  .mg-model-stage-colour { width: 130px !important; }
  .mg-model-stage__specs > div { width: 128px !important; }

  .mg-model-stage__specs strong { font-size: 20px !important; }
  .mg-model-stage__specs strong small { font-size: 7px !important; }
  .mg-model-stage__specs span { font-size: 6.5px !important; }

  .mg-model-stage-colour__chip {
    width: 25px !important;
    height: 25px !important;
    min-width: 25px !important;
    min-height: 25px !important;
    max-width: 25px !important;
    max-height: 25px !important;
    flex: 0 0 25px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    max-width: 36px !important;
    max-height: 36px !important;
    flex: 0 0 36px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage__colours,
  .mg-model-stage__specs {
    height: 225px !important;
  }

  .mg-model-stage__colours {
    left: 10px !important;
    width: 120px !important;
    min-width: 120px !important;
  }

  .mg-model-stage__specs {
    right: 10px !important;
    width: 116px !important;
  }

  .mg-model-stage-colour,
  .mg-model-stage__specs > div {
    height: 34px !important;
    min-height: 34px !important;
    flex-basis: 34px !important;
  }

  .mg-model-stage-colour { width: 106px !important; }
  .mg-model-stage__specs > div { width: 103px !important; }

  .mg-model-stage__specs strong { font-size: 17px !important; }
  .mg-model-stage__specs strong small { font-size: 6px !important; }
  .mg-model-stage__specs span { font-size: 5.5px !important; }

  .mg-model-stage-colour__chip {
    width: 22px !important;
    height: 22px !important;
    min-width: 22px !important;
    min-height: 22px !important;
    max-width: 22px !important;
    max-height: 22px !important;
    flex: 0 0 22px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 31px !important;
    height: 31px !important;
    min-width: 31px !important;
    min-height: 31px !important;
    max-width: 31px !important;
    max-height: 31px !important;
    flex: 0 0 31px !important;
  }

  .mg-model-stage-colour:nth-child(1) { transform: translateX(28px) !important; }
  .mg-model-stage-colour:nth-child(2) { transform: translateX(14px) !important; }
  .mg-model-stage-colour:nth-child(3) { transform: translateX(3px) !important; }
  .mg-model-stage-colour:nth-child(4) { transform: translateX(0) !important; }
  .mg-model-stage-colour:nth-child(5) { transform: translateX(12px) !important; }
  .mg-model-stage-colour:nth-child(6) { transform: translateX(26px) !important; }

  .mg-model-stage__specs > div:nth-child(1) { transform: translateX(-26px) !important; }
  .mg-model-stage__specs > div:nth-child(2) { transform: translateX(-7px) !important; }
  .mg-model-stage__specs > div:nth-child(3) { transform: translateX(0) !important; }
  .mg-model-stage__specs > div:nth-child(4) { transform: translateX(-23px) !important; }
}



/* =========================================================
   FINAL COLOUR PALETTE SIZE TUNING
   Only the colour circles are made a little smaller.
========================================================= */

/* Desktop */
.mg-model-stage-colour__chip {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
  max-width: 30px !important;
  max-height: 30px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  flex: 0 0 30px !important;
  box-sizing: border-box !important;
}

.mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  max-width: 44px !important;
  max-height: 44px !important;
  flex: 0 0 44px !important;
  transform: none !important;
}

/* Tablet */
@media (max-width: 1100px) {
  .mg-model-stage-colour__chip {
    width: 27px !important;
    height: 27px !important;
    min-width: 27px !important;
    min-height: 27px !important;
    max-width: 27px !important;
    max-height: 27px !important;
    flex: 0 0 27px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
    min-height: 38px !important;
    max-width: 38px !important;
    max-height: 38px !important;
    flex: 0 0 38px !important;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .mg-model-stage-colour__chip {
    width: 24px !important;
    height: 24px !important;
    min-width: 24px !important;
    min-height: 24px !important;
    max-width: 24px !important;
    max-height: 24px !important;
    flex: 0 0 24px !important;
  }

  .mg-model-stage-colour.is-active .mg-model-stage-colour__chip {
    width: 33px !important;
    height: 33px !important;
    min-width: 33px !important;
    min-height: 33px !important;
    max-width: 33px !important;
    max-height: 33px !important;
    flex: 0 0 33px !important;
  }
}

</style>
  