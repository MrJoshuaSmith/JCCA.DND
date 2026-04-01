/* nav.js — Shared navigation for D&D Club
   Include this script on every page, then call Nav.init('pageId') after auth resolves.
   The calling page must have a <div id="main-nav"></div> as the first child of body.
   On login, store role in localStorage key 'dnd_role'.
*/
(function() {
  const PAGES = [
    { id:'portal',     href:'character_manager.html', icon:'&#9876;',   label:'Portal' },
    { id:'encounters', href:'live_encounters.html',   icon:'&#9889;',   label:'Encounters' },
    { id:'board',      href:'noticeboard.html',       icon:'&#128204;', label:'Quest Board' },
    { id:'market',     href:'marketplace.html',       icon:'&#128717;', label:'Market' },
    { id:'resources',  href:'resources.html',         icon:'&#128218;', label:'Resources' },
    { id:'handouts',   href:'handouts.html',          icon:'&#128196;', label:'Handouts' },
  ];

  const CSS = `
#main-nav{
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.4rem;
  padding:.52rem 1.3rem;
  background:rgba(13,10,8,.94);
  border-bottom:2px solid rgba(180,110,40,.22);
  position:sticky;top:0;z-index:500;
  font-family:'Cinzel',serif;
}
.nav-brand{
  font-size:.85rem;font-weight:900;color:#e0d8c8;letter-spacing:.04em;
  text-decoration:none;white-space:nowrap;
}
.nav-brand b{color:#c41e1e;}
.nav-center{display:flex;align-items:center;gap:.2rem;flex-wrap:wrap;}
.nav-btn{
  display:inline-flex;align-items:center;gap:.32rem;
  font-family:'Cinzel',serif;font-size:.65rem;font-weight:600;letter-spacing:.07em;
  padding:.32rem .8rem;border-radius:3px;cursor:pointer;border:1px solid transparent;
  transition:all .18s;text-decoration:none;color:#a89880;background:transparent;
  white-space:nowrap;
}
.nav-btn:hover{color:#e0d8c8;border-color:rgba(180,110,40,.3);background:rgba(180,110,40,.06);}
.nav-btn.active{
  color:#c8952a;border-color:rgba(180,110,40,.45);
  background:rgba(180,110,40,.1);
  border-bottom-color:#c8952a;
}
.nav-btn.nav-admin{
  color:#c41e1e;border-color:rgba(196,30,30,.35);margin-left:.5rem;
}
.nav-btn.nav-admin:hover{background:rgba(196,30,30,.1);color:#e04040;}
.nav-right{display:flex;align-items:center;gap:.3rem;}
.nav-signout{
  font-family:'Cinzel',serif;font-size:.62rem;font-weight:600;letter-spacing:.07em;
  padding:.28rem .7rem;border-radius:3px;cursor:pointer;
  border:1px solid rgba(180,110,40,.22);color:#a89880;background:transparent;transition:all .18s;
}
.nav-signout:hover{border-color:rgba(196,30,30,.4);color:#c41e1e;}
`;

  function getRole() {
    return localStorage.getItem('dnd_role') ||
      (localStorage.getItem('admin_username')      ? 'admin'      :
       localStorage.getItem('session_dm_username') ? 'session_dm' :
       localStorage.getItem('dm_username')          ? 'dm'         : 'player');
  }

  function inject() {
    if (document.getElementById('nav-style')) return;
    const s = document.createElement('style');
    s.id = 'nav-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function render(activePage) {
    inject();
    const role = getRole();
    const el = document.getElementById('main-nav');
    if (!el) return;
    const items = PAGES.map(p =>
      `<a href="${p.href}" class="nav-btn${p.id===activePage?' active':''}">${p.icon} ${p.label}</a>`
    ).join('');
    const adminBtn = (role === 'admin')
      ? `<a href="admin_tools.html" class="nav-btn nav-admin">&#9881; Admin</a>` : '';
    el.innerHTML = `
      <a href="adventurers_hub.html" class="nav-brand">&#9878; <b>D&amp;D</b> Club</a>
      <div class="nav-center">${items}</div>
      <div class="nav-right">
        ${adminBtn}
        <button class="nav-signout" onclick="Nav.signOut()">Sign Out</button>
      </div>`;
  }

  function signOut() {
    ['dnd_username','dm_username','admin_username','session_dm_username','dnd_role']
      .forEach(k => localStorage.removeItem(k));
    window.location.href = 'index.html';
  }

  window.Nav = { init: render, signOut: signOut, getRole: getRole };
})();