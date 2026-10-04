export default function Features() {
  const features = [
    {
      icon: "🌍",
      title: "100+ Destinations",
      description: "Explore handpicked locations around the globe with all-inclusive packages.",
    },
    {
      icon: "💎",
      title: "Best Price Guarantee",
      description: "Luxury travel doesn't have to be expensive. No hidden costs.",
    },
    {
      icon: "🎧",
      title: "24/7 Expert Support",
      description: "Our tour managers are always available to help you anywhere in the world.",
    },
    {
      icon: "⚡",
      title: "Super Fast Booking",
      description: "Seamless online booking experience, tailored just for you.",
    },
  ];

  return (
    <section className="features">
      {features.map((feature, index) => (
        <div className="feature-card" key={index}>
          <div className="icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
