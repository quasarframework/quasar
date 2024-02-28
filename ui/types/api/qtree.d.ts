/**
 * Node type to be used with QTree's `nodes` prop
 *
 * @see https://v2.quasar.dev/vue-components/tree#qtree-api
 *
 * @template TExtra Object type to add extra properties for the node, overrides the existing ones as well
 *
 * @example
 * Basic usage
 * ```ts
 * const nodes: QTreeNode[] = [
 *   // ...
 * ];
 * // <q-tree :nodes="nodes" />
 * ```
 *
 * @example
 * Making some properties required
 * ```ts
 * // make label and icon required, the rest will stay optional
 * const nodes: QTreeNode<{ label: string; icon: string }>[] = [
 *   // ...
 * ];
 * ```
 *
 * @example
 * Adding extra properties
 * ```ts
 * // on top of the existing properties, add a foo property
 * const nodes: QTreeNode<{ foo: number }>[] = [
 *   // ...
 * ];
 * ```
 *
 * @example
 * Using different label/children properties
 * ```ts
 * type Node = QTreeNode<{ name: string; subNodes: Node[] }>;
 * const nodes: Node[] = [
 *   // ...
 * ];
 * // <q-tree :nodes="nodes" label-key="name" children-key="subNodes" />
 * ```
 *
 * @example
 * Using a different child node type
 * ```ts
 * type ChildNode = QTreeNode<{ foo: number }>;
 * type ParentNode = QTreeNode<{ bar: string; children?: ChildNode[] }>;
 *
 * const nodes: ParentNode[] = [
 *   // ...
 * ];
 * ```
 *
 * @example
 * A very basic file system tree
 * ```ts
 * interface FileInfo {
 *   path: string;
 *   size: number;
 *   lastModified: number;
 * }
 * type FileNode = QTreeNode<FileInfo & { type: "file", children?: never }>;
 * type DirectoryNode = QTreeNode<FileInfo & { type: "directory", children?: (FileNode | DirectoryNode)[] }>;
 *
 * const nodes: DirectoryNode[] = [
 *   {
 *     type: "directory",
 *     path: "/",
 *     size: 0,
 *     lastModified: 0,
 *     // allows both file and directory as children
 *     children: [
 *       {
 *         type: "file",
 *         path: "/foo.txt",
 *         size: 100,
 *         lastModified: 1000,
 *         // does not allow children
 *       },
 *       {
 *         type: "directory",
 *         path: "/bar",
 *         size: 0,
 *         lastModified: 0,
 *         // empty folder - doesn't have children
 *       }
 *     ]
 *   }
 * ]
 * ```
 */
export type QTreeNode<TExtra = unknown> = Omit<
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
  unknown extends TExtra ? "" : keyof TExtra
> &
  (unknown extends TExtra ? Record<string, any> : TExtra);

export interface QTreeLazyLoadParams<
  Node extends QTreeNode = QTreeNode,
  UpdatedNodes extends QTreeNode = Node,
> {
  node: Node;
  key: string;
  done: (nodes: UpdatedNodes[]) => void;
  fail: () => void;
}
