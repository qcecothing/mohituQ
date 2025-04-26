// Custom JavaScript for mohituQ documentation

// Function to detect and apply RTL formatting to Arabic text
document.addEventListener('DOMContentLoaded', function() {
  // Find all elements with Arabic text and add appropriate classes
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/;
  
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (arabicRegex.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.className = 'arabic';
        span.textContent = node.nodeValue;
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  };
  
  processNode(document.body);
  
  // Remove duplicate navigation entries
  const navItems = document.querySelectorAll('.wy-menu-vertical li.toctree-l1');
  const seen = new Set();
  
  navItems.forEach(item => {
    const text = item.textContent.trim();
    if (seen.has(text)) {
      item.style.display = 'none';
    } else {
      seen.add(text);
    }
  });
  
  // Improve mobile navigation
  const mobileMenu = document.querySelector('.wy-nav-top');
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
      document.body.classList.toggle('wy-nav-content-wrap');
    });
  }
}); 