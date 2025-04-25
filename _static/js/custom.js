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
}); 