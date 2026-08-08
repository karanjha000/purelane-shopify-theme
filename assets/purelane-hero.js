(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wireUp(stageWrap) {
    if (stageWrap.dataset.purelaneWired === '1') return;
    stageWrap.dataset.purelaneWired = '1';

    var sectionId = stageWrap.id.replace('hstage-', '');
    var dotsWrap = document.getElementById('hdots-' + sectionId);
    if (!dotsWrap) return;

    var slides = stageWrap.querySelectorAll('.purelane-hslide');
    var dots = dotsWrap.querySelectorAll('button');
    var total = slides.length;
    var current = 1;
    var timer = null;

    function show(n) {
      current = n;
      slides.forEach(function (slide) {
        slide.classList.toggle('on', slide.getAttribute('data-n') === String(n));
      });
      dots.forEach(function (dot, i) {
        var active = i === n - 1;
        dot.classList.toggle('on', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function next() {
      var n = current + 1;
      if (n > total) n = 1;
      show(n);
    }

    function play() {
      if (!timer && !reduce && total > 1) {
        timer = setInterval(next, 3800);
      }
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stop();
        show(parseInt(dot.getAttribute('data-n'), 10));
        play();
      });
    });

    stageWrap.addEventListener('mouseenter', stop);
    stageWrap.addEventListener('mouseleave', play);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) play();
          else stop();
        });
      }, { threshold: 0.2 }).observe(stageWrap);
    } else {
      play();
    }
  }

  function scan() {
    document.querySelectorAll('.purelane-hstage[id^="hstage-"]').forEach(wireUp);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
  window.addEventListener('load', scan);
  document.addEventListener('shopify:section:load', scan);
})();