<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

/* =========================================================
   MODEL

   IMPORTANT:
   The direct GLB loading pattern is intentionally unchanged.
   HomeView mounts this component only after model-viewer has
   already been registered after the preloader.
========================================================= */

const modelPath = `${import.meta.env.BASE_URL}models/mg-car.glb`;
const modelViewer = ref(null);
const modelLoaded = ref(false);
const modelError = ref(false);

/* =========================================================
   COLOUR VARIANTS

   The GLB contains an exact material named "carpaint", so the
   selector targets that material instead of tinting the entire
   model. This keeps glass, wheels, lights and trim untouched.
========================================================= */

const selectedColorId = ref("cosmic-silver");

const colours = [
  {
    id: "dover-white",
    name: "Dover White",
    hex: "#F0EFEA",
    metallic: 0.12,
    roughness: 0.29,
  },
  {
    id: "pebble-black",
    name: "Pebble Black",
    hex: "#17191A",
    metallic: 0.62,
    roughness: 0.19,
  },
  {
    id: "cosmic-silver",
    name: "Cosmic Silver",
    hex: "#B8BDBE",
    metallic: 0.82,
    roughness: 0.21,
  },
  {
    id: "diamond-red",
    name: "Diamond Red",
    hex: "#A91F2D",
    metallic: 0.57,
    roughness: 0.2,
  },
  {
    id: "andes-grey",
    name: "Andes Grey",
    hex: "#686F6E",
    metallic: 0.7,
    roughness: 0.22,
  },
  {
    id: "piccadilly-blue",
    name: "Piccadilly Blue",
    hex: "#486A86",
    metallic: 0.66,
    roughness: 0.21,
  },
];

const selectedColour = computed(() => {
  return (
    colours.find((colour) => colour.id === selectedColorId.value) || colours[0]
  );
});

const selectedColourIndex = computed(() => {
  return colours.findIndex((colour) => colour.id === selectedColorId.value) + 1;
});

const hexToFactor = (hex) => {
  const clean = hex.replace("#", "");

  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
    1,
  ];
};

const getCarPaintMaterial = () => {
  const viewer = modelViewer.value;

  if (!viewer?.model?.materials) return null;

  return (
    viewer.model.materials.find(
      (material) => (material.name || "").toLowerCase() === "carpaint"
    ) || null
  );
};

const applyVehicleColour = async (colour) => {
  selectedColorId.value = colour.id;

  await nextTick();

  if (!modelLoaded.value) return;

  const material = getCarPaintMaterial();

  if (!material) {
    console.warn('MG GLB material "carpaint" was not found.');
    return;
  }

  try {
    const pbr = material.pbrMetallicRoughness;

    // Keep the same material API that already worked in the
    // previous interactive model. Do not change renderer state
    // beyond the body base colour.
    pbr?.setBaseColorFactor(hexToFactor(colour.hex));
  } catch (error) {
    console.warn("MG paint colour update failed:", error);
  }
};

/* =========================================================
   CINEMATIC VIDEO CARDS
========================================================= */

const videos = [
  {
    id: "design",
    number: "01",
    label: "Design",
    src: `${import.meta.env.BASE_URL}videos/mg-scroll-story.mp4`,
    start: 0.4,
    position: "50% center",
  },
  {
    id: "motion",
    number: "02",
    label: "In Motion",
    src: `${import.meta.env.BASE_URL}videos/mg-scroll-story1.mp4`,
    start: 4.8,
    position: "50% center",
  },
  {
    id: "presence",
    number: "03",
    label: "Presence",
    src: `${import.meta.env.BASE_URL}videos/mg-scroll-story2.mp4`,
    start: 1.8,
    position: "50% center",
  },
];

const prepareVideo = (event, start = 0) => {
  const video = event.currentTarget;
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;

  try {
    if (Number.isFinite(video.duration) && video.duration > start + 0.25) {
      video.currentTime = start;
    }
  } catch {
    // Keep the video at its default position if seeking is unavailable.
  }

  video.play().catch(() => {
    // Muted autoplay normally succeeds; browsers may still delay it.
  });
};

/* =========================================================
   MODEL EVENTS
========================================================= */

const handleModelLoad = async () => {
  modelLoaded.value = true;
  modelError.value = false;

  await nextTick();
  await applyVehicleColour(selectedColour.value);
};

const handleModelError = (event) => {
  modelError.value = true;
  console.error("MG 3D model failed to load:", modelPath, event);
};

const resetView = () => {
  const viewer = modelViewer.value;
  if (!viewer) return;

  viewer.cameraOrbit = "32deg 82deg 61%";
};

const handleKeyDown = (event) => {
  if (event.key === "Escape") resetView();
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <section class="mg-cinematic-3d">
    <div class="mg-cinematic-3d__container">
      <header class="mg-cinematic-3d__header">
        <div class="mg-cinematic-3d__heading">
          <span>INTERACTIVE EXPERIENCE</span>
          <h2>Experience MG in motion.</h2>
        </div>

        <p>
          Three cinematic perspectives frame an interactive MG at the centre.
          Drag the vehicle to explore its form from every angle.
        </p>
      </header>
    </div>

    <div class="mg-stage">
      <div class="mg-stage__ambient"></div>
      <div class="mg-stage__floor"></div>
      <div class="mg-stage__grain"></div>

      <div class="mg-stage__meta">
        <div class="mg-stage__meta-left">
          <span>MGS5 EV</span>
        </div>

        <button type="button" class="mg-stage__reset" @click="resetView">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 12a8 8 0 1 0 2.3-5.6M4 5v4h4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>RESET VIEW</span>
        </button>
      </div>

      <!-- THREE TALL CINEMATIC FILMS -->
      <div class="mg-stage__cards" aria-label="MG cinematic perspectives">
        <article
          v-for="video in videos"
          :key="video.id"
          class="mg-film"
          :class="`mg-film--${video.id}`"
        >
          <video
            class="mg-film__video"
            :src="video.src"
            :style="{ objectPosition: video.position }"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            @loadedmetadata="prepareVideo($event, video.start)"
          ></video>

          <div class="mg-film__shade"></div>

          <div class="mg-film__top">
            <span>{{ video.number }}</span>
            <i></i>
          </div>

          <div class="mg-film__bottom">
            <span>{{ video.label }}</span>
          </div>
        </article>
      </div>

      <div class="mg-stage__halo"></div>

      <!-- REAL 3D MODEL -->
      <div class="mg-stage__vehicle">
        <!--
          MODEL LOGIC IS UNCHANGED:
          direct :src="modelPath", same model-viewer component,
          same eager loading and same load/error events.
        -->
        <model-viewer
          ref="modelViewer"
          class="mg-stage__model"
          :class="{ 'mg-stage__model--loaded': modelLoaded }"
          :src="modelPath"
          alt="Interactive MG vehicle"
          loading="eager"
          reveal="auto"
          camera-controls
          auto-rotate
          auto-rotate-delay="700"
          rotation-per-second="1.05deg"
          disable-zoom
          disable-pan
          interaction-prompt="none"
          camera-orbit="32deg 82deg 61%"
          min-camera-orbit="auto 75deg 56%"
          max-camera-orbit="auto 86deg 64%"
          camera-target="auto auto auto"
          field-of-view="20deg"
          min-field-of-view="20deg"
          max-field-of-view="20deg"
          interpolation-decay="85"
          orbit-sensitivity="0.65"
          shadow-intensity="1.35"
          shadow-softness="0.8"
          exposure="1.08"
          environment-image="neutral"
          touch-action="pan-y"
          @load="handleModelLoad"
          @error="handleModelError"
        ></model-viewer>

        <div class="mg-stage__vehicle-shadow"></div>

        <Transition name="mg-model-loader">
          <div v-if="!modelLoaded && !modelError" class="mg-stage__loader">
            <div class="mg-stage__loader-ring"><span></span></div>
            <strong>Preparing your MG</strong>
            <small>Interactive 3D vehicle</small>
          </div>
        </Transition>

        <div v-if="modelError" class="mg-stage__error">
          <strong>Vehicle preview unavailable</strong>
          <span>Check public/models/mg-car.glb</span>
        </div>
      </div>

      <!-- COMPACT VERTICAL EXTERIOR COLOUR SELECTOR -->
      <aside class="mg-stage__colours" aria-label="Exterior colours">
        <div class="mg-stage__colour-copy">
          <span>EXTERIOR</span>
          <strong>{{ selectedColour.name }}</strong>
        </div>

        <div class="mg-stage__swatches">
          <button
            v-for="colour in colours"
            :key="colour.id"
            type="button"
            class="mg-stage__swatch"
            :class="{
              'mg-stage__swatch--active': selectedColorId === colour.id,
            }"
            :title="colour.name"
            :aria-label="`Choose ${colour.name}`"
            @click="applyVehicleColour(colour)"
          >
            <span :style="{ background: colour.hex }"></span>
          </button>
        </div>

        <div class="mg-stage__colour-count">
          <span>{{ String(selectedColourIndex).padStart(2, "0") }}</span>
          <i></i>
          <span>{{ String(colours.length).padStart(2, "0") }}</span>
        </div>
      </aside>

      <div class="mg-stage__footer">
        <div class="mg-stage__drag">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 12a8 8 0 0 1 13.7-5.6L20 8.7M20 4v4.7h-4.7M20 12a8 8 0 0 1-13.7 5.6L4 15.3M4 20v-4.7h4.7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>DRAG TO EXPLORE</span>
        </div>

        <div class="mg-stage__electric">
          <span>100% ELECTRIC</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap");

.mg-cinematic-3d {
  --red: #e51920;
  --page-width: 91%;
  --page-max: 1420px;
  width: 100%;
  overflow: hidden;
  padding: clamp(74px, 6vw, 104px) 0 0;
  background: #f5f5f2;
  color: #111;
  font-family: "Manrope", sans-serif;
}

.mg-cinematic-3d__container {
  width: min(var(--page-width), var(--page-max));
  margin: 0 auto;
}

.mg-cinematic-3d__header {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(270px, .55fr);
  align-items: end;
  gap: clamp(56px, 7vw, 120px);
  padding-bottom: clamp(38px, 3.5vw, 58px);
}

.mg-cinematic-3d__heading > span {
  display: block;
  margin-bottom: clamp(11px, .9vw, 15px);
  color: var(--red);
  font-size: .43vw;
  font-weight: 700;
  letter-spacing: .16em;
}

.mg-cinematic-3d__heading h2 {
  margin: 0;
  font-size: 2.8vw;
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -.055em;
}

.mg-cinematic-3d__header > p {
  justify-self: end;
  width: min(100%, 370px);
  margin: 0;
  color: rgba(0, 0, 0, .5);
  font-size: .7vw;
  line-height: 1.72;
}

/* =========================================================
   STAGE
========================================================= */

.mg-stage {
  position: relative;
  width: 100%;
  height: clamp(700px, 52vw, 910px);
  overflow: hidden;
  isolation: isolate;
  background: #050505;
  color: #fff;
}

.mg-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -20;
  background:
    radial-gradient(ellipse at 50% 73%, rgba(255, 255, 255, .08), transparent 34%),
    radial-gradient(ellipse at 50% 5%, rgba(255, 255, 255, .035), transparent 48%),
    linear-gradient(180deg, #050505 0%, #090909 62%, #030303 100%);
}

.mg-stage__ambient {
  position: absolute;
  left: 50%;
  top: 12%;
  z-index: -8;
  width: 69vw;
  height: 42vw;
  transform: translateX(-50%);
  border-radius: 50%;
  opacity: .24;
  filter: blur(85px);
  background: radial-gradient(ellipse, rgba(255, 255, 255, .22), transparent 68%);
  pointer-events: none;
}

.mg-stage__floor {
  position: absolute;
  left: 50%;
  bottom: -15%;
  z-index: 4;
  width: 92%;
  height: 46%;
  transform: translateX(-50%);
  border-radius: 50%;
  opacity: .48;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, .08),
    rgba(255, 255, 255, .015) 42%,
    transparent 70%
  );
  pointer-events: none;
}

.mg-stage__grain {
  position: absolute;
  inset: 0;
  z-index: 60;
  opacity: .024;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
}

/* =========================================================
   META
========================================================= */

.mg-stage__meta {
  position: absolute;
  left: 4.5%;
  right: 4.5%;
  top: clamp(23px, 2.2vw, 37px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mg-stage__meta-left {
  display: flex;
  align-items: center;
  gap: 9px;
  color: rgba(255, 255, 255, .6);
  font-size: .4vw;
  font-weight: 700;
  letter-spacing: .15em;
}


.mg-stage__reset {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 999px;
  background: rgba(255, 255, 255, .04);
  color: rgba(255, 255, 255, .67);
  font: 700 clamp(5px, .35vw, 7px)/1 "Manrope", sans-serif;
  letter-spacing: .12em;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background .25s ease, color .25s ease, border-color .25s ease;
}

.mg-stage__reset:hover {
  background: #fff;
  color: #111;
  border-color: #fff;
}

.mg-stage__reset svg {
  width: 12px;
  height: 12px;
}

/* =========================================================
   CINEMATIC VIDEO DECK

   Changes requested:
   - taller cards
   - cards closer together
   - still enough negative space for the larger GLB in front
========================================================= */

.mg-stage__cards {
  position: absolute;
  left: 50%;
  top: 8.5%;
  z-index: 2;
  width: min(84%, 1360px);
  height: 71%;
  transform: translateX(-50%);
}

.mg-film {
  position: absolute;
  top: 0;
  height: 103%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .085);
  border-radius: clamp(9px, .7vw, 13px);
  background: #121212;
  box-shadow: 0 26px 70px rgba(0, 0, 0, .46);
}

/* 4 → 34 / 35 → 65 / 66 → 96 : ~1% gaps */
.mg-film--design {
  left: 4%;
  width: 30%;
  transform: translateY(2.5%);
}

.mg-film--motion {
  left: 35%;
  width: 30%;
  height: 110%;
  transform: translateY(-2%);
}

.mg-film--presence {
  right: 4%;
  width: 30%;
  transform: translateY(2.5%);
}

.mg-film__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  filter: saturate(.78) contrast(1.08) brightness(.82);
  transform: scale(1.025);
  transition: transform 2.4s cubic-bezier(.16, 1, .3, 1), filter .7s ease;
}

.mg-film:hover .mg-film__video {
  transform: scale(1.065);
  filter: saturate(.95) contrast(1.08) brightness(.9);
}

.mg-film__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, .12),
    transparent 38%,
    rgba(0, 0, 0, .16) 58%,
    rgba(0, 0, 0, .72) 100%
  );
  pointer-events: none;
}

.mg-film__top {
  position: absolute;
  left: clamp(11px, .75vw, 15px);
  right: clamp(11px, .75vw, 15px);
  top: clamp(10px, .7vw, 14px);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, .6);
  font-family: "Barlow Condensed", sans-serif;
  font-size: .68vw;
}

.mg-film__top i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .7);
}

.mg-film__bottom {
  position: absolute;
  left: clamp(11px, .75vw, 15px);
  bottom: clamp(12px, .8vw, 16px);
  z-index: 5;
  color: rgba(255, 255, 255, .68);
  font-size: .4vw;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}

/* =========================================================
   MODEL HALO
========================================================= */

.mg-stage__halo {
  position: absolute;
  left: 50%;
  bottom: 1%;
  z-index: 8;
  width: 62%;
  height: 35%;
  transform: translateX(-50%);
  border-radius: 50%;
  filter: blur(50px);
  background: radial-gradient(ellipse, rgba(255, 255, 255, .14), transparent 70%);
  pointer-events: none;
}

/* =========================================================
   BIGGER 3D VEHICLE
========================================================= */

.mg-stage__vehicle {
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: -1.5%;
  z-index: 25;
  height: 72%;
  pointer-events: none;
}

.mg-stage__model {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: auto;
  background: transparent;
  --poster-color: transparent;
  transform: translateY(42px) scale(.92);
  filter: drop-shadow(0 25px 35px rgba(0, 0, 0, .18));
  transition: opacity .8s ease, transform 1.45s cubic-bezier(.16, 1, .3, 1);
}

.mg-stage__model--loaded {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.mg-stage__vehicle-shadow {
  position: absolute;
  left: 50%;
  bottom: 8%;
  z-index: 4;
  width: 49%;
  height: 6%;
  transform: translateX(-50%);
  border-radius: 50%;
  background: rgba(0, 0, 0, .88);
  filter: blur(31px);
  opacity: .8;
}

/* =========================================================
   MODEL LOADER / ERROR
========================================================= */

.mg-stage__loader,
.mg-stage__error {
  position: absolute;
  left: 50%;
  top: 51%;
  z-index: 42;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.mg-stage__loader-ring {
  position: relative;
  width: 42px;
  height: 42px;
  margin: 0 auto 11px;
  border: 1px solid rgba(255, 255, 255, .16);
  border-radius: 50%;
}

.mg-stage__loader-ring span {
  position: absolute;
  inset: -1px;
  border: 1px solid transparent;
  border-top-color: var(--red);
  border-radius: 50%;
  animation: mgStageSpin 1s linear infinite;
}

@keyframes mgStageSpin {
  to {
    transform: rotate(360deg);
  }
}

.mg-stage__loader strong,
.mg-stage__error strong {
  display: block;
  color: rgba(255, 255, 255, .86);
  font-size: .55vw;
  font-weight: 600;
}

.mg-stage__loader small,
.mg-stage__error span {
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, .38);
  font-size: .36vw;
}

.mg-model-loader-leave-active {
  transition: opacity .3s ease;
}

.mg-model-loader-leave-to {
  opacity: 0;
}

/* =========================================================
   EXTERIOR COLOUR SELECTOR
========================================================= */

.mg-stage__colours {
  position: absolute;
  right: 3.3%;
  top: 50%;
  z-index: 52;
  width: clamp(80px, 5.1vw, 94px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 9px 11px;
  box-sizing: border-box;
  transform: translateY(-50%);
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 17px;
  background: rgba(8, 8, 8, .48);
  box-shadow: 0 20px 50px rgba(0, 0, 0, .28), inset 0 1px rgba(255, 255, 255, .06);
  backdrop-filter: blur(20px) saturate(1.1);
  -webkit-backdrop-filter: blur(20px) saturate(1.1);
}

.mg-stage__colour-copy {
  width: 100%;
  text-align: center;
}

.mg-stage__colour-copy > span {
  display: block;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, .35);
  font-size: .28vw;
  font-weight: 700;
  letter-spacing: .15em;
}

.mg-stage__colour-copy strong {
  display: block;
  min-height: 18px;
  overflow: hidden;
  color: rgba(255, 255, 255, .88);
  font-size: .4vw;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mg-stage__swatches {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
}

.mg-stage__swatches::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  z-index: -1;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    transparent,
    rgba(255, 255, 255, .09) 18%,
    rgba(255, 255, 255, .09) 82%,
    transparent
  );
}

.mg-stage__swatch {
  position: relative;
  width: clamp(25px, 1.55vw, 29px);
  height: clamp(25px, 1.55vw, 29px);
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 50%;
  background: rgba(255, 255, 255, .08);
  cursor: pointer;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.mg-stage__swatch > span {
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, .34), 0 3px 8px rgba(0, 0, 0, .25);
}

.mg-stage__swatch:hover {
  transform: scale(1.09);
}

.mg-stage__swatch--active {
  border-color: rgba(255, 255, 255, .68);
  transform: scale(1.09);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .06);
}

.mg-stage__swatch--active::after {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  width: 4px;
  height: 4px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 8px rgba(229, 25, 32, .7);
}

.mg-stage__colour-count {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, .34);
  font-family: "Barlow Condensed", sans-serif;
  font-size: .52vw;
  letter-spacing: .06em;
}

.mg-stage__colour-count i {
  width: 13px;
  height: 1px;
  background: rgba(255, 255, 255, .16);
}

/* =========================================================
   BOTTOM META
========================================================= */

.mg-stage__footer {
  position: absolute;
  left: 4.5%;
  right: 4.5%;
  bottom: clamp(21px, 1.9vw, 32px);
  z-index: 48;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.mg-stage__drag,
.mg-stage__electric {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, .44);
  font-size: .38vw;
  font-weight: 700;
  letter-spacing: .14em;
}

.mg-stage__drag svg {
  width: 15px;
  height: 15px;
}

/* =========================================================
   LARGE DESKTOP / VW
========================================================= */



/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1050px) {
  .mg-cinematic-3d__header {
    grid-template-columns: 1fr .65fr;
    gap: 40px;
  }

  .mg-stage {
    height: 760px;
  }

  .mg-stage__cards {
    width: 92%;
    top: 10%;
    height: 68%;
  }

  .mg-film--design {
    left: 2%;
    width: 31%;
  }

  .mg-film--motion {
    left: 34.5%;
    width: 31%;
  }

  .mg-film--presence {
    right: 2%;
    width: 31%;
  }

  .mg-stage__vehicle {
    left: -2%;
    right: -2%;
    bottom: -1%;
    height: 68%;
  }

  .mg-stage__colours {
    right: 18px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .mg-cinematic-3d {
    padding-top: 58px;
  }

  .mg-cinematic-3d__container {
    width: calc(100% - 30px);
  }

  .mg-cinematic-3d__header {
    display: block;
    padding-bottom: 30px;
  }

  .mg-cinematic-3d__heading > span {
    margin-bottom: 10px;
    font-size: 7px;
  }

  .mg-cinematic-3d__heading h2 {
    font-size: 30px;
  }

  .mg-cinematic-3d__header > p {
    width: 100%;
    max-width: 340px;
    margin-top: 16px;
    font-size: 9px;
  }

  .mg-stage {
    height: 700px;
  }

  .mg-stage__meta {
    left: 15px;
    right: 15px;
    top: 17px;
  }

  .mg-stage__reset span {
    display: none;
  }

  .mg-stage__reset {
    width: 31px;
    min-height: 31px;
    justify-content: center;
    padding: 0;
  }

  .mg-stage__cards {
    top: 10%;
    width: calc(100% - 18px);
    height: 67%;
  }

  .mg-film {
    border-radius: 7px;
    height: 103%;
  }

  .mg-film--design {
    left: 0;
    width: 32.4%;
    transform: translateY(2.5%);
  }

  .mg-film--motion {
    left: 33.8%;
    width: 32.4%;
    height: 109%;
  }

  .mg-film--presence {
    right: 0;
    width: 32.4%;
    transform: translateY(2.5%);
  }

  .mg-film__top {
    left: 8px;
    right: 8px;
    top: 8px;
  }

  .mg-film__bottom {
    left: 8px;
    bottom: 8px;
    font-size: 5px;
  }

  .mg-stage__vehicle {
    left: -31%;
    right: -31%;
    bottom: -1%;
    height: 61%;
  }

  .mg-stage__model {
    transform: translateY(35px) scale(.91);
  }

  .mg-stage__model--loaded {
    transform: translateY(0) scale(1);
  }

  .mg-stage__colours {
    right: 9px;
    top: 48%;
    width: 58px;
    gap: 7px;
    padding: 9px 5px 8px;
    border-radius: 14px;
  }

  .mg-stage__colour-copy > span {
    font-size: 4px;
  }

  .mg-stage__colour-copy strong {
    font-size: 5px;
    min-height: 14px;
  }

  .mg-stage__swatches {
    gap: 4px;
  }

  .mg-stage__swatch {
    width: 21px;
    height: 21px;
  }

  .mg-stage__swatch--active::after {
    left: -7px;
  }

  .mg-stage__colour-count {
    font-size: 7px;
  }

  .mg-stage__footer {
    left: 15px;
    right: 15px;
    bottom: 16px;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 420px) {
  .mg-cinematic-3d__heading h2 {
    font-size: 28px;
  }

  .mg-stage {
    height: 655px;
  }

  .mg-stage__vehicle {
    left: -38%;
    right: -38%;
    height: 59%;
  }

  .mg-film__bottom {
    display: none;
  }

  .mg-stage__colours {
    top: 47%;
    width: 55px;
  }

  .mg-stage__swatch {
    width: 20px;
    height: 20px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mg-cinematic-3d *,
  .mg-cinematic-3d *::before,
  .mg-cinematic-3d *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
