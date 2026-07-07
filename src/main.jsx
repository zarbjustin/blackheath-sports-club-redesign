import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Beer,
  CalendarDays,
  Car,
  Clock,
  Dumbbell,
  ExternalLink,
  Facebook,
  Handshake,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  PartyPopper,
  PawPrint,
  Phone,
  Sparkles,
  Tv,
  Twitter,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { RugbyIcon, CricketIcon, TennisIcon, SquashIcon } from "./icons.jsx";

import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./styles.css";

import {
  club,
  sports,
  otherFacilities,
  venueFacilities,
  heritage,
  gallery,
  groundsMap,
  venueImage,
} from "./data.js";

import hero640 from "./assets/rectory-field-640.webp";
import hero1024 from "./assets/rectory-field-1024.webp";
import hero1440 from "./assets/rectory-field-1440.webp";
import hero1920 from "./assets/rectory-field-1920.webp";
import { heroBlur } from "./assets/hero-blur.js";

const sportIcons = {
  Rugby: RugbyIcon,
  Cricket: CricketIcon,
  Tennis: TennisIcon,
  Squash: SquashIcon,
};

const lucide = { Dumbbell, Baby, Beer, PartyPopper, Utensils, Accessibility, Car, Tv };

const easeOut = [0.22, 1, 0.36, 1];

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

function Reveal({ as = "section", className, children, ...rest }) {
  const MotionTag = m[as] ?? m.section;
  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 700], [0, 120]);
  const parallaxY = reduceMotion ? 0 : rawY;

  useEffect(() => {
    // If the image is served from cache, onLoad may fire before hydration.
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <section className="hero" aria-label={`${club.name} at ${club.address.line1}`}>
      <m.div className="hero-media" style={{ y: parallaxY }}>
        <img
          ref={imgRef}
          className={loaded ? "hero-img is-loaded" : "hero-img"}
          style={{ backgroundImage: `url(${heroBlur})` }}
          src={hero1440}
          srcSet={`${hero640} 640w, ${hero1024} 1024w, ${hero1440} 1440w, ${hero1920} 1920w`}
          sizes="100vw"
          width={1672}
          height={941}
          alt="The Rectory Field, home of Blackheath Sports Club"
          fetchpriority="high"
          onLoad={() => setLoaded(true)}
        />
      </m.div>
      <div className="hero-scrim" aria-hidden="true" />

      <m.div className="hero-content" variants={staggerContainer} initial="hidden" animate="show">
        <m.p className="eyebrow" variants={staggerItem}>
          The Rectory Field, Blackheath · Est. {club.established}
        </m.p>
        <m.h1 variants={staggerItem}>{club.name}</m.h1>
        <m.p className="hero-copy" variants={staggerItem}>
          {club.slogan}. A historic South East London home for rugby, cricket, tennis and
          squash — a family members' club with coaching for all ages, venue hire and more.
        </m.p>
        <m.div className="hero-actions" variants={staggerItem}>
          <a className="button primary" href="#membership">
            Become a member <ArrowRight size={18} />
          </a>
          <a className="button ghost" href="#hire">
            Hire the venue <CalendarDays size={18} />
          </a>
        </m.div>
      </m.div>

      <m.div
        className="hero-panel"
        aria-label="Club highlights"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
      >
        <span><MapPin size={17} /> Charlton Road, {club.address.postcode}</span>
        <span><Users size={17} /> Four sports, one club</span>
        <span><Clock size={17} /> Bar open 7 days</span>
      </m.div>
    </section>
  );
}

function Welcome() {
  const facts = [
    { icon: CalendarDays, label: `Established ${club.established}` },
    { icon: Users, label: "Four sporting clubs" },
    { icon: Handshake, label: "Family members' club" },
    { icon: Sparkles, label: "Coaching for all ages" },
  ];
  return (
    <Reveal className="intro band">
      <div className="section-heading">
        <p className="eyebrow">Welcome</p>
        <h2>One historic club, four sports and more</h2>
      </div>
      <div className="intro-grid">
        <div className="intro-copy">
          <p>
            The aim of Blackheath Sports Club is to promote quality sporting activities for
            our members all year round. Established over a century ago, we are the shared home
            of four clubs — rugby, cricket, tennis and squash — welcoming everyone from
            beginners with excellent coaching to teams competing at a high level, and with a
            strong tradition of sport for children of all ages.
          </p>
          <div className="notice">
            <PawPrint size={20} />
            <p>{club.dogNotice}</p>
          </div>
        </div>
        <m.ul
          className="fact-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {facts.map((f) => {
            const Icon = f.icon;
            return (
              <m.li key={f.label} variants={staggerItem}>
                <Icon size={20} />
                {f.label}
              </m.li>
            );
          })}
        </m.ul>
      </div>
    </Reveal>
  );
}

function Sports() {
  return (
    <Reveal className="sports-section" id="sports">
      <div className="section-heading">
        <p className="eyebrow">Sports at the Rectory Field</p>
        <h2>Four clubs, one home</h2>
      </div>
      <m.div
        className="sport-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {sports.map((sport) => {
          const Icon = sportIcons[sport.key];
          return (
            <m.a
              className="sport-card"
              key={sport.key}
              style={{ "--accent": sport.accent }}
              href={sport.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
            >
              <div className="sport-media">
                <img src={sport.image} alt={`${sport.key} at Blackheath Sports Club`} width={900} height={360} loading="lazy" decoding="async" />
                <span className="sport-badge"><Icon size={22} /></span>
              </div>
              <div className="sport-body">
                <h3>{sport.key}</h3>
                <p>{sport.detail}</p>
                <span className="sport-link">
                  Visit {sport.site} <ExternalLink size={15} />
                </span>
              </div>
            </m.a>
          );
        })}
      </m.div>
    </Reveal>
  );
}

function OtherFacilities() {
  return (
    <Reveal className="facilities-section band" id="facilities">
      <div className="section-heading">
        <p className="eyebrow">Also at the Rectory Field</p>
        <h2>More than four sports</h2>
      </div>
      <m.div
        className="facility-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {otherFacilities.map((f) => {
          const Icon = lucide[f.icon] ?? Sparkles;
          return (
            <m.a
              className="facility-card"
              key={f.name}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
            >
              <span className="facility-icon"><Icon size={26} /></span>
              <div className="facility-text">
                <h3>{f.name}</h3>
                <span className="facility-org">{f.org}</span>
                <p>{f.detail}</p>
              </div>
              <span className="facility-link">
                {f.site} <ArrowUpRight size={16} />
              </span>
            </m.a>
          );
        })}
      </m.div>
    </Reveal>
  );
}

function Membership() {
  return (
    <Reveal className="membership" id="membership">
      <div className="section-heading">
        <p className="eyebrow">Membership</p>
        <h2>Built for players, parents, supporters and social members</h2>
      </div>
      <div className="membership-layout">
        <div className="membership-copy">
          <p>
            Each sport runs its own playing membership through its club, while social membership
            of Blackheath Sports Club gives you the run of the clubhouse and bar seven days a week.
          </p>
          <div className="membership-price">
            <span className="price">{club.socialMembership}</span>
            <span>Social membership, giving full use of the bar facilities.</span>
          </div>
          <a className="button primary compact" href="#contact">
            Start an enquiry <MessageCircle size={18} />
          </a>
        </div>
        <m.div
          className="pathways"
          aria-label="Membership pathways"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {["Junior sport", "Adult teams", "Casual play", "Coaching", "Social membership", "Club events"].map((p) => (
            <m.span key={p} variants={staggerItem}>{p}</m.span>
          ))}
        </m.div>
      </div>
    </Reveal>
  );
}

function VenueHire() {
  return (
    <Reveal className="hire" id="hire">
      <div className="hire-grid">
        <div className="hire-copy">
          <p className="eyebrow">Venue hire</p>
          <h2>Clubhouse spaces for celebrations, meetings and events</h2>
          <p className="hire-lead">
            Members can hire our bar areas and function rooms for occasions large and small,
            with in-house catering tailored to your event.
          </p>
          <ul className="facility-list">
            {venueFacilities.map((f) => {
              const Icon = lucide[f.icon] ?? Sparkles;
              return (
                <li key={f.text}>
                  <Icon size={18} />
                  <span>{f.text}</span>
                </li>
              );
            })}
          </ul>
          <div className="hire-actions">
            <a className="button light" href={`mailto:${club.contact.email}`}>
              Enquire by email <Mail size={18} />
            </a>
            <a className="button ghost light-ghost" href={club.contact.phoneHref}>
              {club.contact.phone} <Phone size={18} />
            </a>
          </div>
        </div>
        <figure className="hire-media">
          <img src={venueImage} alt="The clubhouse bar at Blackheath Sports Club" width={900} height={360} loading="lazy" decoding="async" />
        </figure>
      </div>
    </Reveal>
  );
}

function Heritage() {
  return (
    <Reveal className="heritage" id="heritage">
      <div className="section-heading">
        <p className="eyebrow">Since {club.established}</p>
        <h2>A home for the history of the game</h2>
      </div>
      <div className="heritage-grid">
        <div className="timeline">
          <p className="heritage-intro">{heritage.intro}</p>
          {heritage.timeline.map((t) => (
            <div className="timeline-item" key={t.year}>
              <span className="year">{t.year}</span>
              <p>{t.text}</p>
            </div>
          ))}
          <p className="heritage-note">
            <Landmark size={18} /> {heritage.note}
          </p>
        </div>
        <div className="heritage-media">
          <figure className="heritage-main">
            <img src={heritage.images.team} alt={heritage.images.teamAlt} width={700} height={474} loading="lazy" decoding="async" />
            <figcaption>{heritage.images.teamAlt}</figcaption>
          </figure>
          <figure className="heritage-portrait">
            <img src={heritage.images.carpmael} alt={heritage.images.carpmaelAlt} width={216} height={285} loading="lazy" decoding="async" />
            <figcaption>{heritage.images.carpmaelAlt}</figcaption>
          </figure>
        </div>
      </div>
    </Reveal>
  );
}

function Gallery() {
  return (
    <Reveal className="gallery-section band">
      <div className="section-heading">
        <p className="eyebrow">Gallery</p>
        <h2>Life at the Rectory Field</h2>
      </div>
      <m.div
        className="gallery-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
      >
        {gallery.map((g) => (
          <m.figure className="gallery-item" key={g.caption} variants={staggerItem}>
            <img src={g.src} alt={g.caption} width={900} height={360} loading="lazy" decoding="async" />
            <figcaption>{g.caption}</figcaption>
          </m.figure>
        ))}
      </m.div>
    </Reveal>
  );
}

function Visit() {
  const { address } = club;
  return (
    <>
      <Reveal className="visit" id="visit">
        <div className="visit-copy">
          <p className="eyebrow">Visit us</p>
          <h2>The Rectory Field, Charlton Road</h2>
          <address className="visit-address">
            {address.line1}<br />
            {address.line2}<br />
            {address.city} {address.postcode}
          </address>
          <p className="satnav"><Navigation size={16} /> For Sat-Nav use postcode <strong>{address.satnav}</strong></p>
          <p>
            In the heart of South East London, close to local public transport with extensive
            on-site parking and wheelchair access throughout.
          </p>
          <a className="button primary compact" href={club.mapLink} target="_blank" rel="noopener noreferrer">
            Open in maps <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="visit-map">
          <iframe
            title="Map to Blackheath Sports Club"
            src={club.mapEmbed}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups"
          ></iframe>
        </div>
      </Reveal>

      <Reveal className="grounds band">
        <div className="section-heading">
          <p className="eyebrow">Our grounds</p>
          <h2>Find your way around the club</h2>
        </div>
        <div className="grounds-grid">
          <figure className="grounds-map">
            <img src={groundsMap.image} alt="Map of the Blackheath Sports Club grounds" width={675} height={785} loading="lazy" decoding="async" />
          </figure>
          <ul className="grounds-legend">
            {groundsMap.legend.map((item) => (
              <li key={item}><MapPin size={16} /> {item}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </>
  );
}

function Contact() {
  return (
    <Reveal className="contact" id="contact">
      <div className="section-heading">
        <p className="eyebrow">Get in touch</p>
        <h2>Bar & venue enquiries</h2>
      </div>
      <div className="contact-grid">
        <a className="contact-card" href={`mailto:${club.contact.email}`}>
          <Mail size={22} />
          <span className="contact-label">Email</span>
          <span className="contact-value">{club.contact.email}</span>
        </a>
        <a className="contact-card" href={club.contact.phoneHref}>
          <Phone size={22} />
          <span className="contact-label">Telephone</span>
          <span className="contact-value">{club.contact.phone}</span>
        </a>
        <div className="contact-card">
          <Clock size={22} />
          <span className="contact-label">Bar opening hours</span>
          {club.hours.map((h) => (
            <span className="contact-value" key={h.days}>{h.days}: {h.time}</span>
          ))}
        </div>
      </div>
      <div className="contact-footer">
        <p>
          For rugby, cricket, tennis or squash enquiries, please contact each club directly via
          their website above.
        </p>
        <div className="socials">
          <a href={club.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href={club.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    ["Sports", "#sports"],
    ["Venue hire", "#hire"],
    ["Membership", "#membership"],
    ["Heritage", "#heritage"],
    ["Visit", "#visit"],
  ];

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <a className="brand" href="#top" aria-label={`${club.name} home`}>
          <span className="brand-mark">BSC</span>
          <span>
            Blackheath
            <strong>Sports Club</strong>
          </span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Enquire</a>
        </nav>
      </header>

      <main id="top">
        <Hero />
        <Welcome />
        <Sports />
        <OtherFacilities />
        <Membership />
        <VenueHire />
        <Heritage />
        <Gallery />
        <Visit />
        <Contact />
      </main>

      <footer>
        <div className="footer-brand">
          <strong>{club.name}</strong>
          <span>{club.address.line1}, {club.address.line2}, {club.address.city} {club.address.postcode}</span>
        </div>
        <div className="footer-social">
          <a href={club.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href={club.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
            <Twitter size={18} />
          </a>
        </div>
      </footer>
      </LazyMotion>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")).render(<App />);
