// Đặt tiêu điểm bên trong modal
function trapFocus(container, firstFocusableElement) {
  const focusableElements = container.querySelectorAll(
    'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
  );
  const firstElement = firstFocusableElement || focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleFocus(event) {
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  container.addEventListener('keydown', handleFocus);
  firstElement.focus();
}

// Xoá trap focus khi modal đóng
function removeTrapFocus(focusElement = null) {
  if (focusElement) focusElement.focus();
}
