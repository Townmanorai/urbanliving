export function navClick(e, path, navigate) {
  if (e.ctrlKey || e.metaKey) {
    window.open(path, '_blank', 'noopener,noreferrer');
  } else {
    navigate(path);
  }
}

export function auxNavClick(e, path) {
  if (e.button === 1) {
    e.preventDefault();
    window.open(path, '_blank', 'noopener,noreferrer');
  }
}
