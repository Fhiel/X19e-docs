window.MathJax = {
  tex: {
    inlineMath: [ ["$", "$"], ["\\(", "\\)"] ],
    displayMath: [ ["$$", "$$"], ["\\[", "\\]"] ],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: "tex2jax_ignore|md-nav__link"
  }
};

MathJax.Hub = MathJax.Hub || {};  // Fallback