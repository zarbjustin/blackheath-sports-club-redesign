// Structured content for Blackheath Sports Club, validated against the live site
// https://www.blackheathsportsclub.co.uk/ (home, facilities, history, contact, map).
// Photos are © Blackheath Sports Club, optimized via scripts/import-club-media.mjs.

import rugbyImg from "./assets/club/rugby.webp";
import cricketImg from "./assets/club/cricket.webp";
import tennisImg from "./assets/club/tennis.webp";
import squashImg from "./assets/club/squash.webp";
import venueBarImg from "./assets/club/venue-bar.webp";
import heritageTeamImg from "./assets/club/heritage-team.webp";
import heritageCarpmaelImg from "./assets/club/heritage-carpmael.webp";
import sitemapImg from "./assets/club/sitemap.webp";
import gCricket1stXi from "./assets/club/gallery-cricket-1stxi.webp";
import gWomensXv from "./assets/club/gallery-womens-xv.webp";
import gJuniors from "./assets/club/gallery-juniors.webp";
import gCinderford from "./assets/club/gallery-rugby-cinderford.webp";
import gTennisDoubles from "./assets/club/gallery-tennis-doubles.webp";
import gSquash from "./assets/club/gallery-squash.webp";
import gTennis from "./assets/club/gallery-tennis.webp";

export const club = {
  name: "Blackheath Sports Club",
  slogan: "Sporting Excellence in the Community",
  established: 1883,
  address: {
    line1: "The Rectory Field",
    line2: "Charlton Road",
    city: "London",
    postcode: "SE3 8SR",
    satnav: "SE7 7EY",
  },
  contact: {
    email: "bhsportsclub@outlook.com",
    phone: "020 8858 1578",
    phoneHref: "tel:+442088581578",
  },
  hours: [
    { days: "Weekdays", time: "6pm – 11pm" },
    { days: "Weekends", time: "11:30am – 11pm" },
  ],
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100087115879365",
    twitter: "https://twitter.com/BHSportsClub",
  },
  socialMembership: "£50 / year",
  dogNotice:
    "For the safety of all members and visitors, no dogs (except assistance dogs) are permitted within the grounds. Please respect this rule.",
  mapEmbed:
    "https://maps.google.com/maps?q=Blackheath%20Sports%20Club%2C%20Rectory%20Field%2C%20Charlton%20Road%2C%20London%20SE3%208SR&z=15&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Blackheath%20Sports%20Club%20Rectory%20Field%20Charlton%20Road%20London%20SE3%208SR",
};

export const sports = [
  {
    key: "Rugby",
    detail: "Home to one of the world's oldest rugby clubs — a proud Rectory Field tradition of match-day energy, junior pathways and top-class club rugby.",
    url: "https://www.blackheathrugby.co.uk/",
    site: "blackheathrugby.co.uk",
    image: rugbyImg,
    accent: "var(--brick)",
  },
  {
    key: "Cricket",
    detail: "Played at the Rectory Field since 1885 — summer fixtures, junior development and a green heart to the club.",
    url: "https://www.pitchero.com/clubs/blackheathcricketclub",
    site: "pitchero.com",
    image: cricketImg,
    accent: "var(--gold)",
  },
  {
    key: "Tennis",
    detail: "Lawn tennis, one of the club's founding sports — all-year coaching, teams, casual play and a welcoming culture.",
    url: "https://www.blackheathlawntennisclub.org.uk/",
    site: "blackheathlawntennisclub.org.uk",
    image: tennisImg,
    accent: "var(--blue)",
  },
  {
    key: "Squash",
    detail: "Indoor courts added in 1937 as the club's fourth sport — teams, leagues, coaching and evening play for members.",
    url: "https://www.blackheathsquashclub.co.uk/",
    site: "blackheathsquashclub.co.uk",
    image: squashImg,
    accent: "var(--forest)",
  },
];

export const otherFacilities = [
  {
    name: "Gym",
    org: "Better Body Blackheath",
    detail: "On-site gym and personal training at the Rectory Field.",
    url: "https://betterbodyblackheath.co.uk/",
    site: "betterbodyblackheath.co.uk",
    icon: "Dumbbell",
  },
  {
    name: "Day Nursery",
    org: "The Blackheath Day Nursery",
    detail: "A day nursery set within the club's grounds.",
    url: "https://www.theblackheathdaynursery.co.uk/",
    site: "theblackheathdaynursery.co.uk",
    icon: "Baby",
  },
];

export const venueFacilities = [
  { icon: "Beer", text: "Bar areas and function rooms available to hire" },
  { icon: "PartyPopper", text: "Weddings, celebrations, conferences, training courses and wakes" },
  { icon: "Utensils", text: "In-house catering tailored to your event" },
  { icon: "Accessibility", text: "Wheelchair access throughout the club" },
  { icon: "Car", text: "Private on-site parking" },
  { icon: "Tv", text: "Live sport on Sky, ESPN and TNT Sports, plus free WiFi" },
];

export const heritage = {
  intro:
    "Sport has been played at the Rectory Field for over 140 years — home to four historic clubs and part of the story of the game itself.",
  timeline: [
    {
      year: "1883",
      text: "Sport begins at the Rectory Field as Blackheath Football Club moves from Old Dover Road, on land leased from the Maryon-Wilson Estate.",
    },
    {
      year: "1885",
      text: "Cricket joins rugby. The Blackheath Cricket, Football and Lawn Tennis Company is founded with £3,000 of capital to maintain the ground.",
    },
    {
      year: "1937",
      text: "Two squash courts are built, adding the fourth sport still played at the Rectory Field today.",
    },
  ],
  note: "W. P. Carpmael, founder of The Barbarians, played for Blackheath.",
  images: {
    team: heritageTeamImg,
    teamAlt: "Blackheath rugby team, 19th century",
    carpmael: heritageCarpmaelImg,
    carpmaelAlt: "W. P. Carpmael, founder of The Barbarians",
  },
};

export const gallery = [
  { src: gCricket1stXi, caption: "Cricket 1st XI at the Rectory Field" },
  { src: gWomensXv, caption: "Women's XV" },
  { src: gJuniors, caption: "Junior rugby" },
  { src: gCinderford, caption: "Rugby v Cinderford" },
  { src: gTennisDoubles, caption: "Tennis doubles" },
  { src: gSquash, caption: "Squash at the club" },
  { src: gTennis, caption: "Tennis at the Rectory Field" },
  { src: venueBarImg, caption: "The clubhouse bar" },
];

export const groundsMap = {
  image: sitemapImg,
  legend: [
    "Rugby pitches",
    "Cricket square & outfield",
    "Tennis courts",
    "Squash courts",
    "Clubhouse & bars",
    "Gym & day nursery",
    "On-site parking",
  ],
};

export const venueImage = venueBarImg;
