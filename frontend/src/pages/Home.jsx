import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Home/Header';
import Section1 from '../components/Home/Section1';
import Section2 from '../components/Home/Section2';
import Section3 from '../components/Home/Section3';
import Section4 from '../components/Home/Section4';
import Section5 from '../components/Home/Section5';
import Footer from '../components/Home/Footer';

const Home = () => {


  return (
    <>
      <div className="bg-black overflow-x-hidden overflow-y-hidden" id='homePage'>
        <Header />
        <main className="main-content">
          <Section1 />
          <Section2 />
          <Section3 />
          <Section4 />
          <Section5 />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
