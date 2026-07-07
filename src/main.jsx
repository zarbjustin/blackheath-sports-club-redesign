import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Handshake,
  MapPin,
  Menu,
  MessageCircle,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { RugbyIcon, CricketIcon, TennisIcon, SquashIcon } from "./icons.jsx";

import "@fontsource-variable/fraunces";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import "./styles.css";

import hero640 from "./assets/rectory-field-640.webp";
import hero1024 from "./assets/rectory-field-1024.webp";
import hero1440 from "./assets/rectory-field-1440.webp";
import hero1920 from "./assets/rectory-field-1920.webp";
import { heroBlur } from "./assets/hero-blur.js";

const sports = [
  {
    name: "Rugby",
    detail: "A proud Rectory Field tradition with match-day energy and club pathways.",
    icon: RugbyIcon,
    accent: "var(--brick)",
    action: "View fixtures",
  },
  {
    name: "Cricket",
    detail: "Summer cricket, junior development, social fixtures, and green space at the heart of the club.",
    icon: CricketIcon,
    accent: "var(--gold)",
    action: "Join the season",
  },
  {
    name: "Tennis",
    detail: "All-year tennis access with coaching, teams, casual play, and a welcoming club culture.",
    icon: TennisIcon,
    accent: "var(--blue)",
    action: "Book a court",
  },
  {
    name: "Squash",
    detail: "Indoor court sport for members, teams, leagues, coaching, and evening play.",
    icon: SquashIcon,
    accent: "var(--forest)",
    action: "Find a game",
  },
];

const priorities = [
  "Make the four sports visible within seconds, with equal status and clear entry points.",
  "Promote venue hire and the clubhouse as part of the club offer, not a buried secondary page.",
  "Bring the heritage of Rectory Field forward while making the site feel fresh on mobile.",
  "Create future-ready spaces for photography, fixtures, events, and membership campaigns.",
];

const events = [
  { date: "Sat", title: "Weekend fixtures", meta: "Rugby, cricket, tennis and squash activity" },
  { date: "Sun", title: "Junior sessions", meta: "Coaching pathways and family-friendly club time" },
  { date: "Weeknights", title: "Courts and clubhouse", meta: "Evening play, training, socials and hire" },
];

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
  const MotionTag = motion[as] ?? motion.section;
  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 700], [0, 120]);
  const parallaxY = reduceMotion ? 0 : rawY;

  return (
    <section className="hero" aria-label="Blackheath Sports Club at Rectory Field">
      <motion.div className="hero-media" style={{ y: parallaxY }}>
        <img
          className={loaded ? "hero-img is-loaded" : "hero-img"}
          style={{ backgroundImage: `url(${heroBlur})` }}
          src={hero1440}
          srcSet={`${hero640} 640w, ${hero1024} 1024w, ${hero1440} 1440w, ${hero1920} 1920w`}
          sizes="100vw"
          width={1672}
          height={941}
          alt="Concept view of Blackheath Sports Club's multi-sport ground at Rectory Field"
          fetchpriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
      <div className="hero-scrim" aria-hidden="true" />

      <motion.div
        className="hero-content"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.p className="eyebrow" variants={staggerItem}>
          Rectory Field, Blackheath
        </motion.p>
        <motion.h1 variants={staggerItem}>Blackheath Sports Club</motion.h1>
        <motion.p className="hero-copy" variants={staggerItem}>
          A historic South East London home for rugby, cricket, tennis, squash, events,
          families, teams, and the next generation of club sport.
        </motion.p>
        <motion.div className="hero-actions" variants={staggerItem}>
          <a className="button primary" href="#membership">
            Become a member <ArrowRight size={18} />
          </a>
          <a className="button ghost" href="#hire">
            Hire the venue <CalendarDays size={18} />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-panel"
        aria-label="Club highlights"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
      >
        <span><MapPin size={17} /> Charlton Road, SE3</span>
        <span><Users size={17} /> Four sports, one club</span>
        <span><Clock size={17} /> Weekday and weekend activity</span>
      </motion.div>
    </section>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <a className="brand" href="#top" aria-label="Blackheath Sports Club home">
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
          <a href="#sports" onClick={() => setOpen(false)}>Sports</a>
          <a href="#membership" onClick={() => setOpen(false)}>Membership</a>
          <a href="#hire" onClick={() => setOpen(false)}>Venue hire</a>
          <a href="#visit" onClick={() => setOpen(false)}>Visit</a>
          <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Enquire</a>
        </nav>
      </header>

      <main id="top">
        <Hero />

        <Reveal className="intro band">
          <div className="section-heading">
            <p className="eyebrow">Review-led redesign</p>
            <h2>A clearer club front door</h2>
          </div>
          <motion.div
            className="priority-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {priorities.map((item) => (
              <motion.article className="priority" key={item} variants={staggerItem}>
                <Sparkles size={20} />
                <p>{item}</p>
              </motion.article>
            ))}
          </motion.div>
        </Reveal>

        <Reveal className="sports-section" id="sports">
          <div className="section-heading">
            <p className="eyebrow">Sports at Rectory Field</p>
            <h2>Find your way into the club</h2>
          </div>
          <motion.div
            className="sport-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {sports.map((sport) => {
              const Icon = sport.icon;
              return (
                <motion.article
                  className="sport-card"
                  key={sport.name}
                  style={{ "--accent": sport.accent }}
                  variants={staggerItem}
                >
                  <span className="sport-icon"><Icon size={30} /></span>
                  <h3>{sport.name}</h3>
                  <p>{sport.detail}</p>
                  <a href="#contact">
                    {sport.action} <ChevronRight size={17} />
                  </a>
                </motion.article>
              );
            })}
          </motion.div>
        </Reveal>

        <Reveal className="membership band" id="membership">
          <div className="section-heading">
            <p className="eyebrow">Membership</p>
            <h2>Built for players, parents, supporters and social members</h2>
          </div>
          <div className="membership-layout">
            <div className="membership-copy">
              <p>
                The new journey separates sport-specific actions from club-wide decisions,
                so visitors can quickly choose coaching, court access, team play, venue hire,
                junior sport, or social membership without hunting through legacy pages.
              </p>
              <a className="button primary compact" href="#contact">
                Start an enquiry <MessageCircle size={18} />
              </a>
            </div>
            <motion.div
              className="pathways"
              aria-label="Membership pathways"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {["Junior sport", "Adult teams", "Casual play", "Coaching", "Social membership", "Club events"].map((p) => (
                <motion.span key={p} variants={staggerItem}>{p}</motion.span>
              ))}
            </motion.div>
          </div>
        </Reveal>

        <Reveal className="events" aria-label="Club activity">
          <div className="section-heading">
            <p className="eyebrow">Always active</p>
            <h2>A weekly rhythm visitors can understand</h2>
          </div>
          <motion.div
            className="event-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {events.map((event) => (
              <motion.article className="event-row" key={event.title} variants={staggerItem}>
                <div className="date">{event.date}</div>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.meta}</p>
                </div>
                <ArrowRight size={19} />
              </motion.article>
            ))}
          </motion.div>
        </Reveal>

        <Reveal className="hire band" id="hire">
          <div>
            <p className="eyebrow">Venue hire</p>
            <h2>Clubhouse spaces for sport, celebrations and community gatherings</h2>
          </div>
          <p>
            Venue hire deserves a stronger presence. This concept treats the clubhouse as
            a core part of the offer, with prominent calls to action, space for event
            photography, package details, and a fast enquiry flow.
          </p>
          <a className="button light" href="#contact">
            Discuss an event <Handshake size={18} />
          </a>
        </Reveal>

        <Reveal className="visit" id="visit">
          <div className="visit-copy">
            <p className="eyebrow">Visit us</p>
            <h2>Rectory Field, Charlton Road</h2>
            <p>
              The redesign keeps the location obvious and practical, with transport,
              accessibility, parking, and match-day guidance ready to expand when the club
              supplies confirmed operational details.
            </p>
          </div>
          <div className="map-panel" aria-label="Location summary">
            <MapPin size={34} />
            <strong>Blackheath Sports Club</strong>
            <span>Rectory Field, Charlton Road, London SE3 8SR</span>
            <a href="https://www.google.com/maps/search/?api=1&query=Blackheath%20Sports%20Club%20Rectory%20Field%20Charlton%20Road%20London%20SE3%208SR">
              Open in maps <ArrowRight size={17} />
            </a>
          </div>
        </Reveal>

        <Reveal className="contact band" id="contact">
          <div className="section-heading">
            <p className="eyebrow">Next step</p>
            <h2>Ready for real club imagery, copy and booking links</h2>
          </div>
          <div className="contact-grid">
            <a href="mailto:info@blackheathsportsclub.co.uk">
              General enquiry <ArrowRight size={18} />
            </a>
            <a href="#sports">
              Choose a sport <ArrowRight size={18} />
            </a>
            <a href="#hire">
              Plan venue hire <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </main>

      <footer>
        <strong>Blackheath Sports Club concept redesign</strong>
        <span>Prepared as a modern website direction for zarbjustin.</span>
      </footer>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")).render(<App />);
