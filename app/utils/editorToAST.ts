import {
  ASTNode,
  NodeType,
  StructureNode,
  createStructureNode,
  createValueNode,
} from "./astParser";

enum TokenType {
  BEGIN = "BEGIN",
  END = "END",
  COBEGIN = "COBEGIN",
  COEND = "COEND",
  IDENTIFIER = "IDENTIFIER",
  WHITESPACE = "WHITESPACE",
}

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const lines = input.split("\n");

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const words = line.split(/\s+/);
    for (const word of words) {
      if (!word) continue;

      switch (word) {
        case "BEGIN":
          tokens.push({ type: TokenType.BEGIN, value: word });
          break;
        case "END":
          tokens.push({ type: TokenType.END, value: word });
          break;
        case "COBEGIN":
          tokens.push({ type: TokenType.COBEGIN, value: word });
          break;
        case "COEND":
          tokens.push({ type: TokenType.COEND, value: word });
          break;
        default:
          if (/^[A-Z]$/.test(word)) {
            tokens.push({ type: TokenType.IDENTIFIER, value: word });
          } else {
            throw new Error(`Unexpected token: ${word}`);
          }
      }
    }
  }

  return tokens;
}

class Parser {
  private tokens: Token[];
  private current: number = 0;
  private usedIdentifiers: Set<string> = new Set();

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode {
    const ast = this.parseBlock();
    return ast;
  }

  private parseBlock(): ASTNode {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of input");

    switch (token.type) {
      case TokenType.BEGIN:
        return this.parseSequential();
      case TokenType.COBEGIN:
        return this.parseParallel();
      case TokenType.IDENTIFIER:
        this.advance();
        if (this.usedIdentifiers.has(token.value)) {
          throw new Error(`Identifier '${token.value}' has already been used`);
        }
        this.usedIdentifiers.add(token.value);
        return createValueNode(token.value);
      default:
        throw new Error(`Unexpected token: ${token.value}`);
    }
  }

  private parseSequential(): StructureNode {
    this.consume(TokenType.BEGIN, "Expected 'BEGIN'");
    const children: ASTNode[] = [];

    while (this.peek() && this.peek()!.type !== TokenType.END) {
      children.push(this.parseBlock());
    }

    this.consume(TokenType.END, "Expected 'END'");
    return createStructureNode(NodeType.SEQ, children);
  }

  private parseParallel(): StructureNode {
    this.consume(TokenType.COBEGIN, "Expected 'COBEGIN'");
    const children: ASTNode[] = [];

    while (this.peek() && this.peek()!.type !== TokenType.COEND) {
      children.push(this.parseBlock());
    }

    this.consume(TokenType.COEND, "Expected 'COEND'");
    return createStructureNode(NodeType.PAR, children);
  }

  private peek(): Token | null {
    if (this.current >= this.tokens.length) return null;
    return this.tokens[this.current];
  }

  private advance(): Token {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of input");
    this.current++;
    return token;
  }

  private consume(type: TokenType, errorMessage: string): Token {
    const token = this.peek();
    if (!token || token.type !== type) {
      throw new Error(errorMessage);
    }
    return this.advance();
  }
}

function parseProgram(input: string): ASTNode {
  const tokens = tokenize(input);
  const parser = new Parser(tokens);
  return parser.parse();
}

export { parseProgram };
