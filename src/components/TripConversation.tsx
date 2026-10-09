'use client';
import { useState } from 'react';
import { destinations } from '@/data/site';
import WhatsAppLink from '@/components/WhatsAppLink';
export default function TripConversation() {
  const [destination, setDestination] = useState('');
  const [party, setParty] = useState('');
  return (
    <section className="conversation-panel wrap">
      <div>
        <p className="eyebrow">A LITTLE STARTING POINT</p>
        <h2>
          Your idea.
          <br />
          <em>Our next conversation.</em>
        </h2>
        <p>
          Choose what you have in mind and open a WhatsApp draft. You can edit
          it before sending.
        </p>
      </div>
      <div className="conversation-options">
        <label htmlFor="chat-destination">Where are you dreaming of?</label>
        <select
          id="chat-destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="">I’d like your suggestions</option>
          {destinations.map((d) => (
            <option key={d.slug}>{d.name}</option>
          ))}
          <option>Somewhere else</option>
        </select>
        <label htmlFor="chat-party">Who’s coming along?</label>
        <select
          id="chat-party"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        >
          <option value="">Still deciding</option>
          <option>A family holiday</option>
          <option>A group journey</option>
          <option>A couple’s getaway</option>
          <option>A solo holiday</option>
        </select>
        <WhatsAppLink
          destination={[destination, party].filter(Boolean).join(' — ')}
          className="button"
        >
          Continue on WhatsApp ↗
        </WhatsAppLink>
        <small>
          These choices are not saved or submitted through the website.
        </small>
      </div>
    </section>
  );
}
