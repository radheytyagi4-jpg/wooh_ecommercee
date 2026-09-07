import { Fraunces, Karla } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"] });
const karla = Karla({ subsets: ["latin"], weight: ["400", "500"] });

const values = [
  { title: "Fair fees", text: "We only take a cut when you make a sale." },
  { title: "Direct from sellers", text: "No warehouse in between — just the person who made it." },
  { title: "Real reviews", text: "Only verified buyers can leave a review." },
];

export default function AboutUs() {
  return (
    <main className={`${karla.className} bg-[#F7F1E4] text-[#2B2620] px-6 py-20 pt-28`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`${fraunces.className} text-5xl text-[#1E3B2C] leading-tight`}>
          Anyone can shop here.
        </h1>

        <p className="mt-6 text-lg text-[#3A362E]">
          Wooh is a marketplace built for the people — Easy way to introduce your product
          to the world. We believe that everyone should have the opportunity to sell what they love, and we want to make it as easy as possible for them to do so. Whether you're a small business owner, a hobbyist, or just someone with a great idea, we want to help you get your product in front of the people who will love it. Our platform is designed to be simple and intuitive, so you can focus on what matters most: creating amazing products and connecting with the people who appreciate them. We believe that everyone has something valuable to offer, and we're here to help you share it with the world.
        </p>

        <div className="mt-8 flex gap-4">
          <a href="/" className="bg-[#1E3B2C] text-[#F7F1E4] px-6 py-3 text-sm font-medium">
            Start buying
          </a>
          <a href="/sell" className="border border-[#1E3B2C] text-[#1E3B2C] px-6 py-3 text-sm font-medium">
            Open your shop
          </a>
        </div>

        <div className="mt-16 divide-y divide-[#D9CFB8]">
          {values.map((v) => (
            <div key={v.title} className="py-5">
              <h3 className="font-semibold text-[#1E3B2C]">{v.title}</h3>
              <p className="text-[#3A362E] mt-1">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}