export function onDataChanged(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => {
    callback(e.detail);
  };
  window.addEventListener('hoda_data_changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('hoda_data_changed', handler);
    window.removeEventListener('storage', handler);
  };
}
