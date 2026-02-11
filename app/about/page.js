const highlights = [
  {
    title: "Strategy First",
    text: "We map each page to your funnel so your website drives inquiries, not just impressions.",
  },
  {
    title: "Design with Intent",
    text: "Clean visual systems, strong hierarchy, and persuasive content blocks.",
  },
  {
    title: "Engineering Quality",
    text: "Reliable Next.js architecture and Node.js APIs that are easy to scale.",
  },
];

const values = [
  "Clear communication from day one",
  "Realistic timelines and milestone tracking",
  "Business-centered decision making",
  "Ongoing optimization after launch",
];

export default function AboutPage() {
  return (
    <section className="container page-block">
      <p className="eyebrow">About Sitecraft4u</p>
      <h1>We build digital systems that move businesses forward</h1>
      <p className="lead-copy">
        Inspired by modern transformation-agency layouts, our process combines brand
        storytelling, conversion-focused UX, and practical backend delivery.
      </p>

      <div className="grid-3">
        {highlights.map((item) => (
          <article className="info-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="split-panel">
        <article className="panel-card">
          <h2>What makes us different</h2>
          <p>
            We keep design, development, and business goals in one loop. That means
            faster decisions, cleaner implementation, and better outcomes.
          </p>
        </article>
        <article className="panel-card">
          <h2>Our operating values</h2>
          <ul className="clean-list">
            {values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
