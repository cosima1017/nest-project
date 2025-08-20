export function getTree<T extends { children?: T[] } = any>(
  nodes: T[],
  parentKey: string,
  childKey: string
): T[] {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  const tree: T[] = [];
  const map = new Map<any, T>();

  for (const node of nodes) {
    node.children = node.children || [];
    map.set(node[childKey], node);
  }
  for (const node of nodes) {
    const parentId = node[parentKey];
    if (parentId === null || parentId === undefined || parentId === 0 ||
        parentId === '' || !map.has(parentId)) {
      tree.push(node);
    } else {
      const parent = map.get(parentId);
      if (parent && Array.isArray(parent.children)) {
        parent.children.push(node);
      }
    }
  }
  return tree;
}