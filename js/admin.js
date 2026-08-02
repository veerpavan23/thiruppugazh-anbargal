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

  // ---- USER MANAGEMENT LOGIC ----

  window.switchAdminTab = function(tab) {
    document.getElementById('manage-events').style.display = tab === 'events' ? 'block' : 'none';
    document.getElementById('manage-users').style.display = tab === 'users' ? 'block' : 'none';
    
    document.getElementById('tab-events').className = tab === 'events' ? 'btn active' : 'btn btn-secondary';
    document.getElementById('tab-users').className = tab === 'users' ? 'btn active' : 'btn btn-secondary';

    if (tab === 'events') {
      document.getElementById('tab-events').style.background = 'var(--primary-color)';
      document.getElementById('tab-events').style.color = 'white';
      document.getElementById('tab-users').style.background = '';
      document.getElementById('tab-users').style.color = '';
    } else {
      document.getElementById('tab-users').style.background = 'var(--primary-color)';
      document.getElementById('tab-users').style.color = 'white';
      document.getElementById('tab-events').style.background = '';
      document.getElementById('tab-events').style.color = '';
      loadUsers();
    }
  };

  const userFormContainer = document.getElementById('user-form-container');
  const userForm = document.getElementById('user-form');
  const addUserBtn = document.getElementById('add-user-btn');
  const usersList = document.getElementById('users-list');

  window.showAddUserForm = function() {
    userForm.reset();
    document.getElementById('user-doc-id').value = '';
    document.getElementById('userEmail').disabled = false;
    document.getElementById('user-form-title').textContent = 'Create New User';
    userFormContainer.style.display = 'block';
    addUserBtn.style.display = 'none';
  };

  window.cancelUserEdit = function() {
    userFormContainer.style.display = 'none';
    addUserBtn.style.display = 'block';
    userForm.reset();
  };

  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('user-doc-id').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const submitBtn = document.getElementById('save-user-btn');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      if (id) {
        // Update existing user details in Firestore
        await db.collection("users").doc(id).update({
          name, role,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('User details updated successfully!');
      } else {
        // Create new user using Secondary App (prevents logging out the admin)
        
        // First check if they are already in Firestore dashboard
        const existingDoc = await db.collection("users").where("email", "==", email).get();
        if (!existingDoc.empty) {
          throw new Error("This user is already added to the dashboard. Please edit them from the list below.");
        }

        const secondaryApp = firebase.initializeApp(firebase.app().options, "Secondary");
        const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
        
        let accountAlreadyExists = false;
        try {
          await secondaryApp.auth().createUserWithEmailAndPassword(email, randomPassword);
        } catch (authErr) {
          if (authErr.code === 'auth/email-already-in-use') {
            accountAlreadyExists = true;
          } else {
            await secondaryApp.delete();
            throw authErr;
          }
        }
        
        // Send reset email so they can set their own password
        await secondaryApp.auth().sendPasswordResetEmail(email);
        await secondaryApp.delete(); // Cleanup secondary app instance

        // Save to Firestore
        await db.collection("users").add({
          name, email, role,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        if (accountAlreadyExists) {
          alert('User account already existed in the system. They have been added to the dashboard and a password reset email was sent.');
        } else {
          alert('User created successfully! A password setup email has been sent to them.');
        }
      }
      cancelUserEdit();
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert('Error saving user: ' + error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = id ? 'Update User' : 'Create User';
    }
  });

  async function loadUsers() {
    usersList.innerHTML = '<p class="text-center">Loading users...</p>';
    try {
      // Fetch all users without orderBy to avoid missing documents that lack a createdAt field
      const snapshot = await db.collection("users").get();
      
      if (snapshot.empty) {
        usersList.innerHTML = '<p class="text-center">No users found. Create one above.</p>';
        return;
      }
      
      // Convert to array and sort client-side (newest first based on createdAt or fallback)
      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      users.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      let html = '';
      users.forEach(data => {
        html += `
          <div class="event-item" style="border-left: 4px solid #2196F3;">
            <div>
              <h4 style="margin-bottom: 0.25rem;">${data.name || 'Unknown'} <span style="font-size: 0.8rem; background: #eee; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">${data.role || 'Admin'}</span></h4>
              <small style="color: #666;">${data.email}</small>
            </div>
            <div class="event-actions">
              <button class="btn btn-secondary btn-small" onclick='editUser("${data.id}", ${JSON.stringify(data).replace(/'/g, "&#39;")})'>Edit</button>
              <button class="btn btn-secondary btn-small" onclick="resetUserPassword('${data.email}')">Reset Password</button>
              <button class="btn btn-danger btn-small" onclick="deleteUserRecord('${data.id}', '${data.email}')">Delete</button>
            </div>
          </div>
        `;
      });
      usersList.innerHTML = html;
    } catch (error) {
      console.error("Error loading users:", error);
      usersList.innerHTML = '<p class="text-center" style="color:red;">Error loading users.</p>';
    }
  }

  window.editUser = function(id, data) {
    document.getElementById('user-doc-id').value = id;
    document.getElementById('userName').value = data.name || '';
    document.getElementById('userEmail').value = data.email || '';
    document.getElementById('userEmail').disabled = true; // Prevent changing email
    document.getElementById('userRole').value = data.role || 'Admin';
    
    document.getElementById('user-form-title').textContent = 'Edit User Details';
    userFormContainer.style.display = 'block';
    addUserBtn.style.display = 'none';
    window.scrollTo({ top: userFormContainer.offsetTop - 100, behavior: 'smooth' });
  };

  window.resetUserPassword = async function(email) {
    if(confirm('Send a password reset email to ' + email + '?')) {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
        alert('Password reset email sent to ' + email);
      } catch (error) {
        alert('Error sending reset email: ' + error.message);
      }
    }
  };

  window.deleteUserRecord = async function(id, email) {
    if(confirm('Delete user record for ' + email + '? Note: This only deletes their Firestore profile, not their Authentication account.')) {
      try {
        await db.collection("users").doc(id).delete();
        loadUsers();
      } catch(error) {
        alert('Failed to delete user profile: ' + error.message);
      }
    }
  };
});
