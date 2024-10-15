import {
  ASTNode,
  NodeType,
  createValueNode,
  createStructureNode,
} from "./astParser";

function addNodeToAST(
  ast: ASTNode,
  newNodeId: string,
  parentNodeId: string,
  isParallel: boolean
): ASTNode {
  function addNodeRecursive(node: ASTNode): ASTNode {
    if (node.type === NodeType.VALUE) {
      if (node.value === parentNodeId) {
        if (isParallel) {
          return createStructureNode(NodeType.SEQ, [
            node,
            createStructureNode(NodeType.PAR, [createValueNode(newNodeId)]),
          ]);
        } else {
          return createStructureNode(NodeType.SEQ, [
            node,
            createValueNode(newNodeId),
          ]);
        }
      }
      return node;
    }

    if (node.type === NodeType.SEQ) {
      const parentIndex = node.children.findIndex(
        (child) =>
          (child.type === NodeType.VALUE && child.value === parentNodeId) ||
          (child.type !== NodeType.VALUE &&
            child.children.some(
              (grandchild) =>
                grandchild.type === NodeType.VALUE &&
                grandchild.value === parentNodeId
            ))
      );

      if (parentIndex !== -1) {
        const updatedChildren = [...node.children];
        if (isParallel) {
          if (
            parentIndex + 1 < updatedChildren.length &&
            updatedChildren[parentIndex + 1].type === NodeType.PAR
          ) {
            updatedChildren[parentIndex + 1] = {
              ...updatedChildren[parentIndex + 1],
              //@ts-expect-error - TODO: Refactor to avoid this
              children: [
                //@ts-expect-error - TODO: Refactor to avoid this
                ...updatedChildren[parentIndex + 1].children,
                createValueNode(newNodeId),
              ],
            };
          } else {
            const newParNode = createStructureNode(NodeType.PAR, []);
            if (parentIndex + 1 < updatedChildren.length) {
              newParNode.children.push(updatedChildren[parentIndex + 1]);
            }
            newParNode.children.push(createValueNode(newNodeId));
            updatedChildren.splice(parentIndex + 1, 1, newParNode);
          }
        } else {
          updatedChildren.splice(
            parentIndex + 1,
            0,
            createValueNode(newNodeId)
          );
        }
        return { ...node, children: updatedChildren };
      }

      return {
        ...node,
        children: node.children.map(addNodeRecursive),
      };
    }

    if (node.type === NodeType.PAR) {
      return {
        ...node,
        children: node.children.map(addNodeRecursive),
      };
    }

    return node;
  }

  return addNodeRecursive(ast);
}

export { addNodeToAST };
