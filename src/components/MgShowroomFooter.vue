<script setup>
const showroom = {
  phone: "+94 11 234 5678",
  email: "info@mgsrilanka.lk",
  address: "873 Kandy Rd, Wedamulla, Kelaniya 11600, Sri Lanka",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=6.968695,79.901955",
};

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "About MG", href: "#about" },
      { label: "Our Story", href: "#story" },
      { label: "News", href: "#news" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Models",
    links: [
      { label: "MG ZS", href: "#models" },
      { label: "MG HS", href: "#models" },
      { label: "MG4 EV", href: "#models" },
      { label: "MG5", href: "#models" },
      { label: "MG RX5", href: "#models" },
    ],
  },
  {
    title: "Shopping tools",
    links: [
      { label: "Find a dealer", href: "#dealers" },
      { label: "Book a test drive", href: "#test-drive" },
      { label: "Finance & Offers", href: "#finance" },
      { label: "Request a quote", href: "#quote" },
      { label: "Download brochure", href: "#brochure" },
    ],
  },
  {
    title: "Owners",
    links: [
      { label: "Warranty", href: "#warranty" },
      { label: "Service & Maintenance", href: "#service" },
      { label: "Service Plans", href: "#service-plan" },
      { label: "Roadside Assistance", href: "#roadside" },
      { label: "Owner Support", href: "#support" },
    ],
  },
  {
    title: "Innovation",
    links: [
      { label: "MG Electric", href: "#electric" },
      { label: "EV Technology", href: "#technology" },
      { label: "Safety Technology", href: "#technology" },
      { label: "Connected Cars", href: "#connected" },
    ],
  },
];

const socials = [
  { name: "Facebook", href: "#", type: "facebook" },
  { name: "Instagram", href: "#", type: "instagram" },
  { name: "LinkedIn", href: "#", type: "linkedin" },
];
</script>

<template>
  <footer class="mg-footer">
    <div class="mg-footer__inner">
      <div class="mg-footer__top">
        <div class="mg-footer__brand">
          <a href="#" class="mg-footer__logo" aria-label="MG Sri Lanka">
            <img
              src="/images/logo.png"
              alt="MG Sri Lanka"
              class="mg-footer__logo-image"
            />
          </a>

          <p class="mg-footer__intro">
            Iconic British automotive heritage, progressive design
            and intelligent technology for a new generation of driving.
          </p>
        </div>

        <div class="mg-footer__top-contact">
          <span class="mg-footer__contact-label">Customer support</span>

          <a :href="`tel:${showroom.phone}`" class="mg-footer__phone">
            {{ showroom.phone }}
          </a>

          <a
            :href="`mailto:${showroom.email}`"
            class="mg-footer__top-email"
          >
            {{ showroom.email }}
          </a>
        </div>
      </div>

      <div class="mg-footer__divider"></div>

      <div class="mg-footer__main">
        <div class="mg-footer__navigation">
          <div
            v-for="column in footerColumns"
            :key="column.title"
            class="mg-footer__column"
          >
            <h3>{{ column.title }}</h3>

            <ul>
              <li
                v-for="link in column.links"
                :key="link.label"
              >
                <a :href="link.href">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </div>

        <aside class="mg-footer__showroom">
          <div class="mg-footer__showroom-heading">
            <span class="mg-footer__eyebrow">MG SRI LANKA</span>
            <h3>Visit our showroom</h3>
          </div>

          <a
            :href="showroom.directions"
            target="_blank"
            rel="noopener noreferrer"
            class="mg-footer__address"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-5.3 7-12A7 7 0 1 0 5 9c0 6.7 7 12 7 12Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <circle
                cx="12"
                cy="9"
                r="2.3"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>

            <span>{{ showroom.address }}</span>
          </a>

          <a
            :href="showroom.directions"
            target="_blank"
            rel="noopener noreferrer"
            class="mg-footer__directions"
          >
            <span>Get directions</span>
            <span class="mg-footer__arrow">↗</span>
          </a>
        </aside>
      </div>

      <div class="mg-footer__lower">
        <p>
          Experience the spirit of MG in Sri Lanka — where
          distinctive design, advanced technology and everyday
          performance come together.
        </p>

        <div class="mg-footer__socials">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.href"
            :aria-label="social.name"
            class="mg-footer__social"
          >
            <svg
              v-if="social.type === 'facebook'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z"
                fill="currentColor"
              />
            </svg>

            <svg
              v-if="social.type === 'instagram'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              />
              <circle cx="17.3" cy="6.8" r="1" fill="currentColor" />
            </svg>

            <svg
              v-if="social.type === 'linkedin'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M6 8v11M6 5.5v.1M10 19v-6a4 4 0 0 1 8 0v6M10 11v8"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <div class="mg-footer__bottom">
        <p class="mg-footer__copyright">
          © {{ new Date().getFullYear() }} MG Sri Lanka. All Rights Reserved.
        </p>

        <div class="mg-footer__legal">
          <a href="#legal">Legal Notice</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookie Notice</a>
          <a href="#terms">Terms & Conditions</a>
        </div>
      </div>
    </div>

    <!-- GLOBAL FLOATING TEST DRIVE BUTTON -->
    <a
      href="#showroom"
      class="mg-drive-fab"
      aria-label="Book a test drive"
    >
      <span class="mg-drive-fab__icon">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="11.5" stroke="currentColor" stroke-width="1.8" />
          <circle cx="16" cy="16" r="3" stroke="currentColor" stroke-width="1.8" />
          <path d="M5.2 14.1h21.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M16 19v8.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M10.3 10.4 16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <path d="M21.7 10.4 16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </span>

      <span class="mg-drive-fab__content">
        <span class="mg-drive-fab__eyebrow">FEEL THE DRIVE</span>
        <span class="mg-drive-fab__title">Book a Test Drive</span>
      </span>
    </a>

  </footer>
</template>

<style scoped>
@import url(
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
);

.mg-footer {
  --white: #ffffff;
  --muted: rgba(255, 255, 255, 0.68);
  --subtle: rgba(255, 255, 255, 0.48);
  --line: rgba(255, 255, 255, 0.13);
  --red: #ed1c24;

  width: 100%;
  position: relative;

  background:
    radial-gradient(
      circle at 88% 8%,
      rgba(255, 255, 255, 0.085),
      transparent 30vw
    ),
    radial-gradient(
      circle at 8% 100%,
      rgba(237, 28, 36, 0.035),
      transparent 28vw
    ),
    linear-gradient(
      180deg,
      #171719 0%,
      #121214 48%,
      #0f0f11 100%
    );

  color: var(--white);

  font-family:
    "Manrope",
    Arial,
    sans-serif;

  overflow: hidden;
}

.mg-footer__inner {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding:
    clamp(56px, 5vw, 86px)
    var(--mg-page-gutter, 5vw)
    clamp(24px, 2vw, 34px) !important;
  box-sizing: border-box;
}

.mg-footer__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(40px, 6vw, 100px);
  padding-bottom: clamp(38px, 3vw, 52px);
}

.mg-footer__brand {
  display: flex;
  align-items: center;
  gap: clamp(30px, 3vw, 50px);
  min-width: 0;
}

.mg-footer__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-decoration: none;
}

.mg-footer__logo-image {
  display: block;
  width: clamp(78px, 5.4vw, 100px);
  height: auto;
  object-fit: contain;
}

.mg-footer__intro {
  width: min(38vw, 580px);
  margin: 0;
  color: var(--muted);
  font-size: clamp(13px, 0.9vw, 15px);
  line-height: 1.75;
}

.mg-footer__top-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.mg-footer__contact-label {
  margin-bottom: 9px;
  color: var(--muted);
  font-size: clamp(10px, 0.68vw, 12px);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mg-footer__phone {
  color: var(--white);
  font-size: clamp(21px, 1.55vw, 27px);
  font-weight: 600;
  letter-spacing: -0.035em;
  text-decoration: none;
}

.mg-footer__top-email {
  margin-top: 8px;
  color: var(--muted);
  font-size: clamp(12px, 0.78vw, 14px);
  text-decoration: none;
}

.mg-footer__top-email:hover {
  color: var(--white);
}

.mg-footer__divider {
  width: 100%;
  height: 1px;
  background: var(--line);
}

.mg-footer__main {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(270px, 1fr);
  gap: clamp(50px, 6vw, 110px);
  padding: clamp(42px, 3.5vw, 60px) 0 clamp(46px, 4vw, 66px);
}

.mg-footer__navigation {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(28px, 3vw, 50px);
}

.mg-footer__column h3 {
  margin: 0 0 clamp(19px, 1.6vw, 25px);
  color: var(--white);
  font-size: clamp(13px, 0.86vw, 15px);
  font-weight: 600;
}

.mg-footer__column ul {
  display: flex;
  flex-direction: column;
  gap: clamp(11px, 0.9vw, 14px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.mg-footer__column a {
  display: inline-flex;
  color: var(--muted);
  font-size: clamp(12px, 0.78vw, 14px);
  line-height: 1.55;
  text-decoration: none;
  transition:
    color 0.25s ease,
    transform 0.25s ease;
}

.mg-footer__column a:hover {
  color: var(--white);
  transform: translateX(4px);
}

.mg-footer__showroom {
  min-width: 0;
  padding-left: clamp(30px, 3vw, 50px);
  border-left: 1px solid var(--line);
}

.mg-footer__showroom-heading {
  margin-bottom: clamp(25px, 2vw, 34px);
}

.mg-footer__eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--red);
  font-size: clamp(10px, 0.63vw, 11px);
  font-weight: 700;
  letter-spacing: 0.15em;
}

.mg-footer__showroom h3 {
  margin: 0;
  max-width: 230px;
  color: var(--white);
  font-size: clamp(23px, 1.7vw, 30px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.mg-footer__address {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  color: var(--muted);
  font-size: clamp(12px, 0.78vw, 14px);
  line-height: 1.7;
  text-decoration: none;
}

.mg-footer__address:hover {
  color: var(--white);
}

.mg-footer__address svg {
  width: 19px;
  height: 19px;
  margin-top: 1px;
  flex: 0 0 19px;
}

.mg-footer__directions {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  margin-top: 25px;
  color: var(--white);
  font-size: clamp(12px, 0.8vw, 14px);
  font-weight: 600;
  text-decoration: none;
}

.mg-footer__arrow {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  transition:
    background 0.25s ease,
    border-color 0.25s ease;
}

.mg-footer__directions:hover .mg-footer__arrow {
  background: var(--red);
  border-color: var(--red);
}

.mg-footer__lower {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  padding: clamp(28px, 2.5vw, 38px) 0;
  border-top: 1px solid var(--line);
}

.mg-footer__lower p {
  max-width: 820px;
  margin: 0;
  color: var(--subtle);
  font-size: clamp(11px, 0.72vw, 13px);
  line-height: 1.75;
}

.mg-footer__socials {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mg-footer__social {
  width: clamp(35px, 2.4vw, 39px);
  height: clamp(35px, 2.4vw, 39px);
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.mg-footer__social:hover {
  background: var(--white);
  color: #111111;
  transform: translateY(-2px);
}

.mg-footer__social svg {
  width: 17px;
  height: 17px;
}

.mg-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding-top: clamp(22px, 1.8vw, 29px);
  border-top: 1px solid var(--line);
}

.mg-footer__copyright {
  margin: 0;
  color: var(--subtle);
  font-size: clamp(10px, 0.67vw, 12px);
}

.mg-footer__legal {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: clamp(15px, 1.8vw, 30px);
}

.mg-footer__legal a {
  color: var(--subtle);
  font-size: clamp(10px, 0.67vw, 12px);
  text-decoration: none;
}

.mg-footer__legal a:hover {
  color: var(--white);
}

@media (max-width: 1200px) {
  .mg-footer__main {
    grid-template-columns: 1fr;
  }

  .mg-footer__navigation {
    grid-template-columns: repeat(3, 1fr);
    row-gap: 42px;
  }

  .mg-footer__showroom {
    padding: 35px 0 0;
    border-left: none;
    border-top: 1px solid var(--line);
  }
}

@media (max-width: 850px) {
  .mg-footer__top {
    flex-direction: column;
    gap: 34px;
  }

  .mg-footer__brand {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  .mg-footer__intro {
    width: min(100%, 560px);
  }

  .mg-footer__top-contact {
    align-items: flex-start;
  }

  .mg-footer__navigation {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mg-footer__lower,
  .mg-footer__bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .mg-footer__legal {
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .mg-footer__inner {
    width: 100% !important;
    padding:
      46px
      var(--mg-page-gutter, 5vw)
      22px !important;
  }

  .mg-footer__logo-image {
    width: 72px;
  }

  .mg-footer__intro {
    width: 100%;
    font-size: 13px;
  }

  .mg-footer__phone {
    font-size: 20px;
  }

  .mg-footer__navigation {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 34px 24px;
  }

  .mg-footer__column h3 {
    font-size: 13px;
  }

  .mg-footer__column a,
  .mg-footer__address {
    font-size: 12px;
  }

  .mg-footer__showroom h3 {
    font-size: 23px;
  }

  .mg-footer__lower p {
    font-size: 11px;
  }

  .mg-footer__copyright,
  .mg-footer__legal a {
    font-size: 10px;
  }
}

@media (max-width: 390px) {
  .mg-footer__navigation {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   GLOBAL FLOATING TEST DRIVE
   One component: footer + fixed steering-wheel CTA
========================================================= */
.mg-drive-fab {
  position: fixed;
  z-index: 9999;
  right: 0;
  top: 62%;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 13px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-right: 0;
  border-radius: 22px 0 0 22px;
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
  color: #111111;
  text-decoration: none;
  overflow: hidden;
  transform: translateY(-50%);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
  transition:
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease;
}

.mg-drive-fab:hover,
.mg-drive-fab:focus-visible {
  width: 245px;
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.34);
}

.mg-drive-fab__icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #111111;
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
  transition:
    background 0.3s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease;
}

.mg-drive-fab__icon svg {
  width: 27px;
  height: 27px;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.mg-drive-fab:hover .mg-drive-fab__icon,
.mg-drive-fab:focus-visible .mg-drive-fab__icon {
  background: var(--red, #e30613);
  transform: scale(1.04);
  box-shadow: 0 8px 20px rgba(227, 6, 19, 0.24);
}

.mg-drive-fab:hover .mg-drive-fab__icon svg,
.mg-drive-fab:focus-visible .mg-drive-fab__icon svg {
  transform: rotate(9deg);
}

.mg-drive-fab__content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  margin-left: 14px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(14px);
  white-space: nowrap;
  transition:
    opacity 0.22s ease 0.08s,
    transform 0.32s ease 0.06s,
    visibility 0s linear 0.2s;
}

.mg-drive-fab:hover .mg-drive-fab__content,
.mg-drive-fab:focus-visible .mg-drive-fab__content {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition:
    opacity 0.24s ease 0.1s,
    transform 0.32s ease 0.07s;
}

.mg-drive-fab__eyebrow {
  color: var(--red, #e30613);
  font-size: 8px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mg-drive-fab__title {
  color: #111111;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.mg-drive-fab:focus-visible {
  outline: 2px solid var(--red, #e30613);
  outline-offset: 3px;
}

@media (max-width: 560px) {
  .mg-drive-fab {
    top: auto;
    right: 14px;
    bottom: 18px;
    width: 60px;
    height: 60px;
    padding: 0 9px;
    border-right: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 18px;
    transform: none;
  }

  .mg-drive-fab:hover,
  .mg-drive-fab:focus-visible {
    width: 215px;
  }

  .mg-drive-fab__icon {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }

  .mg-drive-fab__icon svg {
    width: 24px;
    height: 24px;
  }

  .mg-drive-fab__content {
    margin-left: 11px;
  }

  .mg-drive-fab__eyebrow {
    font-size: 7px;
  }

  .mg-drive-fab__title {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mg-drive-fab,
  .mg-drive-fab__icon,
  .mg-drive-fab__icon svg,
  .mg-drive-fab__content {
    transition: none;
  }
}

</style>
