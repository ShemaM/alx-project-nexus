const partners = [
  'UNHCR Kenya',
  'IRC Kenya',
  'Norwegian Refugee Council',
  'Mastercard Foundation',
  'Refugee Consortium of Kenya',
  'Aga Khan Foundation',
  'JRS Kenya',
  'Caritas Kenya',
  'Don Bosco Youth Center',
  'iHub Nairobi',
  'Kenya Red Cross',
  'Amani Institute',
  'KADET Kenya',
  'UN Women Kenya',
  'KCDF',
  'HIAS Kenya',
  'Lutheran World Federation',
  'Department of Refugee Services',
]

const allPartners = [...partners, ...partners]

export function PartnersMarquee() {
  return (
    <section className="overflow-hidden bg-[#060e26] py-10">
      <div className="mx-auto mb-6 max-w-7xl px-4 text-center sm:px-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
          Trusted by
        </p>
        <h2 className="font-syne text-xl font-extrabold text-white">
          Refugee-serving organisations we prioritise
        </h2>
      </div>

      <div className="relative" aria-hidden="true">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#060e26] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#060e26] to-transparent" />

        <div className="marquee-track flex gap-3 whitespace-nowrap">
          {allPartners.map((name, idx) => (
            <span
              key={idx}
              className="inline-flex shrink-0 items-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white/55"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersMarquee
