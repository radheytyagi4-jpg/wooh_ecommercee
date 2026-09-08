import Header from "./component/common/Header/page";
import Footer from "./component/common/Footer/page";
import Hero from "./component/home-components/Hero/page";
import Categories from "./component/home-components/Categories/page";
import FeaturedProducts from "./component/home-components/FeaturedProducts/page";
import Deals from "./component/home-components/Deals/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F2E7]">
      <Header />

      <Hero />

      <Categories />

      <FeaturedProducts />

      <Deals />

      <Footer />
    </main>
  );
}