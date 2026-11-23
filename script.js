/**
 * J HEMA THANANCHAYAN — PORTFOLIO ENGINE
 * Clipboard copy, interactive modal, Formspree integration & notifications
 */

// ==========================================
// CLIPBOARD COPY & TOAST NOTIFICATION
// ==========================================
function copyText(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || `Copied: ${text}`);
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMessage || `Copied: ${text}`);
  } catch (e) {
    showToast(`Contact: ${text}`);
  }
  document.body.removeChild(ta);
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ==========================================
// FORMSPREE INTEGRATION ENDPOINT
// ==========================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maeolbkw';

async function sendToFormspree(payload) {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (err) {
    console.error('Submission error:', err);
    return false;
  }
}

function setInquiryNature(nature, buttonElement) {
  const hiddenInput = document.getElementById('inquiryNature');
  if (hiddenInput) {
    hiddenInput.value = nature;
  }
  document.querySelectorAll('.inquiry-pill').forEach(btn => btn.classList.remove('active'));
  if (buttonElement) {
    buttonElement.classList.add('active');
  }
}

async function handleInlineContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHTML = submitBtn ? submitBtn.innerHTML : '<span>Send Message to Hema</span><span class="send-icon" aria-hidden="true">✈</span>';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
  }

  const nature = document.getElementById('inquiryNature') ? document.getElementById('inquiryNature').value : 'Freelance';
  const name = document.getElementById('inlineName').value;
  const email = document.getElementById('inlineEmail').value;
  const phone = document.getElementById('inlinePhone').value;
  const message = document.getElementById('inlineMessage').value;

  const payload = {
    _subject: `New Portfolio Inquiry (${nature}) — from ${name}`,
    inquiry_nature: nature,
    name: name,
    email: email,
    phone: phone,
    message: message
  };

  await sendToFormspree(payload);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }

  showToast("We'll call you back soon");
  form.reset();

  // Reset active pill to Freelance
  const firstPill = document.querySelector('.inquiry-pill');
  if (firstPill) {
    setInquiryNature('Freelance', firstPill);
  }
}
