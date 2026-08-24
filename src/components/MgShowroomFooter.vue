<script setup>
const showroom = {
  name: "MG Sri Lanka",
  location: "Kelaniya, Sri Lanka",
  address: "873 Kandy Rd, Wedamulla, Kelaniya 11600, Sri Lanka",
  phone: "+94 11 234 5678",
  email: "info@mgsrilanka.lk",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=6.968695,79.901955",
  mapEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=79.855%2C6.935%2C79.945%2C7.005&layer=mapnik&marker=6.968695%2C79.901955",
};
</script>

<template>
  <section class="mg-showroom-footer">
    <!-- MAP AREA -->
    <div class="mg-showroom-footer__map-wrap">
      <iframe
        class="mg-showroom-footer__map"
        :src="showroom.mapEmbed"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="MG Sri Lanka showroom location map"
      ></iframe>

      <div class="mg-showroom-footer__map-fade"></div>
    </div>

    <!-- OVERLAP CARD -->
    <div class="mg-showroom-footer__shell">
      <div class="mg-showroom-footer__card">
        <!-- LEFT -->
        <div class="mg-showroom-footer__brand">
          <div class="mg-showroom-footer__logo-row">
            <div class="mg-showroom-footer__mg-badge">MG</div>
            <div class="mg-showroom-footer__brand-name">
              <strong>MG Sri Lanka</strong>
            </div>
          </div>

          <p class="mg-showroom-footer__desc">
            We’re here to help you discover the right MG. Visit our showroom,
            speak with our team and experience the range in person.
          </p>

          <div class="mg-showroom-footer__shop">
            <h4>Our Showroom</h4>

            <a
              :href="showroom.directions"
              target="_blank"
              rel="noopener noreferrer"
              class="mg-showroom-footer__address"
            >
              <span class="mg-showroom-footer__pin">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 21s7-5.3 7-12A7 7 0 1 0 5 9c0 6.7 7 12 7 12Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                </svg>
              </span>

              <span>{{ showroom.address }}</span>
            </a>

            <a
              :href="showroom.directions"
              target="_blank"
              rel="noopener noreferrer"
              class="mg-showroom-footer__directions"
            >
              <span>Get Directions</span>
              <span class="mg-showroom-footer__directions-icon">↗</span>
            </a>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="mg-showroom-footer__info">
          <div class="mg-showroom-footer__info-grid">
            <div class="mg-showroom-footer__block">
              <h4>Our Hours</h4>

              <ul class="mg-showroom-footer__list">
                <li>
                  <span>Monday – Saturday</span>
                  <span>10:00 AM – 06:00 PM</span>
                </li>
                <li>
                  <span>Sunday</span>
                  <span>By Appointment Only</span>
                </li>
              </ul>
            </div>

            <div class="mg-showroom-footer__block">
              <h4>Our Contacts</h4>

              <ul class="mg-showroom-footer__contact-list">
                <li>
                  <a :href="`tel:${showroom.phone}`">
                    <span class="mg-showroom-footer__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1 .3 2 .4 3 .4.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C10.8 21.2 2.8 13.2 2.8 3.6c0-.7.5-1.2 1.2-1.2h3.5c.7 0 1.2.5 1.2 1.2 0 1 .1 2 .4 3 .1.4 0 .8-.3 1.2l-2.2 2.2Z"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{{ showroom.phone }}</span>
                  </a>
                </li>

                <li>
                  <a :href="`mailto:${showroom.email}`">
                    <span class="mg-showroom-footer__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M4 6h16v12H4z"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.7"
                        />
                        <path
                          d="m5 7 7 6 7-6"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.7"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{{ showroom.email }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="mg-showroom-footer__socials">
            <a href="#" aria-label="Twitter / X">X</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap");

.mg-showroom-footer {
  --red: #e51920;
  --black: #111111;
  --black-soft: #181818;
  --line: rgba(255, 255, 255, 0.1);
  --text-soft: rgba(255, 255, 255, 0.7);
  --text-dim: rgba(255, 255, 255, 0.5);

  position: relative;
  width: 100%;
  background: #ececea;
  font-family: "Manrope", sans-serif;
}

/* map */
.mg-showroom-footer__map-wrap {
  position: relative;
  width: 100%;
  height: clamp(390px, 36vw, 620px);
  overflow: hidden;
}

.mg-showroom-footer__map {
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(0.08) contrast(1.02) brightness(1.02);
}

.mg-showroom-footer__map-fade {
  position: absolute;
  inset: auto 0 0 0;
  height: clamp(90px, 10vw, 140px);
  background: linear-gradient(
    180deg,
    rgba(236, 236, 234, 0) 0%,
    rgba(236, 236, 234, 0.58) 45%,
    rgba(236, 236, 234, 1) 100%
  );
  pointer-events: none;
}

/* card shell */
.mg-showroom-footer__shell {
  position: relative;
  width: min(94%, 1500px);
  margin: 0 auto;
}

.mg-showroom-footer__card {
  margin-top: clamp(-78px, -6vw, -95px);
  position: relative;
  z-index: 3;

  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: clamp(28px, 4vw, 60px);

  padding: clamp(32px, 3vw, 48px);
  border-radius: 32px;
  background: linear-gradient(135deg, #171717 0%, #111111 100%);
  color: #fff;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.18);
}

/* left */
.mg-showroom-footer__brand {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.mg-showroom-footer__logo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.mg-showroom-footer__mg-badge {
  width: clamp(44px, 3vw, 52px);
  height: clamp(44px, 3vw, 52px);
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 1.1vw;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.mg-showroom-footer__brand-name strong {
  font-size: 1.6vw;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.mg-showroom-footer__desc {
  max-width: 460px;
  margin: 0 0 clamp(42px, 4vw, 70px);
  color: var(--text-soft);
  font-size: 0.9vw;
  line-height: 1.7;
}

.mg-showroom-footer__shop {
  margin-top: auto;
}

.mg-showroom-footer__shop h4,
.mg-showroom-footer__block h4 {
  margin: 0 0 16px;
  font-size: 1.35vw;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.mg-showroom-footer__address {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  color: #fff;
  text-decoration: none;
  max-width: 520px;
  margin-bottom: 22px;
  font-size: 0.9vw;
  line-height: 1.7;
}

.mg-showroom-footer__pin {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  color: var(--red);
  margin-top: 2px;
}

.mg-showroom-footer__pin svg {
  width: 100%;
  height: 100%;
  display: block;
}

.mg-showroom-footer__directions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  font-size: 0.82vw;
  font-weight: 600;
}

.mg-showroom-footer__directions-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.mg-showroom-footer__directions:hover .mg-showroom-footer__directions-icon {
  background: var(--red);
  transform: translate(2px, -2px);
}

/* right */
.mg-showroom-footer__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 34px;
}

.mg-showroom-footer__info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 3vw, 40px);
}

.mg-showroom-footer__list,
.mg-showroom-footer__contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mg-showroom-footer__list li {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 0 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.mg-showroom-footer__list li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.mg-showroom-footer__list li span:first-child {
  color: #fff;
  font-size: 0.95vw;
  font-weight: 500;
}

.mg-showroom-footer__list li span:last-child {
  color: var(--text-dim);
  font-size: 0.85vw;
}

.mg-showroom-footer__contact-list li + li {
  margin-top: 16px;
}

.mg-showroom-footer__contact-list a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-soft);
  text-decoration: none;
  font-size: 0.88vw;
  transition: color 0.25s ease;
}

.mg-showroom-footer__contact-list a:hover {
  color: #fff;
}

.mg-showroom-footer__icon {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  color: #fff;
}

.mg-showroom-footer__icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.mg-showroom-footer__socials {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
}

.mg-showroom-footer__socials a {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--red);
  text-decoration: none;
  font-size: 1vw;
  font-weight: 700;
  transition: all 0.3s ease;
}

.mg-showroom-footer__socials a:hover {
  background: var(--red);
  color: #fff;
  transform: translateY(-3px);
}

/* large screens */


/* tablet */
@media (max-width: 1024px) {
  .mg-showroom-footer__card {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .mg-showroom-footer__info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .mg-showroom-footer__socials {
    justify-content: flex-start;
  }
}

/* mobile */
@media (max-width: 767px) {
  .mg-showroom-footer__map-wrap {
    height: 320px;
  }

  .mg-showroom-footer__shell {
    width: calc(100% - 24px);
  }

  .mg-showroom-footer__card {
    margin-top: -40px;
    padding: 24px 20px;
    border-radius: 24px;
    gap: 28px;
  }

  .mg-showroom-footer__logo-row {
    margin-bottom: 14px;
  }

  .mg-showroom-footer__desc {
    margin-bottom: 30px;
    font-size: 14px;
  }

  .mg-showroom-footer__shop h4,
  .mg-showroom-footer__block h4 {
    font-size: 20px;
  }

  .mg-showroom-footer__info-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .mg-showroom-footer__socials {
    justify-content: flex-start;
    gap: 10px;
  }

  .mg-showroom-footer__socials a {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
}
</style>