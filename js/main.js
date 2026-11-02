// ===== Настройки =====
// Вставьте сюда ссылку, куда ведут все кнопки «Забронировать»
// (форма, WhatsApp, Telegram, страница на zamania.ru или tel:+7...).
// Пока ссылка пустая, кнопки прокручивают к блоку с ценой.
const BOOKING_URL = '';

document.querySelectorAll('.js-book').forEach((btn) => {
  if (BOOKING_URL) {
    btn.href = BOOKING_URL;
    if (/^https?:/.test(BOOKING_URL)) {
      btn.target = '_blank';
      btn.rel = 'noopener';
    }
  }
});

// ===== Плавное появление блоков при прокрутке =====
const revealItems = document.querySelectorAll('.h2, .step, .review, .stat, .package, .points, .problem');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// Если картинка не загрузилась — прячем значок «битой» картинки
document.querySelectorAll('img').forEach((img) => {
  const hide = () => { img.style.visibility = 'hidden'; };
  if (img.complete && img.naturalWidth === 0) hide();
  else img.addEventListener('error', hide, { once: true });
});
