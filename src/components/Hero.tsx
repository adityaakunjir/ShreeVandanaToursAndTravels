export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-video-bg">
        <img
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop"
          alt="Hero Background"
        />
        <div className="overlay"></div>
      </div>

      <div className="hero-content">
        <h1 className="animate-up">
          Discover The World's <br />
          <span className="highlight">Hidden Gems</span>
        </h1>
        <p className="animate-up delay-1">
          Experience luxury, comfort, and unforgettable memories with our
          handpicked domestic and international tour packages.
        </p>

        <div className="search-bar animate-up delay-2">
          <div className="search-input">
            <label>Destination</label>
            <input type="text" placeholder="Where do you want to go?" />
          </div>
          <div className="search-input">
            <label>Date</label>
            <input type="text" placeholder="When?" />
          </div>
          <div className="search-input">
            <label>Guests</label>
            <input type="text" placeholder="How many?" />
          </div>
          <button className="btn-search">Explore Now</button>
        </div>
      </div>
    </header>
  );
}
