"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GotaLogo, COMPANY_EMAIL, COMPANY_PHONE } from "@/components/GotaLogo";
import { t as tr, type Lang } from "@/lib/i18n";

const SAMPLE = {
  tripTitle: {
    EN: "Benin Discovery Tour for 7 People 🇧🇯",
    FR: "Circuit Découverte Bénin pour 7 Personnes 🇧🇯",
  },
  duration: { EN: "6 Days / 5 Nights", FR: "6 Jours / 5 Nuits" },
  route: {
    EN: "Lagos Mainland → Cotonou → Ouidah → Ganvié → Porto-Novo → Lagos Mainland",
    FR: "Lagos Mainland → Cotonou → Ouidah → Ganvié → Porto-Novo → Lagos Mainland",
  },
  period: { EN: "First Week of December", FR: "Première semaine de décembre" },
  accommodation: { EN: "Single rooms for all 7 guests", FR: "Chambres individuelles pour les 7 voyageurs" },
  pax: 7,
  pricingBasis: "perPerson" as "perPerson" | "perGroup",
  currency: "NGN",
  options: [
    {
      code: "A",
      name: { EN: "Casa del Papa — Lagoon Side", FR: "Casa del Papa — Côté Lagune" },
      priceNGN: 1500000,
      sub: { EN: "3 nights Azalaï + 2 nights Casa del Papa (single, lagoon view)", FR: "3 nuits Azalaï + 2 nuits Casa del Papa (single, vue lagune)" },
    },
    {
      code: "B",
      name: { EN: "Casa del Papa — Sea View Side", FR: "Casa del Papa — Côté Vue Mer" },
      priceNGN: 1570000,
      sub: { EN: "3 nights Azalaï + 2 nights Casa del Papa (single, sea view)", FR: "3 nuits Azalaï + 2 nuits Casa del Papa (single, vue mer)" },
    },
  ],
  days: [
    {
      title: { EN: "Lagos Mainland to Cotonou", FR: "Lagos Mainland → Cotonou" },
      items: [
        { EN: "Pick-up from Lagos Mainland.", FR: "Prise en charge à Lagos Mainland." },
        { EN: "Road transfer to Benin Republic.", FR: "Transfert routier vers la République du Bénin." },
        { EN: "Border protocol and assistance.", FR: "Protocole frontalier et assistance." },
        { EN: "Transfer to Cotonou and check-in at Azalaï Hotel.", FR: "Transfert à Cotonou et installation à l’Hôtel Azalaï." },
        { EN: "Free time to relax.", FR: "Temps libre pour se détendre." },
      ],
    },
    {
      title: { EN: "Ouidah Historical Tour & Cotonou City Tour", FR: "Tour Historique de Ouidah & Tour de Cotonou" },
      section: { EN: "Cotonou City Tour", FR: "Tour de Cotonou" },
      items: [
        { EN: "Visit the Amazon Statue.", FR: "Visite de la Statue de l’Amazone." },
        { EN: "Discover the Longest Mural Wall.", FR: "Découverte du plus long mur mural." },
        { EN: "Visit Erevan Shopping Centre.", FR: "Visite du centre commercial Erevan." },
        { EN: "Explore local markets.", FR: "Exploration des marchés locaux." },
        { EN: "Visit the Bio Guerra Monument.", FR: "Visite du Monument Bio Guerra." },
        { EN: "Temple of Pythons, Sacred Forest, Slave Route, Door of No Return, Fondation Zinsou.", FR: "Temple des Pythons, Forêt Sacrée, Route des Esclaves, Porte du Non-Retour, Fondation Zinsou." },
        { EN: "Return to Azalaï Hotel.", FR: "Retour à l’Hôtel Azalaï." },
      ],
    },
    {
      title: { EN: "Ganvié Boat Excursion & Beach Experience", FR: "Excursion en Bateau à Ganvié & Plage" },
      items: [
        { EN: "Breakfast at the hotel.", FR: "Petit-déjeuner à l’hôtel." },
        { EN: "Boat excursion to Ganvié, the famous stilt village on Lake Nokoué.", FR: "Excursion en bateau à Ganvié, célèbre village sur pilotis du lac Nokoué." },
        { EN: "Discover the local community and its unique way of life.", FR: "Découverte de la communauté locale et de son mode de vie unique." },
        { EN: "Lunch included during the excursion.", FR: "Déjeuner inclus pendant l’excursion." },
        { EN: "Beach experience and relaxation.", FR: "Expérience plage et détente." },
        { EN: "Return to Azalaï Hotel.", FR: "Retour à l’Hôtel Azalaï." },
      ],
    },
    {
      title: { EN: "Free & Relaxation Day", FR: "Journée Libre & Détente" },
      items: [
        { EN: "Breakfast at the hotel and check-out from Azalaï Hotel.", FR: "Petit-déjeuner à l’hôtel et check-out de l’Azalaï." },
        { EN: "Free time for relaxation, shopping or personal activities.", FR: "Temps libre pour détente, shopping ou activités personnelles." },
        { EN: "Enjoy the hotel facilities at your leisure.", FR: "Profitez des infrastructures hôtelières à votre guise." },
        { EN: "Transfer to Casa del Papa and check-in.", FR: "Transfert à Casa del Papa et installation." },
      ],
    },
    {
      title: { EN: "Porto-Novo Cultural Tour", FR: "Tour Culturel de Porto-Novo" },
      items: [
        { EN: "Breakfast.", FR: "Petit-déjeuner." },
        { EN: "Visit Musée Honmé.", FR: "Visite du Musée Honmé." },
        { EN: "Explore the Royal Palace.", FR: "Exploration du Palais Royal." },
        { EN: "Discover Porto-Novo city and its cultural landmarks.", FR: "Découverte de Porto-Novo et de ses sites culturels." },
        { EN: "Visit Songhaï Centre.", FR: "Visite du Centre Songhaï." },
        { EN: "Overnight stay at Casa del Papa.", FR: "Nuitée à Casa del Papa." },
      ],
    },
    {
      title: { EN: "Return to Lagos Mainland", FR: "Retour à Lagos Mainland" },
      items: [
        { EN: "Breakfast and hotel check-out.", FR: "Petit-déjeuner et check-out." },
        { EN: "Return transfer to Lagos Mainland.", FR: "Transfert retour vers Lagos Mainland." },
        { EN: "Border protocol and assistance.", FR: "Protocole frontalier et assistance." },
        { EN: "Drop-off at Lagos Mainland.", FR: "Dépose à Lagos Mainland." },
      ],
    },
  ],
  includes: {
    EN: [
      "Return transportation between Lagos Mainland and Cotonou.",
      "Border protocol and assistance at both crossings.",
      "Five nights of hotel accommodation in single rooms (3 nights Azalaï + 2 nights Casa del Papa).",
      "Cotonou city tour.",
      "Ouidah historical tour.",
      "Ganvié boat excursion with lunch.",
      "Porto-Novo cultural tour.",
      "Tour guide.",
      "Breakfast at hotels.",
      "Listed transfers and activities.",
    ],
    FR: [
      "Transport aller-retour Lagos Mainland – Cotonou.",
      "Assistance protocolaire aux deux passages de frontière.",
      "Cinq nuits d’hébergement en chambres individuelles (3 nuits Azalaï + 2 nuits Casa del Papa).",
      "Tour de ville de Cotonou.",
      "Tour historique de Ouidah.",
      "Excursion en bateau à Ganvié avec déjeuner.",
      "Tour culturel de Porto-Novo.",
      "Guide touristique.",
      "Petits-déjeuners à l’hôtel.",
      "Transferts et activités mentionnés.",
    ],
  },
  terms: {
    EN: [
      "Prices are quoted in Naira (₦) and also available in FCFA using today’s exchange calculation.",
      "Prices are subject to hotel availability and exchange-rate changes at the time of booking.",
      "Hotel Reservation: A 50% deposit of the total accommodation cost must be paid upfront to secure and reserve the hotel rooms. The remaining balance must be paid according to the agreed payment schedule.",
      "Hotel rooms are subject to availability until the deposit is received and the reservation is confirmed.",
      "Extra activities, personal expenses and services not listed in the package are charged separately.",
      "All travellers must have valid travel documents (passport, ECOWAS card or visa as applicable).",
      "Reservations are subject to confirmation.",
    ],
    FR: [
      "Les prix sont exprimés en Naira (₦) et également disponibles en FCFA sur la base du taux du jour.",
      "Les prix sont soumis à la disponibilité hôtelière et aux fluctuations de change au moment de la réservation.",
      "Réservation hôtelière : un acompte de 50% du coût total de l’hébergement est requis pour garantir les chambres. Le solde est payable selon l’échéancier convenu.",
      "Les chambres sont soumises à disponibilité jusqu’à réception de l’acompte et confirmation de la réservation.",
      "Activités supplémentaires, dépenses personnelles et services non listés en sus.",
      "Tous les voyageurs doivent être munis de documents de voyage valides (p passeport, carte CEDEAO ou visa selon le cas).",
      "Réservations sous réserve de confirmation.",
    ],
  },
  payment: {
    EN: [
      "50% deposit to secure the booking.",
      "Balance payable 7 days before departure.",
      "Bank transfer / mobile money accepted.",
      "Quotation valid for 7 days from date of issue.",
    ],
    FR: [
      "Acompte de 50% pour confirmer la réservation.",
      "Solde payable 7 jours avant le départ.",
      "Virement bancaire / mobile money acceptés.",
      "Devis valable 7 jours à compter de la date d’émission.",
    ],
  },
};

const formatNGN = (n: number) => "₦" + new Intl.NumberFormat("en-NG").format(n);

export default function ProposalIndex() {
  const [lang, setLang] = useState<Lang>("EN");
  const [trips, setTrips] = useState<any[]>([]);
  const [selected, setSelected] = useState<number>(-2);
  const [data, setData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState(0);

  useEffect(() => { fetch("/api/trips").then(r => r.json()).then(setTrips); }, []);
  useEffect(() => {
    if (trips.length > 0 && trips[selected]) {
      fetch(`/api/trips/${trips[selected].id}`).then(r => r.json()).then(setData);
    }
  }, [selected, trips]);

  const sample = SAMPLE;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 lg:px-8">
      <div className="flex flex-wrap justify-between items-center mb-6 print:hidden gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0a0a0a]">Client Proposal Generator</h1>
          <p className="text-sm text-[#6b6b6b]">Premium black & gold/orange PDF combining itinerary + final prices (per person/group) + terms</p>
        </div>
        <div className="flex gap-2 items-center">
          <select value={lang} onChange={e => setLang(e.target.value as Lang)} className="input w-28">
            <option value="EN">English</option>
            <option value="FR">Français</option>
          </select>
          <button onClick={() => window.print()} className="bg-[#EE8A1D] text-black px-5 py-2.5 rounded-full font-semibold text-sm">⎙ Print / Save PDF</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 print:hidden">
        <button onClick={() => { setSelected(-2); setSelectedOption(0); }} className={`px-4 py-2 rounded-full text-xs font-semibold ${selected === -2 ? "bg-[#0a0a0a] text-white" : "bg-white border"}`}>★ Benin Discovery 6D/5N (Sample)</button>
        {trips.map((t, i) => (
          <button key={t.id} onClick={() => setSelected(i)} className={`px-4 py-2 rounded-full text-xs font-semibold ${selected === i ? "bg-[#0a0a0a] text-white" : "bg-white border"}`}>#{t.id} {t.title.slice(0, 20)}</button>
        ))}
      </div>

      {selected === -2 && <ProposalDocument data={sample as any} lang={lang} selectedOption={selectedOption} onSelectOption={setSelectedOption} />}

      {selected >= 0 && data && <LiveProposal data={data} lang={lang} />}
      {!data && selected >= 0 && <div className="card p-8 text-sm text-[#9a9a9a]">Loading trip data…</div>}

      <div className="mt-6 text-center text-[10px] text-[#9a9a9a] print:hidden">
        Use <b>Print → Save as PDF</b> for a genuine client PDF. WhatsApp/email can be sent from the WhatsApp Generator or Documents page.
      </div>
    </div>
  );
}

function ProposalDocument({ data, lang, selectedOption, onSelectOption }: { data: typeof SAMPLE; lang: Lang; selectedOption: number; onSelectOption: (option: number) => void }) {
  const basis = data.pricingBasis;
  const activeOption = data.options[selectedOption] || data.options[0];
  const optionLabel = `Option ${activeOption.code}`;
  const totalGroup = activeOption.priceNGN * data.pax;
  const selectText = lang === "FR" ? "Sélectionner cette option" : "Select this option";
  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border" id="client-pdf">
      {/* Cover */}
      <div className="bg-[#0a0a0a] text-white px-10 lg:px-16 py-12 relative overflow-hidden print:break-after-page">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, #EE8A1D 0%, transparent 60%)" }}></div>
        <div className="relative flex items-start justify-between">
          <div className="w-28 h-24"><GotaLogo size={120} /></div>
          <div className="text-right">
            <div className="text-[10px] tracking-[0.3em] text-[#EE8A1D] font-semibold">GOTA VOYAGES</div>
            <div className="text-[10px] text-white/60 mt-1">{tr(lang, "proposal")}</div>
            <div className="text-[10px] text-white/60">Ref: GOTA-{new Date().getFullYear()}-BD6D</div>
          </div>
        </div>
        <div className="relative mt-16">
          <div className="text-[10px] tracking-[0.3em] text-[#EE8A1D] font-semibold">BENIN DISCOVERY</div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight mt-3">{data.tripTitle[lang]}</h1>
          <div className="h-1 w-20 bg-[#EE8A1D] mt-5 rounded-full"></div>
          <div className="mt-8 grid md:grid-cols-2 gap-x-12 gap-y-3 text-sm">
            <Field l={tr(lang, "duration")} v={data.duration[lang]} />
            <Field l={tr(lang, "route")} v={data.route[lang]} />
            <Field l={tr(lang, "period")} v={data.period[lang]} />
            <Field l={tr(lang, "accommodation")} v={data.accommodation[lang]} />
            <Field l={tr(lang, "totalPax")} v={`${data.pax} ${tr(lang, "pax")}`} />
            <Field l={tr(lang, "preparedFor")} v="7 Guests — Single rooms" />
          </div>
        </div>
        <div className="relative mt-16 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-4 text-[11px] text-white/60">
          <div>
            <div className="text-[#EE8A1D] font-semibold">{tr(lang, "company")}</div>
            <div>{tr(lang, "tagline")}</div>
          </div>
          <div className="text-right">
            <div>{COMPANY_EMAIL}</div>
            <div>{COMPANY_PHONE}</div>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="px-10 lg:px-16 py-12">
        <h2 className="font-serif text-2xl font-bold text-[#0a0a0a]">{tr(lang, "itinerary")}</h2>
        <div className="h-[2px] w-12 bg-[#EE8A1D] mt-2"></div>
        <div className="mt-8 space-y-8">
          {data.days.map((d, i) => (
            <div key={i} className="relative pl-10 page-break-avoid">
              <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-[#0a0a0a] text-[#EE8A1D] font-serif font-bold flex items-center justify-center text-sm">{i+1}</div>
              <div className="absolute left-[13px] top-7 bottom-0 w-px bg-black/10"></div>
              <h3 className="font-serif text-lg font-bold">{tr(lang, "day")} {i+1}: {d.title[lang]}</h3>
              {d.section && <div className="mt-1 text-[11px] tracking-widest uppercase text-[#EE8A1D] font-semibold">{d.section[lang]}</div>}
              <ul className="mt-3 space-y-1.5 text-sm text-[#222]">
                {d.items.map((it, k) => (
                  <li key={k} className="flex gap-2"><span className="text-[#EE8A1D] mt-0.5">◆</span><span>{it[lang]}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Package Options */}
      <div className="bg-[#0a0a0a] text-white px-10 lg:px-16 py-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-[#EE8A1D] font-semibold">{tr(lang, "packageOptions").toUpperCase()}</div>
            <h2 className="font-serif text-2xl font-bold mt-2">
              {basis === "perPerson"
                ? (lang === "FR" ? "Prix finaux par personne" : "Final prices per person")
                : (lang === "FR" ? "Prix final du groupe" : "Final group price")}
            </h2>
          </div>
          <div className="text-right text-[11px] text-white/60 max-w-[240px]">
            {lang === "FR" ? "Hébergement : 3 nuits Azalaï + 2 nuits Casa del Papa en chambres individuelles." : "Accommodation: 3 nights Azalaï + 2 nights Casa del Papa, single rooms."}
          </div>
        </div>
        <div className="h-[2px] w-12 bg-[#EE8A1D] mt-3"></div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {data.options.map((o, i) => {
            const isActive = selectedOption === i;
            return (
              <div key={i} className={`rounded-2xl border p-8 relative transition ${isActive ? "border-[#EE8A1D] bg-[#EE8A1D]/15 ring-1 ring-[#EE8A1D]" : "border-[#EE8A1D]/30 bg-white/5"}`}>
                <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full ${isActive ? "bg-[#EE8A1D] text-black" : "bg-white/10 text-white"}`}>{tr(lang, "option")} {o.code}</div>
                {isActive && <div className="absolute top-4 left-4 text-[9px] tracking-widest uppercase text-[#EE8A1D] font-bold">✓ {lang === "FR" ? "Sélectionné" : "Selected"}</div>}
                <div className={`text-xs tracking-widest font-semibold ${isActive ? "text-[#EE8A1D] mt-5" : "text-[#EE8A1D]"}`}>CASA DEL PAPA</div>
                <h3 className="font-serif text-xl font-bold mt-1">{o.name[lang]}</h3>
                <p className="text-xs text-white/60 mt-2">{o.sub[lang]}</p>
                <div className="mt-6">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest">{tr(lang, "finalPrice")}</div>
                  <div className="font-serif text-4xl font-bold text-[#EE8A1D] mt-1">{formatNGN(o.priceNGN)}</div>
                  <div className="text-xs text-white/60 mt-1">{tr(lang, basis === "perPerson" ? "perPerson" : "perGroup")} • {tr(lang, "accommodation")}</div>
                  <div className="text-xs text-white/50 mt-1">{lang === "FR" ? `Total groupe 7 personnes : ${formatNGN(o.priceNGN * data.pax)}` : `Group total for ${data.pax} guests: ${formatNGN(o.priceNGN * data.pax)}`}</div>
                </div>
                <button onClick={() => onSelectOption(i)} className={`print:hidden mt-6 w-full py-3 rounded-full text-sm font-bold transition ${isActive ? "bg-[#EE8A1D] text-black" : "bg-white text-black hover:bg-[#EE8A1D]"}`}>
                  {isActive ? (lang === "FR" ? "✓ Option sélectionnée" : "✓ Selected for final quote") : `${selectText} — ${tr(lang, "option")} ${o.code}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-7 border border-[#EE8A1D]/50 bg-black/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] text-[#EE8A1D] tracking-[0.2em] font-bold uppercase">{lang === "FR" ? "Option finale sélectionnée" : "Selected Final Package"}</div>
            <div className="font-serif text-xl font-bold mt-1">{optionLabel} — {activeOption.name[lang]}</div>
            <div className="text-xs text-white/60 mt-1">{activeOption.sub[lang]}</div>
          </div>
          <div className="md:text-right">
            <div className="font-serif text-3xl font-bold text-[#EE8A1D]">{formatNGN(activeOption.priceNGN)}</div>
            <div className="text-[11px] text-white/60">{tr(lang, "perPerson")} · {formatNGN(totalGroup)} {lang === "FR" ? "pour 7 personnes" : "for 7 guests"}</div>
          </div>
        </div>
      </div>

      {/* Includes & Terms */}
      <div className="px-10 lg:px-16 py-12 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-serif text-xl font-bold">{tr(lang, "includes")}</h3>
          <div className="h-[2px] w-10 bg-[#EE8A1D] mt-2"></div>
          <ul className="mt-5 space-y-2 text-sm">
            {data.includes[lang].map((x, i) => (
              <li key={i} className="flex gap-2"><span className="text-[#EE8A1D] mt-0.5">✓</span><span>{x}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold">{tr(lang, "excludes")}</h3>
          <div className="h-[2px] w-10 bg-[#EE8A1D] mt-2"></div>
          <ul className="mt-5 space-y-2 text-sm text-[#555]">
            <li className="flex gap-2"><span className="text-[#999] mt-0.5">–</span><span>{lang === "FR" ? "Repas non expressément inclus" : "Meals not expressly included"}</span></li>
            <li className="flex gap-2"><span className="text-[#999] mt-0.5">–</span><span>{lang === "FR" ? "Dépenses personnelles et shopping" : "Personal expenses and shopping"}</span></li>
            <li className="flex gap-2"><span className="text-[#999] mt-0.5">–</span><span>{lang === "FR" ? "Activités optionnelles non listées" : "Optional activities not listed"}</span></li>
            <li className="flex gap-2"><span className="text-[#999] mt-0.5">–</span><span>{lang === "FR" ? "Assurance voyage et pourboires" : "Travel insurance & gratuities"}</span></li>
          </ul>
        </div>
      </div>

      {/* Payment Schedule + Terms */}
      <div className="bg-[#f8f5ee] px-10 lg:px-16 py-12">
        <h3 className="font-serif text-xl font-bold">{tr(lang, "paymentSchedule")}</h3>
        <div className="h-[2px] w-10 bg-[#EE8A1D] mt-2"></div>
        <ul className="mt-5 space-y-2 text-sm">
          {data.payment[lang].map((x, i) => <li key={i} className="flex gap-2"><span className="text-[#EE8A1D]">▸</span>{x}</li>)}
        </ul>
      </div>

      <div className="px-10 lg:px-16 py-12">
        <h3 className="font-serif text-xl font-bold">{tr(lang, "terms")}</h3>
        <div className="h-[2px] w-10 bg-[#EE8A1D] mt-2"></div>
        <ul className="mt-5 space-y-2 text-sm">
          {data.terms[lang].map((x, i) => <li key={i} className="flex gap-2"><span className="text-[#EE8A1D]">{i+1}.</span><span>{x}</span></li>)}
        </ul>
      </div>

      {/* Footer */}
      <div className="bg-[#0a0a0a] text-white px-10 lg:px-16 py-10 text-center relative">
        <div className="mx-auto w-16 h-12"><GotaLogo size={64} /></div>
        <div className="mt-3 font-serif text-lg font-bold">GOTA Voyages — GOTA International Group</div>
        <div className="text-[10px] tracking-[0.3em] text-[#EE8A1D] mt-1 font-semibold">{tr(lang, "tagline").toUpperCase()}</div>
        <p className="text-sm text-white/70 mt-4 italic">"{tr(lang, "signature")}"</p>
        <div className="mt-5 flex flex-wrap justify-center gap-6 text-[11px] text-white/60">
          <span>✉ {COMPANY_EMAIL}</span>
          <span>☎ {COMPANY_PHONE}</span>
        <span>🌍 GOTA VOYAGES — TRAVEL & TOURISM</span>
        </div>
        <div className="mt-6 text-[10px] text-white/40">Generated {new Date().toLocaleDateString(lang === "FR" ? "fr-FR" : "en-GB")} • Prices valid 7 days • Subject to availability</div>
      </div>
    </div>
  );
}

function Field({ l, v }: { l: string; v: string }) {
  return (
    <div>
      <div className="text-[9px] tracking-[0.2em] text-[#EE8A1D] uppercase font-semibold">{l}</div>
      <div className="text-sm mt-0.5">{v}</div>
    </div>
  );
}

function LiveProposal({ data, lang }: { data: any; lang: Lang }) {
  const t = data.trip;
  const quotes = data.quotations || [];
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  useEffect(() => {
    setSelectedQuoteId(quotes[0]?.id ?? null);
  }, [t?.id]);
  if(!t) return <div className="card p-8">No trip selected.</div>;
  // A selected quotation drives final price, inclusions, conditions and PDF.
  const q = quotes.find((quote: any) => quote.id === selectedQuoteId) || quotes[0] || null;
  const adultPax = Number(t.adults || 0) + Number(t.children || 0);
  const nights = Number(t.nights || 0);
  const days = Number(t.duration_days || nights+1);
  const total = q ? Number(q.final_amount || q.total_selling_price || 0) : 0;
  const pp = adultPax > 0 ? total / adultPax : total;
  return (
    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border">
      <div className="bg-[#0a0a0a] text-white px-10 py-10 flex items-start justify-between">
        <div className="w-20 h-16"><GotaLogo size={80} /></div>
        <div className="text-right">
          <div className="text-[10px] tracking-widest text-[#EE8A1D] font-semibold">GOTA VOYAGES</div>
          <div className="text-xs text-white/60 mt-1">{t.title}</div>
          <div className="text-xs text-white/60">{t.client_name} • {adultPax} pax • {nights}N / {days}D</div>
        </div>
      </div>
      <div className="px-10 py-8">
        <h2 className="font-serif text-2xl font-bold">{tr(lang, "itinerary")}</h2>
        <div className="space-y-4 mt-4">
          {data.days.map((d: any) => (
            <div key={d.id}>
              <h3 className="font-semibold">Day {d.day_number}: {d.title}</h3>
              <p className="text-sm text-[#555]">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#0a0a0a] text-white px-10 py-8">
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <h2 className="font-serif text-2xl font-bold">{tr(lang, "finalPrice")}</h2>
            <div className="text-xs text-white/60 mt-1">{lang === "FR" ? "Choisissez l’option à inclure dans ce PDF final." : "Select the option to include in this final PDF."}</div>
          </div>
          {quotes.length > 0 && <div className="flex flex-wrap gap-2 print:hidden">
            {quotes.map((quote: any, index: number) => {
              const active = q?.id === quote.id;
              const code = quote.title?.match(/Option\s+([A-Z0-9]+)/i)?.[1] || String.fromCharCode(65 + index);
              return <button key={quote.id} onClick={() => setSelectedQuoteId(quote.id)} className={`px-3 py-2 rounded-full text-xs font-bold border transition ${active ? "bg-[#EE8A1D] border-[#EE8A1D] text-black" : "border-white/30 text-white hover:border-[#EE8A1D]"}`}>{active ? "✓ " : ""}{lang === "FR" ? "Option" : "Option"} {code}</button>;
            })}
          </div>}
        </div>
        {q && <div className="mt-4 text-[11px] text-[#EE8A1D] tracking-widest font-bold uppercase">{q.title}</div>}
        <div className="text-4xl font-bold text-[#EE8A1D] mt-2">{formatNGN(total)} <span className="text-sm text-white/60 font-normal">total • {formatNGN(Math.round(pp))} {tr(lang, "perPerson")}</span></div>
        <div className="text-xs text-white/50 mt-1">Currency: {q?.currency || t.currency} • Exchange snapshot: 1 FCFA = ₦{Number(t.exchange_rate).toFixed(2)}</div>
      </div>
      <div className="px-10 py-8 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold">{tr(lang, "includes")}</h3>
          <p className="text-sm mt-2 text-[#444]">{q?.inclusions || "Services as per selected itinerary."}</p>
        </div>
        <div>
          <h3 className="font-bold">{tr(lang, "terms")}</h3>
          <p className="text-sm mt-2 text-[#444]">{q?.conditions || "50% deposit to confirm. Balance 7 days before departure. Subject to availability."}</p>
        </div>
      </div>
      <div className="bg-[#0a0a0a] text-white text-center py-6 text-xs">
        <div className="font-serif text-lg font-bold">GOTA Voyages</div>
        <div className="text-[#EE8A1D] tracking-widest text-[10px] font-semibold mt-1">EXPERT THROUGH EXPERIENCE</div>
        <div className="mt-2 text-white/60">{COMPANY_EMAIL} • {COMPANY_PHONE}</div>
      </div>
    </div>
  );
}
