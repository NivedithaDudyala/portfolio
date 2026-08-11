(() => {
  const returnLink = document.querySelector('[data-role-return]');
  if (!returnLink) return;

  const requestedSource = new URLSearchParams(window.location.search).get('from');
  const destinations = {
    pm: '../pm/index.html#work',
    design: '../design/index.html#work',
    research: '../research/index.html#work'
  };

  if (destinations[requestedSource]) {
    sessionStorage.setItem('portfolioRole', requestedSource);
  }

  const source = destinations[requestedSource]
    ? requestedSource
    : sessionStorage.getItem('portfolioRole');

  returnLink.href = destinations[source] || '../index.html';

  if (!destinations[source]) return;

  const caseStudyPath = /\/(ARWell|ARWell-Pro|Shloka|TGP|PrivateAccess)\//;
  document.querySelectorAll('a[href]').forEach((link) => {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !caseStudyPath.test(url.pathname)) return;
    if (!url.searchParams.has('from')) url.searchParams.set('from', source);
    link.href = `${url.pathname}${url.search}${url.hash}`;
  });
})();
