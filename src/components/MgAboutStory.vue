<script setup>
import { ref } from "vue";

const activeSpec = ref(null);

const drivingCards = [
  {
    id: 1,
    title: "Commanding performance across dramatic mountain roads",
    background:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/E12A0847.jpg?v=1",
    backgroundPosition: "center center",
    alt: "MG driving on a dramatic mountain road",
  },
  {
    id: 2,
    title: "Premium performance shaped for open-road journeys",
    background:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/E12A0511.jpg?v=2",
    backgroundPosition: "center center",
    alt: "MG driving on a scenic open road",
  },
];

const specs = [
  {
    id: "range",
    value: "4630",
    unit: "mm",
    description:
      "The zero-emissions crossover is 4630 millimeters long.",
    detail:
      "Balanced proportions give the MG a confident SUV presence while keeping the vehicle practical for everyday electric mobility.",
  },
  {
    id: "motor",
    value: "2500",
    unit: "rpm",
    description:
      "At just 2,500rpm, performance should be unlike most SUVs.",
    detail:
      "Electric power is delivered immediately and smoothly, creating responsive performance without compromising refinement.",
    background:
      "https://news.mgmotor.eu/wp-content/uploads/2025/05/E12A1024.jpg?v=3",
    backgroundPosition: "center center",
  },
  {
    id: "wheelbase",
    value: "2830",
    unit: "mm",
    description:
      "A compact crossover with a wheelbase stretching to 2830 mm.",
    detail:
      "The long wheelbase helps create more usable cabin space while supporting a stable, planted driving character.",
  },
];

const toggleSpec = (id) => {
  activeSpec.value = activeSpec.value === id ? null : id;
};
</script>

<template>
  <section class="mg-dynamics">
    <div class="mg-dynamics__container">
      <header class="mg-dynamics__intro">
        <div class="mg-dynamics__headline">
          <h2>
            Enhanced Driving Dynamics
            <br />
            and Revealed Legacy of the
            <br />
            MG Electric Drive
          </h2>
        </div>

        <div class="mg-dynamics__intro-copy">
          <p>
            Driving dynamics are shaped by a low-mounted battery,
            balanced weight distribution and an advanced electric
            platform. The result is an MG that feels composed,
            responsive and ready for every journey.
          </p>
        </div>
      </header>

      <div class="mg-dynamics__features">
        <article
          v-for="card in drivingCards"
          :key="card.id"
          class="mg-eco-card"
        >
          <div class="mg-eco-card__top">
            <span class="mg-eco-card__top-line"></span>

            <button
              type="button"
              class="mg-eco-card__arrow"
              aria-label="Explore feature"
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
            </button>
          </div>

          <div class="mg-eco-card__scene">
            <img
              :key="card.background"
              class="mg-eco-card__background"
              :src="card.background"
              :style="{ objectPosition: card.backgroundPosition }"
              :alt="card.alt"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
            />

            <div class="mg-eco-card__shade"></div>
            <div class="mg-eco-card__cinematic-glow"></div>

            <div class="mg-eco-card__caption">
              <span>MGS5 EV</span>
              <strong>{{ card.title }}</strong>
            </div>
          </div>
        </article>
      </div>

      <div class="mg-specs__intro">
        <div>
          <h3>
            Exploring Specifications,
            <br />
            Performance Product
          </h3>
        </div>

        <div>
          <p>
            Let’s talk specs. Efficient electric engineering is
            combined with practical proportions, generous interior
            space and performance developed for everyday driving.
          </p>
        </div>
      </div>

      <div class="mg-specs">
        <article
          v-for="spec in specs"
          :key="spec.id"
          class="mg-spec"
          :class="{
            'mg-spec--open': activeSpec === spec.id,
            'mg-spec--visual': spec.background,
          }"
        >
          <div class="mg-spec__row">
            <button
              type="button"
              class="mg-spec__plus"
              :aria-label="`More information about ${spec.value}${spec.unit}`"
              @click="toggleSpec(spec.id)"
            >
              <span></span>
              <span></span>
            </button>

            <div class="mg-spec__value">
              <strong>{{ spec.value }}</strong>
              <span>{{ spec.unit }}</span>
            </div>

            <div class="mg-spec__description">
              <p>{{ spec.description }}</p>

              <button
                type="button"
                class="mg-spec__arrow"
                aria-label="View specification"
                @click="toggleSpec(spec.id)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 12h14M14 7l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.45"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="spec.background" class="mg-spec__eco-row">
            <div class="mg-spec__micro">
              <p>{{ spec.detail }}</p>
            </div>

            <div class="mg-spec__visual-card">
              <img
                :key="spec.background"
                class="mg-spec__visual-background"
                :src="spec.background"
                :style="{ objectPosition: spec.backgroundPosition }"
                alt="MG dynamic driving scene"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
              />

              <div class="mg-spec__visual-shade"></div>
            </div>
          </div>

          <Transition name="spec-expand">
            <div
              v-if="activeSpec === spec.id && !spec.background"
              class="mg-spec__expanded"
            >
              <p>{{ spec.detail }}</p>
            </div>
          </Transition>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap");

.mg-dynamics {
  --black: #171717;
  --muted: #666864;
  --line: #d9dad6;
  --page: #f7f7f4;
  --red: #e51920;

  /* =======================================================
     UNIFIED MG TYPOGRAPHY
     Same Manrope style / weight system used across sections.
  ======================================================= */
  --mg-font: "Manrope", Arial, sans-serif;

  --mg-heading-size: clamp(56px, 3.8vw, 76px);
  --mg-subheading-size: clamp(38px, 2.6vw, 52px);
  --mg-body-size: clamp(17px, 1.08vw, 22px);
  --mg-card-title-size: clamp(16px, 1vw, 20px);
  --mg-label-size: clamp(12px, 0.72vw, 15px);
  --mg-detail-size: clamp(12px, 0.74vw, 15px);
  --mg-spec-value-size: clamp(42px, 2.7vw, 58px);
  --mg-spec-unit-size: clamp(13px, 0.8vw, 16px);

  --mg-heading-weight: 600;
  --mg-body-weight: 500;
  --mg-label-weight: 600;

  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(42px, 3.2vw, 62px) 0 clamp(48px, 3.6vw, 70px);
  background: var(--page);
  color: var(--black);
  font-family: var(--mg-font);
}

.mg-dynamics::before {
  content: "";
  position: absolute;
  right: -12vw;
  top: 24%;
  width: 37vw;
  height: 37vw;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.16;
  filter: blur(100px);
  background: rgba(128, 151, 121, 0.18);
}

.mg-dynamics__container {
  position: relative;
  z-index: 2;
  width: min(91%, 1420px);
  margin: 0 auto;
}

.mg-dynamics__intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(32px, 4vw, 65px);
  margin-bottom: clamp(24px, 2vw, 36px);
}

.mg-dynamics__headline h2 {
  max-width: 650px;
  margin: 0;
  font-family: var(--mg-font);
  font-size: var(--mg-heading-size);
  font-weight: var(--mg-heading-weight);
  line-height: 1.08;
  letter-spacing: -0.05em;
}

.mg-dynamics__intro-copy {
  display: flex;
  justify-content: flex-start;
}

.mg-dynamics__intro-copy p {
  max-width: 600px;
  margin: 5px 0 0;
  color: var(--muted);
  font-family: var(--mg-font);
  font-size: var(--mg-body-size);
  font-weight: var(--mg-body-weight);
  line-height: 1.65;
}

.mg-dynamics__features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.25vw, 20px);
  margin-bottom: clamp(80px, 6vw, 120px);
}

.mg-eco-card {
  min-width: 0;
}

.mg-eco-card__top {
  display: flex;
  align-items: center;
  gap: 1vw;
  min-height: 34px;
  margin-bottom: 9px;
}

.mg-eco-card__top-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(23, 23, 23, 0.12),
    rgba(23, 23, 23, 0.025)
  );
}

.mg-eco-card__arrow {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #151515;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mg-eco-card__arrow:hover {
  transform: translateX(4px);
}

.mg-eco-card__arrow svg {
  width: 17px;
}

.mg-eco-card__scene {
  position: relative;
  width: 100%;
  aspect-ratio: 1.5 / 1;
  overflow: hidden;
  border-radius: 7px;
  background: #252525;
  isolation: isolate;
  box-shadow: 0 20px 55px rgba(20, 24, 21, 0.1);
}

.mg-eco-card__background {
  position: absolute;
  inset: 0;
  z-index: -4;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  filter: saturate(0.9) contrast(1.01) brightness(0.91);
  transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.7s ease;
}

.mg-eco-card:hover .mg-eco-card__background {
  transform: scale(1.045);
  filter: saturate(1) contrast(1.025) brightness(0.94);
}

.mg-eco-card__shade {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.02) 0%,
      transparent 48%,
      rgba(5, 7, 6, 0.48) 100%
    ),
    linear-gradient(90deg, rgba(5, 5, 5, 0.14) 0%, transparent 42%);
}

.mg-eco-card__cinematic-glow {
  position: absolute;
  left: 35%;
  top: -30%;
  z-index: -1;
  width: 70%;
  height: 65%;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.16;
  filter: blur(45px);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.72),
    transparent 67%
  );
}

.mg-eco-card__caption {
  position: absolute;
  left: 17px;
  bottom: 16px;
  z-index: 20;
  color: #fff;
}

.mg-eco-card__caption span {
  display: block;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.62);
  font-family: var(--mg-font);
  font-size: var(--mg-label-size);
  font-weight: var(--mg-label-weight);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.mg-eco-card__caption strong {
  display: block;
  max-width: 22vw;
  font-family: var(--mg-font);
  font-size: var(--mg-card-title-size);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.mg-specs__intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 4vw, 65px);
  align-items: start;
  margin-bottom: clamp(22px, 1.8vw, 30px);
}

.mg-specs__intro h3 {
  margin: 0;
  font-family: var(--mg-font);
  font-size: clamp(46px, 3vw, 62px);
  font-weight: var(--mg-heading-weight);
  line-height: 1.07;
  letter-spacing: -0.048em;
}

.mg-specs__intro p {
  max-width: 560px;
  margin: 4px 0 0;
  color: var(--muted);
  font-family: var(--mg-font);
  font-size: clamp(15px, 0.96vw, 19px);
  font-weight: var(--mg-body-weight);
  line-height: 1.62;
}

.mg-specs {
  margin-top: clamp(28px, 2.2vw, 40px);
  border-top: 1px solid var(--line);
}

.mg-spec {
  border-bottom: 1px solid var(--line);
}

.mg-spec__row {
  display: grid;
  grid-template-columns: 48px minmax(215px, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(12px, 1.4vw, 23px);
  align-items: center;
  min-height: 92px;
}

.mg-spec__plus {
  position: relative;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid #888b85;
  border-radius: 50%;
  background: transparent;
  color: #252525;
  cursor: pointer;
  transition: color 0.25s ease, background 0.25s ease;
}

.mg-spec__plus span {
  position: absolute;
  width: 11px;
  height: 1px;
  background: currentColor;
  transition: transform 0.3s ease;
}

.mg-spec__plus span:last-child {
  transform: rotate(90deg);
}

.mg-spec--open .mg-spec__plus span:last-child {
  transform: rotate(0deg);
}

.mg-spec__plus:hover {
  color: #fff;
  background: #20221f;
}

.mg-spec__value {
  display: flex;
  align-items: baseline;
}

.mg-spec__value strong {
  font-family: var(--mg-font);
  font-size: clamp(46px, 3vw, 62px);
  font-weight: var(--mg-heading-weight);
  line-height: 1;
  letter-spacing: -0.06em;
}

.mg-spec__value span {
  margin-left: 2px;
  color: #575a56;
  font-family: var(--mg-font);
  font-size: clamp(14px, 0.86vw, 17px);
  font-weight: var(--mg-body-weight);
}

.mg-spec__description {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 30px;
  gap: 15px;
  align-items: center;
}

.mg-spec__description p {
  max-width: 480px;
  margin: 0;
  font-family: var(--mg-font);
  font-size: clamp(15px, 0.96vw, 19px);
  font-weight: var(--mg-body-weight);
  line-height: 1.43;
  letter-spacing: -0.016em;
}

.mg-spec__arrow {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mg-spec__arrow:hover {
  transform: translateX(4px);
}

.mg-spec__arrow svg {
  width: 17px;
}

.mg-spec__eco-row {
  display: grid;
  grid-template-columns: 48px minmax(215px, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(12px, 1.4vw, 23px);
  padding: 0 0 29px;
}

.mg-spec__micro {
  grid-column: 2;
  align-self: end;
  padding-right: 35px;
}

.mg-spec__micro p {
  max-width: 235px;
  margin: 0;
  color: #6c706a;
  font-family: var(--mg-font);
  font-size: clamp(13px, 0.82vw, 16px);
  font-weight: var(--mg-body-weight);
  line-height: 1.6;
}

.mg-spec__visual-card {
  position: relative;
  grid-column: 3;
  justify-self: start;
  width: min(100%, 480px);
  aspect-ratio: 2.05 / 1;
  overflow: hidden;
  border-radius: 5px;
  background: #252525;
  isolation: isolate;
  box-shadow: 0 1vw 2.4vw rgba(0, 0, 0, 0.07);
}

.mg-spec__visual-background {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.02) brightness(0.88);
  transform: scale(1.015);
  transition: transform 1.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.mg-spec__visual-card:hover .mg-spec__visual-background {
  transform: scale(1.055);
}

.mg-spec__visual-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.08)
  );
}

.mg-spec__expanded {
  display: grid;
  grid-template-columns: 48px minmax(215px, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(12px, 1.4vw, 23px);
  padding: 0 0 27px;
}

.mg-spec__expanded p {
  grid-column: 3;
  max-width: 620px;
  margin: 0;
  color: #6c706a;
  font-family: var(--mg-font);
  font-size: clamp(13px, 0.82vw, 16px);
  font-weight: 500;
  line-height: 1.65;
}

.spec-expand-enter-active,
.spec-expand-leave-active {
  transition: opacity 0.3s ease, transform 0.35s ease;
}

.spec-expand-enter-from,
.spec-expand-leave-to {
  opacity: 0;
  transform: translateY(-7px);
}




/* =========================================================
   TYPE CONSISTENCY
   Keep only the shared font family here. Individual elements
   retain their own size, color, spacing and hierarchy.
========================================================= */

.mg-dynamics__headline h2,
.mg-dynamics__intro-copy p,
.mg-eco-card__caption span,
.mg-eco-card__caption strong,
.mg-specs__intro h3,
.mg-specs__intro p,
.mg-spec__value strong,
.mg-spec__value span,
.mg-spec__description p,
.mg-spec__micro p,
.mg-spec__expanded p {
  font-family: var(--mg-font);
}

.mg-dynamics__headline h2,
.mg-specs__intro h3,
.mg-spec__value strong {
  font-weight: var(--mg-heading-weight);
}

.mg-dynamics__intro-copy p,
.mg-specs__intro p,
.mg-spec__description p,
.mg-spec__micro p,
.mg-spec__expanded p,
.mg-spec__value span {
  font-weight: var(--mg-body-weight);
}

.mg-eco-card__caption span {
  font-weight: var(--mg-label-weight);
}

.mg-eco-card__caption strong {
  font-weight: 600;
}


/* =========================================================
   LARGE DESKTOP TYPOGRAPHY
   Matches the typography scale used across the other MG sections.
========================================================= */

@media (min-width: 1600px) {
  .mg-dynamics {
    --mg-heading-size: clamp(64px, 4vw, 86px);
    --mg-body-size: clamp(18px, 1.12vw, 24px);
    --mg-card-title-size: clamp(18px, 1.08vw, 22px);
    --mg-label-size: clamp(13px, 0.76vw, 16px);
  }

  .mg-specs__intro h3,
  .mg-spec__value strong {
    font-size: clamp(52px, 3.1vw, 68px);
  }

  .mg-specs__intro p,
  .mg-spec__description p {
    font-size: clamp(16px, 1vw, 20px);
  }

  .mg-spec__expanded p {
    max-width: 680px;
    font-size: clamp(13px, 0.82vw, 16px);
  }

  .mg-spec__value span {
    font-size: clamp(15px, 0.9vw, 18px);
  }

  .mg-spec__micro p {
    font-size: clamp(14px, 0.86vw, 17px);
  }

  .mg-eco-card__caption strong {
    max-width: 30vw;
  }
}

@media (max-width: 1000px) {
  .mg-dynamics__headline h2 {
    font-size: 34px;
  }

  .mg-specs__intro h3 {
    font-size: 31px;
  }

  .mg-spec__row,
  .mg-spec__eco-row,
  .mg-spec__expanded {
    grid-template-columns: 44px minmax(175px, 0.8fr) 1.2fr;
  }

  .mg-spec__visual-card {
    width: 100%;
  }

  .mg-eco-card__caption strong {
    max-width: 32vw;
    font-size: clamp(14px, 1.4vw, 18px);
  }
}

@media (max-width: 767px) {

  .mg-dynamics__headline h2,
  .mg-specs__intro h3,
  .mg-spec__value strong {
    font-family: var(--mg-font);
    font-weight: 600;
  }

  .mg-dynamics__intro-copy p,
  .mg-specs__intro p,
  .mg-spec__description p,
  .mg-spec__micro p,
  .mg-spec__expanded p,
  .mg-spec__value span {
    font-family: var(--mg-font);
    font-weight: 500;
  }

  .mg-eco-card__caption span,
  .mg-eco-card__caption strong {
    font-family: var(--mg-font);
  }

  .mg-dynamics {
    padding: 42px 0 50px;
  }

  .mg-dynamics__container {
    width: calc(100% - 30px);
  }

  .mg-dynamics__intro {
    grid-template-columns: 1fr;
    gap: 18px;
    margin-bottom: 26px;
  }

  .mg-dynamics__headline h2 {
    font-size: 29px;
  }

  .mg-dynamics__headline h2 br {
    display: none;
  }

  .mg-dynamics__intro-copy p {
    max-width: 460px;
    font-size: 9px;
  }

  .mg-dynamics__features {
    grid-template-columns: 1fr;
    gap: 27px;
    margin-bottom: 38px;
  }

  .mg-eco-card__top {
    min-height: 28px;
    margin-bottom: 7px;
  }

  .mg-eco-card__scene {
    aspect-ratio: 1.38 / 1;
  }

  .mg-eco-card__caption {
    left: 14px;
    bottom: 13px;
  }

  .mg-eco-card__caption span {
    font-size: 6px;
  }

  .mg-eco-card__caption strong {
    max-width: 66vw;
    font-size: 13px;
  }

  .mg-specs__intro {
    grid-template-columns: 1fr;
    gap: 17px;
    margin-bottom: 22px;
  }

  .mg-specs__intro h3 {
    font-size: 28px;
  }

  .mg-specs__intro h3 br {
    display: none;
  }

  .mg-specs__intro p {
    font-size: 9px;
  }

  .mg-spec__row {
    grid-template-columns: 38px 0.9fr 1.15fr;
    gap: 10px;
    min-height: 91px;
  }

  .mg-spec__plus {
    width: 31px;
    height: 31px;
  }

  .mg-spec__value strong {
    font-size: 31px;
  }

  .mg-spec__value span {
    font-size: 11px;
  }

  .mg-spec__description {
    grid-template-columns: 1fr 22px;
    gap: 5px;
  }

  .mg-spec__description p {
    font-size: 8px;
  }

  .mg-spec__arrow {
    width: 22px;
    height: 22px;
  }

  .mg-spec__arrow svg {
    width: 13px;
  }

  .mg-spec__eco-row {
    grid-template-columns: 38px 0.9fr 1.15fr;
    gap: 10px;
    padding-bottom: 22px;
  }

  .mg-spec__micro {
    padding-right: 4px;
  }

  .mg-spec__micro p {
    font-size: 6px;
  }

  .mg-spec__expanded {
    grid-template-columns: 38px 0.9fr 1.15fr;
    gap: 10px;
  }

  .mg-spec__expanded p {
    font-size: 9px;
    line-height: 1.55;
  }
}

@media (max-width: 470px) {
  .mg-spec__row {
    grid-template-columns: 33px 0.78fr 1.22fr;
    min-height: 85px;
  }

  .mg-spec__plus {
    width: 27px;
    height: 27px;
  }

  .mg-spec__plus span {
    width: 9px;
  }

  .mg-spec__value strong {
    font-size: 27px;
  }

  .mg-spec__value span {
    font-size: 9px;
  }

  .mg-spec__description p {
    font-size: 7px;
  }

  .mg-spec__eco-row {
    grid-template-columns: 33px 0.78fr 1.22fr;
  }

  .mg-spec__micro p {
    font-size: 5.4px;
  }
}
</style>