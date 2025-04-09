import React from "react";
import LatestPost from "../Components/LatestPost";
import "./Home.css";
export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">WELCOME TO MY BLOG</h1>
          <p className="hero-subtitle">
            Dive into a world of creativity, insights, and inspiration. Discover
            the extraordinary in the ordinary.
          </p>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="latest-posts-container">
        <LatestPost />
      </section>
    </div>
  );
}
