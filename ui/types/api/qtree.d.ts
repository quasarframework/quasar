/**
 * @template TExtra Object type to add extra properties for the node, overrides the existing ones as well
 */
export type QTreeNode<TExtra = { [index: string]: any }> = Omit<
  {
    label?: string;
    icon?: string;
    iconColor?: string;
    img?: string;
    avatar?: string;
    children?: QTreeNode<TExtra>[];
    disabled?: boolean;
    expandable?: boolean;
    selectable?: boolean;
    handler?: (node: QTreeNode<TExtra>) => void;
    tickable?: boolean;
    noTick?: boolean;
    tickStrategy?: "leaf" | "leaf-filtered" | "string" | "none";
    lazy?: boolean;
    header?: string;
    body?: string;
  },
  keyof TExtra
> &
  TExtra;

export interface QTreeLazyLoadParams<
  Node extends QTreeNode = QTreeNode,
  UpdatedNodes extends QTreeNode = Node
> {
  node: Node;
  key: string;
  done: (nodes: UpdatedNodes[]) => void;
  fail: () => void;
}
