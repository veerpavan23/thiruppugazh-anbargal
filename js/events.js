// js/events.js

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderEvents();
});

async function fetchAndRenderEvents() {
  const container = document.getElementById('events-container');
  const loader = document.getElementById('events-loader');
  
  try {
    const snapshot = await window.db.collection("admin_events").get();
    
    loader.style.display = 'none';
    container.style.display = 'grid';
    
    if (snapshot.empty) {
      container.innerHTML = '<p>No upcoming events currently scheduled.</p>';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      container.innerHTML += createEventCard(data);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    loader.innerHTML = '<p style="color: red;">Failed to load events. Please try again later.</p>';
  }
}

function createEventCard(event) {
  const { eventName, eventDateTime, city, venue, bhajan, urlToJoin, mediaUrl } = event;
  return `
    <div class="card" style="margin-bottom: 0;">
      <h3>${eventName || 'Untitled Event'}</h3>
      ${eventDateTime ? `<p style="margin-bottom: 0.5rem;"><strong>Date & Time:</strong> ${new Date(eventDateTime).toLocaleString()}</p>` : ''}
      <p style="margin-bottom: 0.5rem;"><strong>City:</strong> ${city || 'TBD'}</p>
      <p style="margin-bottom: 0.5rem;"><strong>Venue:</strong> ${venue || 'TBD'}</p>
      <p style="margin-bottom: 0.5rem;"><strong>Bhajan Details:</strong> ${bhajan || ''}</p>
      
      <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        ${urlToJoin ? `<a href="${urlToJoin}" target="_blank" class="btn" rel="noopener">Join Event</a>` : ''}
        ${mediaUrl ? `<a href="${mediaUrl}" target="_blank" class="btn btn-secondary" rel="noopener">View Media</a>` : ''}
      </div>
    </div>
  `;
}
