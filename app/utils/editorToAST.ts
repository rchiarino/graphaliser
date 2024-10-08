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
  line: number;
  startColumn: number;
  endColumn: number;
}

class ParserError extends Error {
  line: number;
  startColumn: number;
  endColumn: number;

  constructor(
    message: string,
    line: number,
    startColumn: number,
    endColumn: number
  ) {
    super(`${message}`);
    this.line = line;
    this.startColumn = startColumn;
    this.endColumn = endColumn;
  }
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const lines = input.split("\n");

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    let currentIndex = 0;

    while (currentIndex < line.length) {
      // Skip leading whitespace while keeping track of column
      while (currentIndex < line.length && /\s/.test(line[currentIndex])) {
        currentIndex++;
      }

      if (currentIndex >= line.length) break;

      // Find the next word
      const wordMatch = line.slice(currentIndex).match(/^\S+/);
      if (!wordMatch) break;

      const word = wordMatch[0];
      const startColumn = currentIndex + 1; // 1-based column indexing
      const endColumn = startColumn + word.length - 1;

      switch (word) {
        case "BEGIN":
          tokens.push({
            type: TokenType.BEGIN,
            value: word,
            line: lineNum + 1,
            startColumn,
            endColumn,
          });
          break;
        case "END":
          tokens.push({
            type: TokenType.END,
            value: word,
            line: lineNum + 1,
            startColumn,
            endColumn,
          });
          break;
        case "COBEGIN":
          tokens.push({
            type: TokenType.COBEGIN,
            value: word,
            line: lineNum + 1,
            startColumn,
            endColumn,
          });
          break;
        case "COEND":
          tokens.push({
            type: TokenType.COEND,
            value: word,
            line: lineNum + 1,
            startColumn,
            endColumn,
          });
          break;
        default:
          if (/^[A-Z]$/.test(word)) {
            tokens.push({
              type: TokenType.IDENTIFIER,
              value: word,
              line: lineNum + 1,
              startColumn,
              endColumn,
            });
          } else {
            throw new ParserError(
              `Unexpected token: ${word}`,
              lineNum + 1,
              startColumn,
              endColumn
            );
          }
      }

      currentIndex += word.length;
    }
  }

  return tokens;
}

class Parser {
  private tokens: Token[];
  private current: number = 0;
  private usedIdentifiers: Map<string, Token> = new Map();

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private getLastToken(): Token | null {
    return this.tokens.length > 0 ? this.tokens[this.tokens.length - 1] : null;
  }

  parse(): ASTNode {
    return this.parseBlock();
  }

  private parseBlock(): ASTNode {
    const token = this.peek();
    if (!token) {
      const lastToken = this.getLastToken();
      throw new ParserError(
        "Unexpected end of input",
        lastToken?.line || 1,
        lastToken?.startColumn || 1,
        lastToken?.endColumn || 1
      );
    }

    switch (token.type) {
      case TokenType.BEGIN:
        return this.parseSequential();
      case TokenType.COBEGIN:
        return this.parseParallel();
      case TokenType.IDENTIFIER:
        this.advance();
        const previousUse = this.usedIdentifiers.get(token.value);
        if (previousUse) {
          throw new ParserError(
            `Identifier '${token.value}' has already been used on line ${previousUse.line}`,
            token.line,
            token.startColumn,
            token.endColumn
          );
        }
        this.usedIdentifiers.set(token.value, token);
        return createValueNode(token.value);
      default:
        throw new ParserError(
          `Unexpected token: ${token.value}`,
          token.line,
          token.startColumn,
          token.endColumn
        );
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

  private consume(type: TokenType, errorMessage: string): Token {
    const token = this.peek();
    if (!token || token.type !== type) {
      const lastToken = this.getLastToken();
      throw new ParserError(
        errorMessage,
        token?.line || lastToken?.line || 1,
        token?.startColumn || lastToken?.startColumn || 1,
        token?.endColumn || lastToken?.endColumn || 1
      );
    }
    return this.advance();
  }

  private advance(): Token {
    const token = this.peek();
    if (!token) {
      const lastToken = this.getLastToken();
      throw new ParserError(
        "Unexpected end of input",
        lastToken?.line || 1,
        lastToken?.startColumn || 1,
        lastToken?.endColumn || 1
      );
    }
    this.current++;
    return token;
  }
}

function parseProgram(input: string): ASTNode {
  try {
    const tokens = tokenize(input);
    const parser = new Parser(tokens);
    return parser.parse();
  } catch (error: unknown) {
    if (error instanceof ParserError) {
      throw error;
    }
    // If it's not our custom error type, wrap it with line 1
    // Ensure error is treated as Error instance if possible
    if (error instanceof Error) {
      throw new ParserError(error.message, 1, 1, 9999);
    }
    // If it's some other type of value, convert to string
    throw new ParserError(String(error), 1, 1, 9999);
  }
}

export { parseProgram, ParserError };
