// We can't set QTreeNode as default assignment for the generics param,
// we use unknown and use conditional types to set it
export interface QTreeNode<Node = unknown> {
  label?: string;
  icon?: string;
  iconColor?: string;
  img?: string;
  avatar?: string;
  children?: (Node extends unknown ? QTreeNode : Node)[];
  disabled?: boolean;
  expandable?: boolean;
  selectable?: boolean;
  handler?: (node: Node extends unknown ? QTreeNode : Node) => void;
  tickable?: boolean;
  noTick?: boolean;
  tickStrategy?: "leaf" | "leaf-filtered" | "string" | "none";
  lazy?: boolean;
  header?: string;
  body?: string;
  [index: string]: any;
}

export interface QTreeLazyLoadParams<
  Node extends QTreeNode = QTreeNode,
  UpdatedNodes extends QTreeNode = Node
> {
  node: Node;
  key: string;
  done: (nodes: UpdatedNodes[]) => void;
  fail: () => void;
}
