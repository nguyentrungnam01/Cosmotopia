import BasePages from '@/components/shared/base-pages.js';
import React, { FC } from 'react';
import HeroSection from './HeroSection';
// import Footer from '@/components/shared/footer';
// import Banner from '@/components/shared/banner';
// import BannerImage from '@/assets/banner/hero.png';
// import ProductCategories from '@/components/shared/category';
import { ProductListing } from '@/components/shared/product-listing';
import MakeupTones from '@/components/shared/style';
import AffiliateBanner from '@/components/shared/affi-banner';
import ColorTest from '@/components/shared/color-test';
export default function ShopPage() {
  return (
    <div className="bg-white bg-[linear-gradient(0deg,_rgba(199,_116,_253,_0.2)_0.01%,_rgba(255,_255,_255,_0)_100%)]">
      <div className="relative">
        {/* Image Banner */}
        {/* <img className="w-full" alt="banner" src={BannerImage} /> */}
        <HeroSection />
        {/* Banner Component */}
        {/* <Banner /> */}
      </div>
      <BasePages
        className="relative mx-auto w-full flex-1 overflow-y-auto"
        pageHead="Trang chủ"
      >
        {/* <ProductCategories/> */}
        <ProductListing/>
        <MakeupTones/>
        <ColorTest/>
        <AffiliateBanner/>
      </BasePages>
      {/* <Footer /> */}
    </div>
  );
}

