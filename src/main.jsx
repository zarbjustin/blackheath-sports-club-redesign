import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Dumbbell,
  Goal,
  Handshake,
  MapPin,
  Menu,
  MessageCircle,
  Shield,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";
import "./styles.css";

const sports = [
  {
    name: "Rugby",
    detail: "A proud Rectory Field tradition with match-day energy and club pathways.",
    icon: Shield,
    accent: "var(--brick)",
    action: "View fixtures",
  },
  {
    name: "Cricket",
    detail: "Summer cricket, junior development, social fixtures, and green space at the heart of the club.",
    icon: Trophy,
    accent: "var(--gold)",
    action: "Join the season",
  },
  {
    name: "Tennis",
    detail: "All-year tennis access with coaching, teams, casual play, and a welcoming club culture.",
    icon: Goal,
    accent: "var(--blue)",
    action: "Book a court",
  },
  {
    name: "Squash",
    detail: "Indoor court sport for members, teams, leagues, coaching, and evening play.",
    icon: Dumbbell,
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

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
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
        <section className="hero" aria-label="Blackheath Sports Club at Rectory Field">
          <div className="hero-media" role="img" aria-label="Concept image of a community multi-sport club ground"></div>
          <div className="hero-content">
            <p className="eyebrow">Rectory Field, Blackheath</p>
            <h1>Blackheath Sports Club</h1>
            <p className="hero-copy">
              A historic South East London home for rugby, cricket, tennis, squash, events,
              families, teams, and the next generation of club sport.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#membership">
                Become a member <ArrowRight size={18} />
              </a>
              <a className="button ghost" href="#hire">
                Hire the venue <CalendarDays size={18} />
              </a>
            </div>
          </div>
          <div className="hero-panel" aria-label="Club highlights">
            <span><MapPin size={17} /> Charlton Road, SE3</span>
            <span><Users size={17} /> Four sports, one club</span>
            <span><Clock size={17} /> Weekday and weekend activity</span>
          </div>
        </section>

        <section className="intro band">
          <div className="section-heading">
            <p className="eyebrow">Review-led redesign</p>
            <h2>A clearer club front door</h2>
          </div>
          <div className="priority-list">
            {priorities.map((item) => (
              <article className="priority" key={item}>
                <Sparkles size={20} />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sports-section" id="sports">
          <div className="section-heading">
            <p className="eyebrow">Sports at Rectory Field</p>
            <h2>Find your way into the club</h2>
          </div>
          <div className="sport-grid">
            {sports.map((sport) => {
              const Icon = sport.icon;
              return (
                <article className="sport-card" key={sport.name} style={{ "--accent": sport.accent }}>
                  <Icon size={30} />
                  <h3>{sport.name}</h3>
                  <p>{sport.detail}</p>
                  <a href="#contact">
                    {sport.action} <ChevronRight size={17} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="membership band" id="membership">
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
            <div className="pathways" aria-label="Membership pathways">
              <span>Junior sport</span>
              <span>Adult teams</span>
              <span>Casual play</span>
              <span>Coaching</span>
              <span>Social membership</span>
              <span>Club events</span>
            </div>
          </div>
        </section>

        <section className="events" aria-label="Club activity">
          <div className="section-heading">
            <p className="eyebrow">Always active</p>
            <h2>A weekly rhythm visitors can understand</h2>
          </div>
          <div className="event-list">
            {events.map((event) => (
              <article className="event-row" key={event.title}>
                <div className="date">{event.date}</div>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.meta}</p>
                </div>
                <ArrowRight size={19} />
              </article>
            ))}
          </div>
        </section>

        <section className="hire band" id="hire">
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
        </section>

        <section className="visit" id="visit">
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
        </section>

        <section className="contact band" id="contact">
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
        </section>
      </main>

      <footer>
        <strong>Blackheath Sports Club concept redesign</strong>
        <span>Prepared as a modern website direction for zarbjustin.</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
