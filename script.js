/**
 * Răng Đen Môi Đỏ — Editorial Newspaper Language Selection & Feedback Handler
 */

(function () {
  const modal = document.getElementById('lang-modal');
  const btnVi = document.getElementById('btn-choose-vi');
  const btnEn = document.getElementById('btn-choose-en');
  const btnSwitchMasthead = document.getElementById('btn-switch-lang');
  const feedbackInput = document.getElementById('nene-feedback-input');

  function updatePlaceholders(lang) {
    if (feedbackInput) {
      feedbackInput.placeholder =
        lang === 'en'
          ? 'Write your thoughts or feedback here...'
          : 'Viết đôi dòng cảm nghĩ của bạn vào đây nha...';
    }
  }

  function selectLanguage(lang) {
    document.body.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.remove('modal-open');
    updatePlaceholders(lang);
    if (modal) {
      modal.classList.add('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (btnVi) {
    btnVi.addEventListener('click', function () {
      selectLanguage('vi');
    });
  }

  if (btnEn) {
    btnEn.addEventListener('click', function () {
      selectLanguage('en');
    });
  }

  if (btnSwitchMasthead) {
    btnSwitchMasthead.addEventListener('click', function () {
      const current = document.body.getAttribute('data-lang') || 'vi';
      const next = current === 'vi' ? 'en' : 'vi';
      document.body.setAttribute('data-lang', next);
      document.documentElement.setAttribute('lang', next);
      updatePlaceholders(next);
    });
  }

  // Feedback form submission to nene289.net@gmail.com
  const feedbackForm = document.getElementById('nene-feedback-form');
  const feedbackBtn = document.getElementById('nene-feedback-btn');
  const feedbackStatus = document.getElementById('nene-feedback-status');

  if (feedbackForm && feedbackInput) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = feedbackInput.value.trim();
      if (!text) return;

      const lang = document.body.getAttribute('data-lang') || 'vi';
      if (feedbackBtn) feedbackBtn.disabled = true;
      if (feedbackStatus) {
        feedbackStatus.textContent =
          lang === 'en' ? 'Sending to Nè Ne...' : 'Đang gửi về hộp thư của Nè Ne...';
      }

      const payload = JSON.stringify({
        _subject: '[Răng Đen Môi Đỏ] Feedback mới từ độc giả!',
        message: text,
        _template: 'table'
      });

      // Use local server proxy when opened via file:// so Origin header is valid for FormSubmit
      const apiEndpoint =
        window.location.protocol === 'file:'
          ? 'http://127.0.0.1:8089/api/feedback'
          : '/api/feedback';

      fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: payload
      })
        .catch(function () {
          // Direct fallback if static-hosted on Netlify/Vercel
          return fetch('https://formsubmit.co/ajax/nene289.net@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: payload
          });
        })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (feedbackBtn) feedbackBtn.disabled = false;
          if (data && (data.success === 'true' || data.success === true)) {
            feedbackInput.value = '';
            if (feedbackStatus) {
              feedbackStatus.textContent =
                lang === 'en'
                  ? '♥ Sent! Thank you for sharing with Nè Ne!'
                  : '♥ Đã gửi thành công về nene289.net@gmail.com! Cảm ơn bạn nha!';
            }
          } else if (data && data.message && data.message.indexOf('Activation') !== -1) {
            feedbackInput.value = '';
            if (feedbackStatus) {
              feedbackStatus.innerHTML =
                lang === 'en'
                  ? '💌 Saved! (Owner: Please click <strong>"Activate Form"</strong> in the email sent by FormSubmit to <strong>nene289.net@gmail.com</strong> — check Spam too!)'
                  : '💌 Đã lưu góp ý! (Lưu ý cho Nè Ne: Hãy mở Gmail <strong>nene289.net@gmail.com</strong> — kiểm tra cả mục Spam/Thư rác — và bấm nút <strong>"Activate Form"</strong> trong mail của FormSubmit 1 lần để nhận tự động nha!)';
            }
          } else {
            const subject = encodeURIComponent('[Răng Đen Môi Đỏ] Feedback cho Nè Ne');
            const body = encodeURIComponent(text);
            window.open(
              'https://mail.google.com/mail/?view=cm&fs=1&to=nene289.net@gmail.com&su=' +
                subject +
                '&body=' +
                body,
              '_blank'
            );
            if (feedbackStatus) {
              feedbackStatus.textContent =
                lang === 'en'
                  ? '♥ Opened Gmail to send directly to nene289.net@gmail.com!'
                  : '♥ Đã mở cửa sổ Gmail gửi tới nene289.net@gmail.com!';
            }
          }
        })
        .catch(function () {
          if (feedbackBtn) feedbackBtn.disabled = false;
          const subject = encodeURIComponent('[Răng Đen Môi Đỏ] Feedback cho Nè Ne');
          const body = encodeURIComponent(text);
          window.open(
            'https://mail.google.com/mail/?view=cm&fs=1&to=nene289.net@gmail.com&su=' +
              subject +
              '&body=' +
              body,
            '_blank'
          );
        });
    });
  }
})();
