import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Home.jsx/Header';
import Section1 from '../components/Home.jsx/Section1';
import Section2 from '../components/Home.jsx/Section2';
import Section3 from '../components/Home.jsx/Section3';
import Section4 from '../components/Home.jsx/Section4';
import Section5 from '../components/Home.jsx/Section5';
import Footer from '../components/Home.jsx/Footer';

const Home = () => {
  

  return (
    <>

      <Header />
      <main className="main-content">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4/>
        <Section5/>
      </main>
      <Footer />
    </>
  );
};

export default Home;
