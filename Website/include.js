// include.js — small loader to inject partial HTML into elements with data-include
function loadIncludes(){
  const elems = Array.from(document.querySelectorAll('[data-include]'));
  const promises = elems.map(el => {
    const url = el.getAttribute('data-include');
    return fetch(url).then(resp => {
      if(!resp.ok) throw new Error('Failed to load ' + url);
      return resp.text();
    }).then(html => {
      el.innerHTML = html;
    }).catch(err => {
      console.error(err);
      el.innerHTML = '';
    });
  });
  return Promise.all(promises);
}

// Expose for other scripts
window.loadIncludes = loadIncludes;
