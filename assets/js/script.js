// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Highlight active nav link based on current page
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });

  // Footer year
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Subscribe via mailto (no backend / no form submission)
  const subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('subscribe-email').value.trim();
      if (!email) return;
      const subject = encodeURIComponent('Newsletter Subscription');
      const body = encodeURIComponent(
        `Hi Saverstore,\n\nPlease add this email to your newsletter list: ${email}\n\nThanks!`
      );
      window.location.href = `mailto:support@saverstoreofficial.com?subject=${subject}&body=${body}`;
    });
  }
});
