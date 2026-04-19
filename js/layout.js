const navItems = [
  {
    text: "Thiruppugazh Anbargal",
    items: [
      { text: "About Guruji", link: "index.html" },
      { text: "Guru Anjali", link: "guru-anjali.html" },
      { text: "Gold Rules", link: "rules.html" },
      { text: "Message from Guruji", link: "rules.html#message" },
      { text: "Major Events & office Bearer", link: "events.html" }
    ]
  },
  {
    text: "TA Centers",
    items: [
      { text: "Centers in India & World", link: "centers.html" }
    ]
  },
  {
    text: "Learning Center",
    items: [
      { text: "503 Songs", link: "songs.html" },
      { text: "Vel Mayil Seval Virutham", link: "vel-mayil-virutham.html" },
      { text: "Vaguppu", link: "vaguppu.html" }
    ]
  },
  { text: "Abhirami Andadi Pathikam", link: "abhirami.html" },
  { text: "Valli Kalyanam", link: "valli-kalyanam.html" },
  { text: "Viruthams Sung By Guruji", link: "virutham.html" },
  { text: "TIV Book Regional", link: "resources.html#books" },
  { text: "Paddhathi of a Bhajan", link: "paddhathi.html" },
  { text: "Virtual Bhajans", link: "virtual-bhajans.html" },
  { text: "Centenary Celebration", link: "centenary.html" },
  {
    text: "Resources",
    items: [
      { text: "All Songs with Meaning by NR", link: "meaning-nr.html" },
      { text: "All Songs with Meaning by CRK", link: "meaning-crk.html" },
      { text: "Articles", link: "articles.html" },
      { text: "Thaalam Details", link: "thalam-details.html" },
      { text: "Souveneirs", link: "souveneirs.html" },
      { text: "Anbargal Corner", link: "anbargal-corner.html" }
    ]
  },
  { text: "Song TIV Lists With Theme", link: "songtivlist.html" },
  { text: "Manage Events", link: "admin.html", isAdmin: true },
  { text: "User Feedback", link: "feedback.html", isAdmin: true }
];

// Firebase Config for global use
const globalFirebaseConfig = {
  apiKey: "AIzaSyBZj1DcjriYkzGsu6su5mgVdzFD0yC4-r8",
  authDomain: "thiruppugazhanbargal-515e8.firebaseapp.com",
  projectId: "thiruppugazhanbargal-515e8",
  storageBucket: "thiruppugazhanbargal-515e8.appspot.com",
};

function generateDesktopNav() {
  let html = '<div class="desktop-nav">';
  navItems.forEach(item => {
    html += renderDesktopItem(item);
  });
  html += '</div>';
  return html;
}

function renderDesktopItem(item) {
  const adminClass = item.isAdmin ? 'admin-only' : '';
  const style = item.isAdmin ? 'style="display: none;"' : '';
  
  if (item.items) {
    return `
      <div class="dropdown">
        <button class="dropbtn" onclick="if(window.innerWidth <= 960) return; location.href='${item.link || '#'}'">${item.text}</button>
        <div class="dropdown-content">
          ${item.items.map(subItem => {
            if (subItem.items) {
              return `
                <div class="nested-dropdown">
                  <a href="${subItem.link || '#'}">${subItem.text} <span>▶</span></a>
                  <div class="nested-dropdown-content">
                    ${subItem.items.map(deepItem => `<a href="${deepItem.link}" ${deepItem.target ? 'target="_blank"' : ''}>${deepItem.text}</a>`).join('')}
                  </div>
                </div>
              `;
            }
            return `<a href="${subItem.link}" ${subItem.target ? 'target="_blank"' : ''}>${subItem.text}</a>`;
          }).join('')}
        </div>
      </div>
    `;
  } else {
    return `<a href="${item.link}" class="nav-link ${adminClass}" ${style}>${item.text}</a>`;
  }
}

function generateMobileNav() {
  let html = '<ul class="sidebar-nav">';
  // Add Upcoming Events as the first item
  html += `
    <li class="mobile-nav-cta-wrapper">
      <a href="#" onclick="toggleSidebar(); toggleEventsSidebar(); event.preventDefault();" class="mobile-nav-cta">
        📅 UPCOMING EVENTS
      </a>
    </li>
  `;
  navItems.forEach((item, index) => {
    html += renderMobileItem(item, `nav-${index}`);
  });
  html += '</ul>';
  return html;
}

function renderMobileItem(item, id) {
  const adminClass = item.isAdmin ? 'admin-only' : '';
  const style = item.isAdmin ? 'style="display: none;"' : '';

  if (item.items) {
    return `
      <li>
        <div class="sidebar-cat" onclick="toggleSubNav('${id}')">${item.text} <span class="toggle-icon">▼</span></div>
        <ul class="sub-nav" id="sub-nav-${id}">
          ${item.link ? `<li><a href="${item.link}" style="font-style: italic; font-size: 0.9em;">- View Main ${item.text} -</a></li>` : ''}
          ${item.items.map((subItem, subIndex) => renderMobileItem(subItem, `${id}-${subIndex}`)).join('')}
        </ul>
      </li>
    `;
  } else {
    return `<li class="${adminClass}" ${style}><a href="${item.link}" ${item.target ? 'target="_blank"' : ''}>${item.text}</a></li>`;
  }
}

window.toggleSubNav = function(id) {
  const el = document.getElementById(`sub-nav-${id}`);
  if (el) {
    el.classList.toggle('open');
    const parentCat = el.previousElementSibling;
    if (parentCat && parentCat.classList.contains('sidebar-cat')) {
      const icon = parentCat.querySelector('.toggle-icon');
      if (icon) icon.innerText = el.classList.contains('open') ? '▲' : '▼';
    }
  }
}

function renderLayout() {
  const headerHtml = `
    <header class="app-header">
      <div class="navbar-top">
        <button class="mobile-menu-btn" onclick="toggleSidebar()">☰ Menu</button>
      </div>
      
      <div class="banner-section">
         <div class="banner-item left">
           <img src="images/guruji_official_final.jpg" alt="Sri A.S. Raghavan Banner">
           <p>உலகமெங்கும் திருப்புகழ் பரவசெய்த குருஜி ஏ.எஸ் ராகவன் <br/> (1928-2013)</p>
         </div>
         <div class="banner-item center">
           <h1 class="banner-title">Thiruppugazh Anbargal</h1>
           <img src="images/logo.jpg" alt="Thiruppugazh Anbargal Logo" style="height: 80px; width: auto; margin-top: 10px; margin-bottom: 5px; box-shadow: none; border: none;">
         </div>
         <div class="banner-item right">
           <img src="images/banner1.png" alt="Arunagirinathar Banner">
           <p>ஶ்ரீ அருணகிரிநாதர்</p>
         </div>
      </div>
    </header>
    ${generateDesktopNav()}
    
    <div id="mobile-sidebar">
      <div class="sidebar-header">
        <span>Menu</span>
        <button class="close-btn" onclick="toggleSidebar()">×</button>
      </div>
      ${generateMobileNav()}
    </div>
    <div class="sidebar-overlay" onclick="toggleSidebar()"></div>

    <!-- Events Vertical Tab & Sidebar -->
    <div class="events-sidebar-tab" onclick="toggleEventsSidebar()">UPCOMING EVENTS</div>
    <div id="events-sidebar" class="events-sidebar">
      <div class="events-sidebar-header">
        <h3>Upcoming Events</h3>
        <button class="events-close-btn" onclick="toggleEventsSidebar()">×</button>
      </div>
      <div id="events-sidebar-content" class="events-sidebar-content">
        <div class="loader-container">
          <div class="loader"></div>
        </div>
      </div>
    </div>
    <div class="sidebar-overlay-events" onclick="toggleEventsSidebar()"></div>
  `;

  const footerHtml = `
    <footer class="app-footer">
      <p>&copy; ${new Date().getFullYear()} Thiruppugazh Anbargal. Built for the community.</p>
    </footer>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHtml);
  document.body.insertAdjacentHTML('beforeend', footerHtml);

  // Load Firebase scripts if they are missing
  ensureFirebaseLoaded(() => {
    // Initialize Events Feature
    initEventsSidebar();
    
    // Initialize Admin Visibility
    initAdminVisibility();
  });
}

function ensureFirebaseLoaded(callback) {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    callback();
    return;
  }

  const scripts = [
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js",
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js",
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"
  ];

  let loadedCount = 0;
  scripts.forEach(src => {
    // Avoid double loading
    if (document.querySelector(`script[src="${src}"]`)) {
      loadedCount++;
      if (loadedCount === scripts.length) callback();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      loadedCount++;
      if (loadedCount === scripts.length) callback();
    };
    document.head.appendChild(script);
  });
}

function initAdminVisibility() {
  if (typeof firebase === 'undefined') return;

  // Initialize if needed
  if (!firebase.apps.length) {
    firebase.initializeApp(globalFirebaseConfig);
  }

  firebase.auth().onAuthStateChanged(user => {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
      el.style.display = user ? 'block' : 'none';
      if (user && el.tagName === 'A') el.style.display = 'inline-block';
    });
  });
}

window.toggleSidebar = function() {
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
}

window.toggleEventsSidebar = function() {
  const sidebar = document.getElementById('events-sidebar');
  const overlay = document.querySelector('.sidebar-overlay-events');
  
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    loadEventsToSidebar();
  }
}

async function initEventsSidebar() {
  if (typeof firebase === 'undefined') {
    // Optionally load firebase scripts dynamicallly if needed, 
    // but for now we expect them to be in the HTML head of pages using this.
    console.warn("Firebase not loaded. Events sidebar might not work correctly.");
    return;
  }
}

async function loadEventsToSidebar() {
  const content = document.getElementById('events-sidebar-content');
  if (!content) return;

  if (typeof firebase === 'undefined') {
    content.innerHTML = '<p>Firebase not loaded. Please ensure you have internet access.</p>';
    return;
  }

  // Initialize if needed
  if (!firebase.apps.length) {
    firebase.initializeApp(globalFirebaseConfig);
  }
  const db = firebase.firestore();

  try {
    const now = new Date();
    // Fetch future events (or all events for now)
    const snapshot = await db.collection("admin_events")
      .orderBy("eventDateTime", "asc")
      .get();
    
    if (snapshot.empty) {
      content.innerHTML = '<p class="text-center">No upcoming events scheduled at the moment.</p>';
      return;
    }

    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const eventDate = data.eventDateTime ? new Date(data.eventDateTime) : null;
      
      // Basic filtering for future events (optional)
      // if (eventDate && eventDate < now) return;

      html += `
        <div class="sidebar-event-card">
          <h4>${data.eventName}</h4>
          <div class="event-meta">
            <strong>📅 ${eventDate ? eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}</strong>
            <span>🕒 ${eventDate ? eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            <p style="margin-top:8px;">📍 ${data.venue}, ${data.city}</p>
          </div>
          ${data.bhajan ? `<p style="font-size:0.9rem; font-style:italic;">Bhajan: ${data.bhajan}</p>` : ''}
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${data.urlToJoin ? `<a href="${data.urlToJoin}" target="_blank" class="event-link">Join / View Details</a>` : ''}
            ${data.mediaUrl ? `<a href="${data.mediaUrl}" target="_blank" class="event-link" style="background:#2ecc71;">Photos / Videos</a>` : ''}
          </div>
        </div>
      `;
    });

    content.innerHTML = html || '<p class="text-center">No upcoming events scheduled.</p>';
  } catch (error) {
    console.error("Error loading events to sidebar:", error);
    content.innerHTML = '<p style="color:red;">Error loading events. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', renderLayout);

