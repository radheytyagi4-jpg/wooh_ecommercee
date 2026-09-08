import Link from "next/link";

const deals = [
  {
    title: "Daily essentials",
    subtitle: "Save up to 25%",
    description: "Atta, rice, dal & more",
    emoji: "🌾",
    className: "bg-[#DDE8D9]",
  },
  {
    title: "Snack attack",
    subtitle: "Starting ₹49",
    description: "Chips, biscuits & instant food",
    emoji: "🍿",
    className: "bg-[#F0DDC7]",
  },
  {
    title: "Beverage break",
    subtitle: "Flat 15% OFF",
    description: "Coffee, drinks & refreshments",
    emoji: "☕",
    className: "bg-[#E4D8CD]",
  },
];

export default function Deals() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#FFA726]">
          Don't miss out
        </p>

        <h2 className="text-3xl font-black tracking-tight text-[#102820] sm:text-4xl">
          Today's deals
        </h2>
      </div>

      {/* DEAL CARDS */}
      <div className="grid gap-4 md:grid-cols-3">

        {deals.map((deal) => (
          <Link
            href="/products"
            key={deal.title}
            className={`${deal.className} group relative min-h-[250px] overflow-hidden rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >

            {/* TEXT */}
            <div className="relative z-10 max-w-[65%]">

              <p className="text-xs font-black uppercase tracking-widest text-[#102820]/50">
                Limited deal
              </p>

              <h3 className="mt-3 text-2xl font-black text-[#102820]">
                {deal.title}
              </h3>

              <p className="mt-2 text-xl font-black text-[#102820]">
                {deal.subtitle}
              </p>

              <p className="mt-2 text-sm text-[#102820]/60">
                {deal.description}
              </p>

              <span className="mt-6 inline-block rounded-full bg-[#102820] px-5 py-2.5 text-xs font-bold text-[#F8F2E7]">
                Shop now →
              </span>

            </div>

            {/* EMOJI */}
            <div className="absolute -bottom-4 -right-4 text-[130px] transition duration-500 group-hover:scale-110 group-hover:rotate-6">
              {deal.emoji}
            </div>

          </Link>
        ))}

      </div>

      {/* BIG OFFER */}
      <div className="relative mt-5 overflow-hidden rounded-[2rem] bg-[#102820] px-7 py-10 sm:px-12">

        <div className="relative z-10 max-w-xl">

          <span className="rounded-full bg-[#FFA726] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#102820]">
            Wooh special
          </span>

          <h3 className="mt-5 text-3xl font-black tracking-tight text-[#F8F2E7] sm:text-4xl">
            Good groceries.
            <br />
            <span className="text-[#FFA726]">
              Better prices.
            </span>
          </h3>

          <p className="mt-4 text-sm leading-6 text-[#F8F2E7]/60">
            Discover everyday essentials at prices that make
            shopping feel a little better.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-[#F8F2E7] px-6 py-3 text-sm font-black text-[#102820] transition hover:bg-white"
          >
            Explore deals →
          </Link>

        </div>

        {/* DECORATION */}
        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-[#FFA726]/20" />

        <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full border-[25px] border-[#F8F2E7]/10" />

      </div>
    </section>
  );
}