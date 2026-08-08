window.PurelaneHero = (function () {
  var initialized = {};

  function init(sectionId) {
    var stageWrap = document.getElementById('hstage-' + sectionId);
    var dotsWrap = document.getElementById('hdots-' + sectionId);
    if (!stageWrap || !dotsWrap) return;

    var slides = stageWrap.querySelectorAll('.hslide');
    var dots = dotsWrap.querySelectorAll('button');

    function show(n) {
      slides.forEach(function (slide) {
        slide.classList.toggle('on', slide.getAttribute('data-n') === String(n));
      });
      dots.forEach(function (dot, i) {
        var active = i === n - 1;
        dot.classList.toggle('on', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-n'), 10));
      });
    });

    // Avoid re-binding listeners if shopify:section:load fires again on the same section
    if (!initialized[sectionId]) {
      initialized[sectionId] = true;
    }
  }

  return { init: init };
})();