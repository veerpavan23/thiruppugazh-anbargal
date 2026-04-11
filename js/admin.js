// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
  const auth = window.auth;
  const db = window.db;

  const authView = document.getElementById('auth-view');
  const dashboardView = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const authError = document.getElementById('auth-error');
  
  const eventFormContainer = document.getElementById('event-form-container');
  const eventForm = document.getElementById('event-form');
  const addEventBtn = document.getElementById('add-event-btn');
  const eventsList = document.getElementById('events-list');

  // Listen for auth state changes
  auth.onAuthStateChanged(user => {
    if (user) {
      if (authView) authView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'block';
      loadAdminEvents();
    } else {
      if (authView) authView.style.display = 'block';
      if (dashboardView) dashboardView.style.display = 'none';
    }
  });



  // Login handler is now in login.html
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        await auth.signInWithEmailAndPassword(email, password);
        authError.style.display = 'none';
        loginForm.reset();
      } catch (error) {
        console.error("Login error:", error);
        authError.textContent = "Invalid credentials. Please try again.";
        authError.style.display = 'block';
      }
    });
  }

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });

  // Show Add Event Form
  addEventBtn.addEventListener('click', () => {
    resetForm();
    document.getElementById('form-title').textContent = 'Create New Event';
    eventFormContainer.style.display = 'block';
    addEventBtn.style.display = 'none';
  });

  // Cancel Edit
  window.cancelEdit = function() {
    eventFormContainer.style.display = 'none';
    addEventBtn.style.display = 'block';
    resetForm();
  }

  // Handle Event Form Submit
  eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('event-id').value;
    
    const eventData = {
      eventName: document.getElementById('eventName').value,
      eventDateTime: document.getElementById('eventDateTime').value,
      city: document.getElementById('city').value,
      venue: document.getElementById('venue').value,
      bhajan: document.getElementById('bhajan').value,
      urlToJoin: document.getElementById('urlToJoin').value,
      mediaUrl: document.getElementById('mediaUrl').value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      if (id) {
        // Update existing event
        await db.collection("admin_events").doc(id).update(eventData);
        alert('Event updated successfully');
      } else {
        // Create new event
        eventData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("admin_events").add(eventData);
        alert('Event created successfully');
      }
      cancelEdit();
      loadAdminEvents();
    } catch (error) {
      console.error("Error saving event: ", error);
      alert('Error saving event: ' + error.message);
    }
  });

  // Load Admin Events
  async function loadAdminEvents() {
    eventsList.innerHTML = '<p class="text-center">Loading events...</p>';
    try {
      const snapshot = await db.collection("admin_events").orderBy("updatedAt", "desc").get();
      if (snapshot.empty) {
        eventsList.innerHTML = '<p class="text-center">No events found.</p>';
        return;
      }
      eventsList.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        
        eventsList.innerHTML += `
          <div class="event-item">
            <div>
              <h4 style="margin-bottom: 0.5rem; color: var(--text-color);">${data.eventName}</h4>
              <small>${data.eventDateTime ? new Date(data.eventDateTime).toLocaleString() + ' | ' : ''}${data.city} | ${data.venue}</small>
            </div>
            <div class="event-actions">
              <button class="btn btn-secondary btn-small" onclick='editEvent("${id}", ${JSON.stringify(data).replace(/'/g, "&#39;")})'>Edit</button>
              <button class="btn btn-danger btn-small" onclick="deleteEvent('${id}')">Delete</button>
            </div>
          </div>
        `;
      });
    } catch (error) {
      console.error("Error loading events", error);
      // Wait, firebase indexing might fail if it's the first time they query orderBy without index.
      // Let's fallback to no order if that fails.
      try {
        const fallbackSnapshot = await db.collection("admin_events").get();
        eventsList.innerHTML = '';
        fallbackSnapshot.forEach(doc => {
          const data = doc.data();
          const id = doc.id;
          eventsList.innerHTML += `
            <div class="event-item">
              <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--text-color);">${data.eventName}</h4>
                <small>${data.eventDateTime ? new Date(data.eventDateTime).toLocaleString() + ' | ' : ''}${data.city} | ${data.venue}</small>
              </div>
              <div class="event-actions">
                <button class="btn btn-secondary btn-small" onclick='editEvent("${id}", ${JSON.stringify(data).replace(/'/g, "&#39;")})'>Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteEvent('${id}')">Delete</button>
              </div>
            </div>
          `;
        });
      } catch (err) {
        eventsList.innerHTML = '<p class="text-center" style="color:red;">Error loading events.</p>';
      }
    }
  }

  // Edit Event Wrapper
  window.editEvent = function(id, data) {
    document.getElementById('event-id').value = id;
    document.getElementById('eventName').value = data.eventName || '';
    document.getElementById('eventDateTime').value = data.eventDateTime || '';
    document.getElementById('city').value = data.city || '';
    document.getElementById('venue').value = data.venue || '';
    document.getElementById('bhajan').value = data.bhajan || '';
    document.getElementById('urlToJoin').value = data.urlToJoin || '';
    document.getElementById('mediaUrl').value = data.mediaUrl || '';
    
    document.getElementById('form-title').textContent = 'Edit Event';
    eventFormContainer.style.display = 'block';
    addEventBtn.style.display = 'none';
    window.scrollTo({ top: eventFormContainer.offsetTop - 100, behavior: 'smooth' });
  }

  // Delete Event Wrapper
  window.deleteEvent = async function(id) {
    if(confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      try {
        await db.collection("admin_events").doc(id).delete();
        loadAdminEvents();
      } catch(error) {
        alert('Failed to delete event: ' + error.message);
      }
    }
  }

  function resetForm() {
    eventForm.reset();
    document.getElementById('event-id').value = '';
  }
});
