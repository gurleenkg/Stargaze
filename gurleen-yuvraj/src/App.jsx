import { useCallback, useEffect, useRef, useState } from 'react';
import { DetailDialog } from './components/DetailDialog.jsx';
import { Reveal } from './components/Reveal.jsx';
import { SafeImg } from './components/SafeImg.jsx';
import { IMAGES } from './constants/images.js';
import { MODAL_HTML } from './modalHtml.js';
import brandLogo from './assets/branding/logo_stargaze.jpeg';
import dryVanImg from './assets/equipment/dry-van.jpg';
import reeferImg from './assets/equipment/reefer.jpg';
import flatbedImg from './assets/equipment/flatbed.jpg';
import powerOnlyImg from './assets/equipment/power-only.jpg';
import sprinterVanImg from './assets/equipment/sprinter-van.jpg';
import ftlImg from './assets/equipment/ftl.jpg';
import ltlImg from './assets/equipment/ltl.jpg';

const TICKER = ['Dry van 53′', 'Reefer', 'Flatbed & step deck', 'Power-only', 'Expedited', 'Canada–USA'];
const SERVICES = [
  { title: 'Dry van (53′)', desc: 'General freight, retail, and packaged materials.', key: 'dryvan', modalTitle: 'Dry van (53′)', delay: 0, img: dryVanImg },
  { title: 'Reefer', desc: 'Temperature-controlled food, beverage, and sensitive products.', key: 'reefer', modalTitle: 'Refrigerated (reefer)', delay: 60, img: reeferImg },
  { title: 'Flatbed & step deck', desc: 'Oversized, construction, and industrial freight.', key: 'flatbed', modalTitle: 'Flatbed & step deck', delay: 120, img: flatbedImg },
  { title: 'Power-only', desc: 'Drop-and-hook and trailer repositioning.', key: 'power', modalTitle: 'Power-only', delay: 40, img: powerOnlyImg },
  { title: 'Sprinter vans & straight trucks', desc: 'Expedited and time-critical shipments.', key: 'expedited', modalTitle: 'Expedited capacity', delay: 100, img: sprinterVanImg },
  { title: 'Full truckload (FTL)', desc: 'Dedicated trailer for one shipment with direct, faster transit.', key: 'ftl', modalTitle: 'Full truckload (FTL)', delay: 140, img: ftlImg },
  { title: 'Less than truckload (LTL)', desc: 'Shared trailer space for palletized freight with cost-efficient moves.', key: 'ltl', modalTitle: 'Less than truckload (LTL)', delay: 180, img: ltlImg },
];
const INDUSTRIES = [
  { emoji: '🥦', name: 'Food & beverage', blurb: 'Food-grade freight and temperature-sensitive loads.', key: 'food', title: 'Food & beverage' },
  { emoji: '🧪', name: 'Chemical & ingredients', blurb: 'Non-hazardous chemicals and bulk materials.', key: 'chemical', title: 'Chemical & ingredients', delay: 50 },
  { emoji: '🛒', name: 'Retail & consumer', blurb: 'Palletized freight and DC replenishment.', key: 'retail', title: 'Retail & consumer goods', delay: 100 },
  { emoji: '🌾', name: 'Agriculture', blurb: 'Feed, raw materials, and seasonal freight.', key: 'ag', title: 'Agriculture & commodities', delay: 150 },
  { emoji: '🏭', name: 'Manufacturing', blurb: 'Parts, inputs, and finished goods.', key: 'mfg', title: 'Manufacturing & industrial', delay: 200 },
  { emoji: '⚠️', name: 'Dangerous goods (hazmat)', blurb: 'Regulated hazardous freight managed with strict compliance.', key: 'hazmat', title: 'Dangerous goods (hazmat)', delay: 40 },
  { emoji: '💊', name: 'Pharma & healthcare', blurb: 'High-integrity freight with handling and timing controls.', key: 'pharma', title: 'Pharma & healthcare', delay: 80 },
  { emoji: '❄️', name: 'Temperature-controlled', blurb: 'Reefer support for products requiring cold-chain stability.', key: 'reeferSector', title: 'Temperature-controlled (reefer)', delay: 120 },
  { emoji: '🏗️', name: 'Construction materials', blurb: 'Building products, steel, and job-site bound freight.', key: 'construction', title: 'Construction and materials', delay: 160 },
  { emoji: '⚡', name: 'Energy & industrial', blurb: 'Heavy components and project freight for energy operations.', key: 'energy', title: 'Energy and industrial', delay: 190 },
  { emoji: '📦', name: 'LTL & partial loads', blurb: 'Smaller shipments optimized through shared-capacity networks.', key: 'ltlPartial', title: 'LTL & Partial Loads', delay: 220 },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    frequency: '',
    lane: '',
    notes: '',
  });
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);

  const openModal = useCallback((htmlKey, title) => {
    if (!MODAL_HTML[htmlKey]) return;
    setDialog({ htmlKey, title });
  }, []);

  const closeModal = useCallback(() => setDialog(null), []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const img = heroImgRef.current;
    const hero = heroRef.current;
    if (!img || !hero) return;
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const p = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.55)));
      img.style.transform = `scale(1.07) translateY(${p * 26}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function submitQuote(e) {
    e.preventDefault();
    if (!quoteForm.email.trim() && !quoteForm.phone.trim()) {
      window.alert('Please enter at least an email or phone so we can reach you.');
      return;
    }
    const body = [
      `Quote request — Stargaze Freight`,
      ``,
      `Name: ${quoteForm.name}`,
      `Company: ${quoteForm.company}`,
      `Email: ${quoteForm.email}`,
      `Phone: ${quoteForm.phone}`,
      `Service: ${quoteForm.service}`,
      `Frequency: ${quoteForm.frequency}`,
      `Lane: ${quoteForm.lane}`,
      `Notes: ${quoteForm.notes}`,
    ].join('\n');
    const mailto = `mailto:ops@stargazefreight.com?subject=${encodeURIComponent('Quote request — Stargaze Freight')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setQuoteSent(true);
    window.setTimeout(() => setQuoteSent(false), 5000);
  }

  return (
    <div className="font-body bg-white text-slate-800 antialiased">
      <div className="fixed left-0 right-0 top-0 z-[101] flex h-9 items-center justify-center gap-6 border-b border-white/5 bg-[#060d1a] text-[0.72rem] font-semibold tracking-wide text-white/65">
        <a href="tel:+12045001481" className="transition hover:text-accent">
          +1 204-500-1481
        </a>
        <span className="hidden text-white/30 sm:inline">|</span>
        <a href="mailto:ops@stargazefreight.com" className="transition hover:text-accent">
          ops@stargazefreight.com
        </a>
      </div>

      <nav
        className={`fixed left-0 right-0 top-9 z-[100] flex h-[70px] items-center justify-between border-b border-white/5 px-[5vw] backdrop-blur-md transition-colors ${
          navScrolled ? 'bg-navy/98 shadow-lg' : 'bg-navy/92'
        }`}
      >
        <a href="#hero" className="flex items-center gap-2.5 no-underline">
          <img
            src={brandLogo}
            alt="Stargaze Freight logo"
            className="h-[52px] w-[52px] shrink-0 rounded object-contain"
            width="52"
            height="52"
            loading="eager"
            decoding="async"
          />
          <div className="font-display text-xl font-extrabold leading-tight tracking-wide text-white">
            STARGAZE
            <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-accent">FREIGHT INC.</span>
          </div>
        </a>
        <ul className="hidden list-none items-center gap-7 lg:flex">
          {[
            ['#about', 'About'],
            ['#services', 'Services'],
            ['#industries', 'Industries'],
            ['#why', 'Why Us'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="text-sm font-medium tracking-wide text-white/75 transition hover:text-accent">
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded bg-accent px-5 py-2 text-sm font-bold !text-navy transition hover:bg-accent-light"
            >
              Get a Quote
            </a>
          </li>
        </ul>
        <button
          type="button"
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 rounded bg-white" />
          <span className="block h-0.5 w-6 rounded bg-white" />
          <span className="block h-0.5 w-6 rounded bg-white" />
        </button>
      </nav>

      <div
        className={`fixed left-[5vw] right-[5vw] top-[112px] z-[99] max-h-[min(420px,calc(100vh-120px))] flex-col gap-1 overflow-y-auto rounded-xl border border-white/15 bg-[#09142a] px-5 py-4 shadow-2xl shadow-black/35 lg:hidden ${
          mobileOpen ? 'flex' : 'hidden'
        }`}
      >
        {[
          ['#about', 'About'],
          ['#services', 'Services'],
          ['#industries', 'Industries'],
          ['#why', 'Why Us'],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="border-b border-white/5 py-3 text-base font-medium text-white/70"
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </a>
        ))}
        <a
          href="#contact"
          className="mt-2 rounded bg-accent py-3 text-center text-base font-bold text-navy"
          onClick={() => setMobileOpen(false)}
        >
          Get a Quote
        </a>
      </div>

      <section
        id="hero"
        ref={heroRef}
        className="relative isolate grid min-h-screen grid-cols-1 overflow-hidden bg-navy pt-[106px] lg:grid-cols-2"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_75%_45%,rgba(13,59,142,0.5)_0%,transparent_65%),radial-gradient(ellipse_35%_35%_at_15%_75%,rgba(245,166,35,0.07)_0%,transparent_55%),linear-gradient(135deg,#0a1628_0%,#0d2145_55%,#0a1628_100%)]" />
        <div className="pointer-events-none absolute inset-0 hero-grid-bg opacity-[0.07]" />
        <div className="animate-road pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[3px] overflow-hidden" />

        <div className="relative z-[2] flex flex-col justify-center px-[5vw] pb-16 pt-10 lg:pb-24 lg:pr-8">
          <Reveal className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-accent">
              Canada–USA freight brokerage
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-black leading-[0.95] tracking-tight text-white">
              YOUR FREIGHT.<em className="not-italic text-accent">OUR PRIORITY.</em>
            </h1>
          </Reveal>
          <Reveal delay={120} className="mt-6 max-w-md text-lg font-light leading-relaxed text-white/60">
            Reliable capacity, proactive communication, and planning across regional and long-haul lanes — including
            cross-border moves between Canada and the United States.
          </Reveal>
          <Reveal delay={180} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-7 py-3.5 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/35"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.2 6.2l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Request a quote
            </a>
            <a
              href="#services"
              className="rounded-md border-[1.5px] border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
            >
              Explore services →
            </a>
          </Reveal>
          <Reveal delay={240} className="mt-12 flex flex-wrap items-center gap-8">
            <div>
              <div className="font-display text-4xl font-extrabold text-white">
                24<span className="text-accent">/7</span>
              </div>
              <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-white/45">Responsiveness</div>
            </div>
            <div className="hidden h-9 w-px bg-white/15 sm:block" />
            <div>
              <div className="font-display text-4xl font-extrabold text-white">
                100<span className="text-accent">%</span>
              </div>
              <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-white/45">Shipment focus</div>
            </div>
            <div className="hidden h-9 w-px bg-white/15 sm:block" />
            <div>
              <div className="font-display text-4xl font-extrabold text-white">
                11<span className="text-accent">+</span>
              </div>
              <div className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-white/45">Core sectors</div>
            </div>
          </Reveal>
        </div>

        <div className="relative z-[2] min-h-[280px] lg:min-h-0">
          <div className="relative h-full min-h-[320px] lg:absolute lg:inset-0">
            <div className="absolute inset-0 overflow-hidden rounded-none shadow-2xl lg:left-0 lg:rounded-l-xl">
              <SafeImg
                ref={heroImgRef}
                primary={IMAGES.hero.primary}
                fallback={IMAGES.hero.fallback}
                alt="Freight and logistics"
                className="h-full min-h-[280px] w-full object-cover will-change-transform lg:min-h-0"
                width="1400"
                height="933"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/35 to-transparent lg:from-navy/75 lg:via-transparent" />
            </div>
            <div className="absolute bottom-8 left-6 z-[3] max-w-[220px] rounded-lg border border-accent/35 bg-navy/90 p-4 backdrop-blur-sm">
              <strong className="font-display text-xl font-extrabold text-white">Winnipeg, MB</strong>
              <span className="mt-1 block text-[0.72rem] leading-snug text-white/55">
                North America lanes · Contract &amp; spot · Tracking &amp; updates
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-accent py-3">
        <div className="animate-ticker inline-flex whitespace-nowrap font-display text-[0.82rem] font-bold uppercase tracking-[0.15em] text-navy">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={`${t}-${i}`} className="px-7 before:content-['◆_']">
              {t}
            </span>
          ))}
        </div>
      </div>

      <section id="about" className="grid items-center gap-12 px-[5vw] py-24 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-xl shadow-xl shadow-blue/10">
            <SafeImg
              primary={IMAGES.aboutCorridor.primary}
              fallback={IMAGES.aboutCorridor.fallback}
              alt="Highway freight corridor"
              className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.03]"
              width="900"
              height="675"
            />
          </div>
          <div className="absolute -bottom-4 -right-2 rounded-lg bg-accent px-5 py-4 shadow-lg shadow-accent/30">
            <strong className="font-display text-3xl font-extrabold text-navy">24/7</strong>
            <small className="mt-1 block text-[0.68rem] font-bold uppercase tracking-wider text-navy">ops response</small>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">About Stargaze Freight</p>
          <h2 className="font-display text-[clamp(2rem,4vw,2.85rem)] font-extrabold leading-tight tracking-tight text-navy">
            Built on trust. Driven by results.
          </h2>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-slate-500">
            Stargaze Freight Inc. is a North America–focused freight brokerage based in Winnipeg. We connect shippers with
            vetted carriers for dry, temperature-controlled, and specialized freight — with attention to detail from booking
            through delivery.
          </p>
          <button
            type="button"
            className="mt-4 flex items-center gap-1 text-left text-sm font-bold text-blue-mid transition hover:text-accent"
            onClick={() => openModal('overview', 'Business overview')}
          >
            Read full overview →
          </button>
          <ul className="mt-8 space-y-3">
            {[
              'Cross-border Canada–USA coverage across regional and long-haul lanes',
              'Real-time tracking and proactive communication through the shipment lifecycle',
              'Reliable capacity for dry van, reefer, open-deck, power-only, and expedited moves',
            ].map((text) => (
              <li key={text} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue/10">
                  <svg className="w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="#0d3b8e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[0.92rem] text-slate-600">{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section
        id="services"
        className="relative overflow-hidden bg-gradient-to-b from-slate-200/90 via-slate-100 to-white px-[5vw] py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,59,142,0.08),transparent)]" />
        <Reveal className="relative mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">What we move</p>
          <h2 className="font-display text-[clamp(2rem,4vw,2.85rem)] font-extrabold tracking-tight text-navy">
            Freight solutions aligned to your lanes
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-slate-600">
            Equipment and service mix tailored to your lanes — click{' '}
            <em className="not-italic font-semibold text-navy">Read more</em> for detail.
          </p>
        </Reveal>
        <div className="relative grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((s) => (
            <Reveal
              key={s.key}
              delay={s.delay}
              className="group relative overflow-hidden rounded-xl border border-navy/10 bg-white p-5 shadow-md shadow-navy/5 ring-1 ring-navy/5 transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-blue/15 hover:ring-accent/20"
            >
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <SafeImg
                  primary={s.img}
                  fallback={s.img}
                  alt={`${s.title} service`}
                  className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  width="800"
                  height="450"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{s.desc}</p>
              <button
                type="button"
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-mid transition hover:gap-2 hover:text-accent"
                onClick={() => openModal(s.key, s.modalTitle)}
              >
                Read more →
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="industries" className="relative overflow-hidden bg-navy px-[5vw] py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]">
          <SafeImg
            primary={IMAGES.industriesBg.primary}
            fallback={IMAGES.industriesBg.fallback}
            alt=""
            role="presentation"
            className="h-full min-h-[400px] w-full scale-105 object-cover sm:min-h-0"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-navy/85" />
        <Reveal className="relative z-[2] mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent/90">Industries we serve</p>
          <h2 className="font-display text-[clamp(2rem,4vw,2.85rem)] font-extrabold tracking-tight text-white">
            Sectors 
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-white/55">
            Tap a card for the detailed scope we support in each vertical.
          </p>
        </Reveal>
        <div className="relative z-[2] grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INDUSTRIES.map((ind) => (
            <Reveal
              key={ind.key}
              delay={ind.delay ?? 0}
              className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-accent hover:bg-white/10"
            >
              <div
                role="button"
                tabIndex={0}
                className="outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => openModal(ind.key, ind.title)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(ind.key, ind.title);
                  }
                }}
              >
                <div className="text-2xl" aria-hidden="true">
                  {ind.emoji}
                </div>
                <div className="font-display mt-2 text-lg font-bold text-white">{ind.name}</div>
                <p className="mt-2 text-xs leading-relaxed text-white/45">{ind.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-8 bg-accent px-[5vw] py-14">
        <Reveal className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-navy/60">Corridors & border</p>
          <p className="mt-2 font-display text-[clamp(1.75rem,3vw,2.65rem)] font-black leading-tight text-navy">
            Canada ↔ USA — regional & long-haul
          </p>
        </Reveal>
        <Reveal delay={80} className="flex flex-wrap gap-3">
          {['Contract lanes', 'Spot coverage', 'Planning & tracking'].map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-lg bg-navy/10 px-4 py-2 text-sm font-bold text-navy">
              {t}
            </span>
          ))}
        </Reveal>
      </div>

      <section id="why" className="bg-blue px-[5vw] py-24 text-white">
        <Reveal className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent/90">Why shippers work with us</p>
          <h2 className="font-display text-[clamp(2rem,4vw,2.85rem)] font-extrabold tracking-tight">Your freight, our responsibility</h2>
        </Reveal>
        <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { n: '01', icon: '📡', title: 'Tracking & updates', text: 'Visibility and proactive communication through the shipment lifecycle.', delay: 0 },
            { n: '02', icon: '🔍', title: 'Vetted carriers', text: 'We partner with a reliable network aligned to your requirements.', delay: 60 },
            { n: '03', icon: '🔄', title: 'Contract & spot', text: 'Consistent lanes or one-off coverage — structured planning either way.', delay: 120 },
            { n: '04', icon: '🤝', title: 'Responsive team', text: 'Straight answers and fast follow-up when the load is on the line.', delay: 40 },
            { n: '05', icon: '⚙️', title: 'Tailored to your operation', text: 'Dry, temperature-controlled, and specialized solutions matched to how you ship.', delay: 100, wide: true },
          ].map((w) => (
            <Reveal
              key={w.n}
              delay={w.delay}
              className={`bg-white/5 p-9 transition hover:bg-white/10 ${w.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className="font-display text-5xl font-black text-white/10">{w.n}</div>
              <div className="mt-2 text-2xl" aria-hidden="true">
                {w.icon}
              </div>
              <h3 className="font-display mt-3 text-lg font-bold">{w.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">{w.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-navy px-[5vw] py-24">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-black leading-tight tracking-tight text-white">
                Let’s move
                <br />
                <span className="text-accent">forward, together.</span>
              </h2>
            </Reveal>
            <Reveal delay={60} className="mt-5 max-w-lg text-sm leading-relaxed text-white/50">
              Share your lanes or request a quote — we’ll respond with next steps.
            </Reveal>
            <Reveal delay={100} className="mt-10 space-y-6">
              {[
                ['📞', 'Phone', <a key="p" href="tel:+12045001481" className="mt-0.5 block font-medium text-white hover:text-accent">+1 204-500-1481</a>],
                [
                  '✉️',
                  'Email',
                  <a key="e" href="mailto:ops@stargazefreight.com" className="mt-0.5 block font-medium text-white hover:text-accent">
                    ops@stargazefreight.com
                  </a>,
                ],
                ['📍', 'Address', <span key="a" className="mt-0.5 block font-medium text-white">95 Innsbruck Way, Winnipeg, MB R2P 1L8</span>],
              ].map(([icon, label, node]) => (
                <div key={label} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-lg">
                    {icon}
                  </div>
                  <div>
                    <strong className="text-[0.72rem] font-bold uppercase tracking-wider text-white/35">{label}</strong>
                    {node}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal delay={80}>
            <form
              className="rounded-xl border border-white/10 bg-white/5 p-8"
              onSubmit={submitQuote}
              noValidate
            >
              <h3 className="font-display text-xl font-extrabold text-white">Request a quote</h3>
              <p className="mt-2 text-xs text-white/45">
                Opens your email app with this message addressed to ops@stargazefreight.com (add an email or phone so we can reply).
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qf-name" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                    Name
                  </label>
                  <input
                    id="qf-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-md border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="qf-company" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                    Company
                  </label>
                  <input
                    id="qf-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Company"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full rounded-md border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="qf-email" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                  Email
                </label>
                <input
                  id="qf-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-md border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="qf-phone" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                  Phone
                </label>
                <input
                  id="qf-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-md border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qf-service" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                    Service
                  </label>
                  <select
                    id="qf-service"
                    value={quoteForm.service}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, service: e.target.value }))}
                    className="w-full rounded-md border border-white/10 bg-navy px-3.5 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                  >
                    <option value="">Select…</option>
                    <option>Dry van</option>
                    <option>Reefer</option>
                    <option>Flatbed / step deck</option>
                    <option>Power-only</option>
                    <option>FTL</option>
                    <option>LTL / Partial</option>
                    <option>Expedited</option>
                    <option>Cross-border</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="qf-frequency" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                    Frequency
                  </label>
                  <select
                    id="qf-frequency"
                    value={quoteForm.frequency}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, frequency: e.target.value }))}
                    className="w-full rounded-md border border-white/10 bg-navy px-3.5 py-2.5 text-sm text-white focus:border-accent focus:outline-none"
                  >
                    <option value="">Select…</option>
                    <option>Spot</option>
                    <option>Weekly</option>
                    <option>Contract lane</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="qf-lane" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                  Origin → destination
                </label>
                <input
                  id="qf-lane"
                  type="text"
                  placeholder="e.g. Winnipeg, MB → Dallas, TX"
                  value={quoteForm.lane}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, lane: e.target.value }))}
                  className="w-full rounded-md border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="qf-notes" className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wider text-white/40">
                  Notes
                </label>
                <textarea
                  id="qf-notes"
                  rows={3}
                  placeholder="Commodity, weight, timing…"
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full resize-y rounded-md border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-accent focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={quoteSent}
                className={`mt-6 w-full rounded-md py-3.5 font-display text-base font-extrabold uppercase tracking-wider transition ${
                  quoteSent ? 'cursor-default bg-emerald-600 text-white' : 'bg-accent text-navy hover:bg-accent-light'
                }`}
              >
                {quoteSent ? '✓ Check your email app to send' : 'Send request →'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="flex min-w-0 flex-wrap items-center justify-between gap-4 border-t border-white/5 bg-[#060d1a] px-[5vw] py-7">
        <p className="min-w-0 text-[0.78rem] text-white/30">© 2026 Stargaze Freight Inc. · Winnipeg, MB</p>
        <div className="flex min-w-0 flex-wrap gap-6 text-[0.78rem]">
          <a href="mailto:ops@stargazefreight.com" className="text-white/30 transition hover:text-accent">
            ops@stargazefreight.com
          </a>
          <a href="tel:+12045001481" className="text-white/30 transition hover:text-accent">
            204-500-1481
          </a>
        </div>
      </footer>

      <DetailDialog
        open={!!dialog}
        title={dialog?.title ?? ''}
        html={dialog ? MODAL_HTML[dialog.htmlKey] ?? '' : ''}
        onClose={closeModal}
      />
    </div>
  );
}
