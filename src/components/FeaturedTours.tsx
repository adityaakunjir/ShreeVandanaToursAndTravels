export default function FeaturedTours() {
  const tours = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop",
      badge: "Trending",
      location: "Dubai, UAE",
      title: "Exotic Dubai & Abu Dhabi",
      duration: "5 Nights / 6 Days",
      price: "₹99,999",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
      badge: null,
      location: "Bali, Indonesia",
      title: "The Wonders of Bali",
      duration: "6 Nights / 7 Days",
      price: "₹95,555",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop",
      badge: null,
      location: "Andaman, India",
      title: "Amazing Andaman",
      duration: "5 Nights / 6 Days",
      price: "₹55,555",
    },
  ];

  return (
    <section className="featured-tours">
      <div className="section-header">
        <h2>
          Popular <span>Destinations</span>
        </h2>
        <p>Breathtaking tours designed to create memories of a lifetime.</p>
      </div>

      <div className="tour-grid">
        {tours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <div className="tour-image">
              <img src={tour.image} alt={tour.location} />
              {tour.badge && <span className="badge">{tour.badge}</span>}
            </div>
            <div className="tour-info">
              <div className="tour-location">📍 {tour.location}</div>
              <h3>{tour.title}</h3>
              <div className="tour-details">
                <span>
                  <i className="icon">⏱️</i> {tour.duration}
                </span>
              </div>
              <div className="tour-footer">
                <div className="price">
                  <span className="label">From</span>
                  <span className="amount">{tour.price}</span>
                </div>
                <button className="btn-outline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
