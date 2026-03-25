function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function visit(node, callback, index = null, parent = null) {
  callback(node, index, parent);
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return;
  node.children.forEach((child, childIndex) => visit(child, callback, childIndex, node));
}

export function remarkRemoteImages() {
  return function transformer(tree) {
    visit(tree, (node, index, parent) => {
      if (!parent || index === null) return;
      if (node?.type !== 'image' || typeof node.url !== 'string') return;
      if (!/^https?:\/\//i.test(node.url)) return;

      const attrs = [
        `src="${escapeHtml(node.url)}"`,
        `alt="${escapeHtml(node.alt || '')}"`,
        'loading="lazy"',
        'decoding="async"',
      ];

      if (node.title) {
        attrs.push(`title="${escapeHtml(node.title)}"`);
      }

      parent.children[index] = {
        type: 'html',
        value: `<img ${attrs.join(' ')} />`,
      };
    });
  };
}
