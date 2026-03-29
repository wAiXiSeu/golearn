import type { Position, GameState, BoardState } from '../types/game';

// SGF Node represents a single node in the SGF tree
export type SGFNode = {
  properties: Record<string, string[]>;
  children: SGFNode[];
};

// SGF Game represents a complete game with metadata
export type SGFGame = {
  gm: number;           // Game type (1 = Go)
  ff: number;          // File format version
  sz: number;          // Board size
  pb?: string;         // Black player name
  pw?: string;         // White player name
  br?: string;         // Black rank
  wr?: string;         // White rank
  bt?: string;         // Black team
  wt?: string;         // White team
  km?: number;         // Komi
  ru?: string;         // Rules
  re?: string;         // Result
  dt?: string;         // Date
  ev?: string;         // Event
  pc?: string;         // Place
  gn?: string;         // Game name
  on?: string;         // Opening
  gc?: string;         // Game comment
  so?: string;         // Source
  us?: string;         // User
  an?: string;         // Annotation
  cp?: string;         // Copyright
  root: SGFNode;       // Root node with moves
};

// Parsed SGF result
export type ParsedSGF = {
  game: SGFGame;
  moves: SGFMove[];
  variations: SGFVariation[];
};

// SGF Move representation
export type SGFMove = {
  position: Position | 'pass';
  color: 'black' | 'white';
  comment?: string;
  annotations?: string[];
};

// SGF Variation branch
export type SGFVariation = {
  moves: SGFMove[];
  comment?: string;
};

// SGF Parse Error
export class SGFParseError extends Error {
  position?: number;
  constructor(message: string, position?: number) {
    super(message);
    this.name = 'SGFParseError';
    this.position = position;
  }
}

// Coordinate conversion utilities
export function positionToSGF(pos: Position, boardSize: number): string {
  if (pos.x < 0 || pos.x >= boardSize || pos.y < 0 || pos.y >= boardSize) {
    return '';
  }
  const colChar = String.fromCharCode(97 + pos.x); // 'a' + x
  const rowChar = String.fromCharCode(97 + pos.y); // 'a' + y
  return colChar + rowChar;
}

export function sgfToPosition(sgfCoord: string, boardSize: number): Position | null {
  if (!sgfCoord || sgfCoord.length !== 2) {
    return null;
  }
  const x = sgfCoord.charCodeAt(0) - 97; // 'a' = 97
  const y = sgfCoord.charCodeAt(1) - 97;
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return null;
  }
  return { x, y };
}

// Parse SGF property value (handles escapes)
function parsePropertyValue(value: string): string {
  return value
    .replace(/\\]/g, ']')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
}

// Tokenize SGF string into properties
function tokenizeSGF(sgf: string): { type: 'property' | 'value'; data: string }[] {
  const tokens: { type: 'property' | 'value'; data: string }[] = [];
  let i = 0;
  
  while (i < sgf.length) {
    // Skip whitespace
    if (/\s/.test(sgf[i])) {
      i++;
      continue;
    }
    
    // Property name (uppercase letters)
    if (/[A-Z]/.test(sgf[i])) {
      let propName = '';
      while (i < sgf.length && /[A-Z]/.test(sgf[i])) {
        propName += sgf[i];
        i++;
      }
      tokens.push({ type: 'property', data: propName });
      continue;
    }
    
    // Property value in brackets
    if (sgf[i] === '[') {
      i++; // Skip opening bracket
      let value = '';
      while (i < sgf.length) {
        if (sgf[i] === '\\' && i + 1 < sgf.length) {
          value += sgf[i] + sgf[i + 1];
          i += 2;
        } else if (sgf[i] === ']') {
          i++; // Skip closing bracket
          break;
        } else {
          value += sgf[i];
          i++;
        }
      }
      tokens.push({ type: 'value', data: parsePropertyValue(value) });
      continue;
    }
    
    // Parentheses for tree structure
    if (sgf[i] === '(' || sgf[i] === ')') {
      tokens.push({ type: 'property', data: sgf[i] });
      i++;
      continue;
    }
    
    // Semicolon for node separator
    if (sgf[i] === ';') {
      tokens.push({ type: 'property', data: ';' });
      i++;
      continue;
    }
    
    // Unknown character, skip
    i++;
  }
  
  return tokens;
}

// Parse SGF tree structure
function parseSGFTree(tokens: { type: 'property' | 'value'; data: string }[], index: number): { node: SGFNode; nextIndex: number } {
  const root: SGFNode = { properties: {}, children: [] };
  let currentNode: SGFNode = root;
  let currentProperty = '';
  
  while (index < tokens.length) {
    const token = tokens[index];
    
    if (token.type === 'property') {
      if (token.data === '(') {
        // Start of variation - parse recursively
        const childResult = parseSGFTree(tokens, index + 1);
        currentNode.children.push(childResult.node);
        index = childResult.nextIndex;
      } else if (token.data === ')') {
        // End of variation
        return { node: root, nextIndex: index + 1 };
      } else if (token.data === ';') {
        // New node
        if (Object.keys(currentNode.properties).length > 0 || currentNode.children.length > 0) {
          const newNode: SGFNode = { properties: {}, children: [] };
          currentNode.children.push(newNode);
          currentNode = newNode;
        }
        index++;
      } else {
        // Property name
        currentProperty = token.data;
        if (!currentNode.properties[currentProperty]) {
          currentNode.properties[currentProperty] = [];
        }
        index++;
      }
    } else if (token.type === 'value' && currentProperty) {
      // Property value
      currentNode.properties[currentProperty].push(token.data);
      index++;
    } else {
      index++;
    }
  }
  
  return { node: root, nextIndex: index };
}

// Extract game metadata from root node
function extractGameMetadata(root: SGFNode): Partial<SGFGame> {
  const props = root.properties;
  
  return {
    gm: props.GM ? parseInt(props.GM[0], 10) : 1,
    ff: props.FF ? parseInt(props.FF[0], 10) : 4,
    sz: props.SZ ? parseInt(props.SZ[0], 10) : 19,
    pb: props.PB?.[0],
    pw: props.PW?.[0],
    br: props.BR?.[0],
    wr: props.WR?.[0],
    bt: props.BT?.[0],
    wt: props.WT?.[0],
    km: props.KM ? parseFloat(props.KM[0]) : undefined,
    ru: props.RU?.[0],
    re: props.RE?.[0],
    dt: props.DT?.[0],
    ev: props.EV?.[0],
    pc: props.PC?.[0],
    gn: props.GN?.[0],
    on: props.ON?.[0],
    gc: props.GC?.[0],
    so: props.SO?.[0],
    us: props.US?.[0],
    an: props.AN?.[0],
    cp: props.CP?.[0],
  };
}

// Extract moves from SGF tree
function extractMoves(node: SGFNode, boardSize: number): SGFMove[] {
  const moves: SGFMove[] = [];
  
  // Check for black move
  if (node.properties.B && node.properties.B.length > 0) {
    const coord = node.properties.B[0];
    const position = coord === '' ? 'pass' : sgfToPosition(coord, boardSize);
    if (position !== null) {
      moves.push({
        position,
        color: 'black',
        comment: node.properties.C?.[0],
        annotations: node.properties.N,
      });
    }
  }
  
  // Check for white move
  if (node.properties.W && node.properties.W.length > 0) {
    const coord = node.properties.W[0];
    const position = coord === '' ? 'pass' : sgfToPosition(coord, boardSize);
    if (position !== null) {
      moves.push({
        position,
        color: 'white',
        comment: node.properties.C?.[0],
        annotations: node.properties.N,
      });
    }
  }
  
  // Process children (main line only for moves)
  if (node.children.length > 0) {
    moves.push(...extractMoves(node.children[0], boardSize));
  }
  
  return moves;
}

// Extract variations from SGF tree
function extractVariations(node: SGFNode, boardSize: number): SGFVariation[] {
  const variations: SGFVariation[] = [];
  
  // If there are multiple children, they are variations
  if (node.children.length > 1) {
    for (let i = 1; i < node.children.length; i++) {
      const variationMoves = extractMoves(node.children[i], boardSize);
      if (variationMoves.length > 0) {
        variations.push({
          moves: variationMoves,
          comment: node.children[i].properties.C?.[0],
        });
      }
    }
  }
  
  // Recursively check children
  if (node.children.length > 0) {
    variations.push(...extractVariations(node.children[0], boardSize));
  }
  
  return variations;
}

// Main parseSGF function
export function parseSGF(sgfString: string): ParsedSGF {
  if (!sgfString || typeof sgfString !== 'string') {
    throw new SGFParseError('Invalid SGF: empty or non-string input');
  }
  
  // Trim and validate basic structure
  const trimmed = sgfString.trim();
  if (!trimmed.startsWith('(') || !trimmed.endsWith(')')) {
    throw new SGFParseError('Invalid SGF: must start with ( and end with )');
  }
  
  // Tokenize
  const tokens = tokenizeSGF(trimmed);
  if (tokens.length === 0) {
    throw new SGFParseError('Invalid SGF: no valid tokens found');
  }
  
  // Parse tree
  const { node: root } = parseSGFTree(tokens, 0);
  
  // Extract metadata
  const metadata = extractGameMetadata(root);
  
  // Validate game type
  if (metadata.gm !== 1) {
    throw new SGFParseError(`Invalid SGF: not a Go game (GM=${metadata.gm})`);
  }
  
  // Validate board size
  const validSizes = [9, 13, 19];
  if (metadata.sz && !validSizes.includes(metadata.sz)) {
    throw new SGFParseError(`Invalid SGF: unsupported board size ${metadata.sz}`);
  }
  
  const boardSize = metadata.sz || 19;
  
  // Build game object
  const game: SGFGame = {
    gm: metadata.gm || 1,
    ff: metadata.ff || 4,
    sz: boardSize,
    pb: metadata.pb,
    pw: metadata.pw,
    br: metadata.br,
    wr: metadata.wr,
    bt: metadata.bt,
    wt: metadata.wt,
    km: metadata.km,
    ru: metadata.ru,
    re: metadata.re,
    dt: metadata.dt,
    ev: metadata.ev,
    pc: metadata.pc,
    gn: metadata.gn,
    on: metadata.on,
    gc: metadata.gc,
    so: metadata.so,
    us: metadata.us,
    an: metadata.an,
    cp: metadata.cp,
    root,
  };
  
  // Extract moves and variations
  const moves = extractMoves(root, boardSize);
  const variations = extractVariations(root, boardSize);
  
  return { game, moves, variations };
}

// Create empty board
function createEmptyBoard(size: number): BoardState {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

// Convert SGF moves to game state
export function sgfToGameState(parsed: ParsedSGF): GameState {
  const { game, moves } = parsed;
  const boardSize = game.sz as 9 | 13 | 19;
  const board = createEmptyBoard(boardSize);
  
  const gameState: GameState = {
    boardSize,
    board,
    currentPlayer: 'black',
    moves: [],
    captures: { black: 0, white: 0 },
    koPoint: null,
    passCount: 0,
    isGameOver: false,
  };
  
  // Apply moves (simplified - doesn't handle captures properly, just records positions)
  for (const move of moves) {
    if (move.position === 'pass') {
      gameState.passCount++;
      if (gameState.passCount >= 2) {
        gameState.isGameOver = true;
      }
    } else {
      const { x, y } = move.position;
      if (board[y] && board[y][x] === null) {
        board[y][x] = move.color;
        gameState.moves.push({
          position: move.position,
          color: move.color,
          captured: [],
        });
      }
    }
    gameState.currentPlayer = move.color === 'black' ? 'white' : 'black';
  }
  
  // Add metadata
  if (game.re) {
    gameState.result = game.re;
    if (game.re.includes('B+')) {
      gameState.winner = 'black';
    } else if (game.re.includes('W+')) {
      gameState.winner = 'white';
    }
  }
  
  return gameState;
}

// Escape SGF property value
function escapePropertyValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\]/g, '\\]');
}

// Generate SGF property
function generateProperty(name: string, values: string[]): string {
  if (!values || values.length === 0) return '';
  return values.map(v => `${name}[${escapePropertyValue(v)}]`).join('');
}



// Generate SGF from game state
export function generateSGF(gameState: GameState, metadata?: Partial<SGFGame>): string {
  const boardSize = gameState.boardSize;
  
  let sgf = '(';
  
  // Root node with metadata
  sgf += ';';
  sgf += generateProperty('GM', ['1']);
  sgf += generateProperty('FF', ['4']);
  sgf += generateProperty('SZ', [String(boardSize)]);
  
  // Add metadata
  if (metadata?.pb) sgf += generateProperty('PB', [metadata.pb]);
  if (metadata?.pw) sgf += generateProperty('PW', [metadata.pw]);
  if (metadata?.br) sgf += generateProperty('BR', [metadata.br]);
  if (metadata?.wr) sgf += generateProperty('WR', [metadata.wr]);
  if (metadata?.km !== undefined) sgf += generateProperty('KM', [String(metadata.km)]);
  if (metadata?.ru) sgf += generateProperty('RU', [metadata.ru]);
  if (metadata?.dt) sgf += generateProperty('DT', [metadata.dt]);
  if (metadata?.ev) sgf += generateProperty('EV', [metadata.ev]);
  if (metadata?.pc) sgf += generateProperty('PC', [metadata.pc]);
  if (metadata?.gn) sgf += generateProperty('GN', [metadata.gn]);
  if (metadata?.gc) sgf += generateProperty('GC', [metadata.gc]);
  if (metadata?.so) sgf += generateProperty('SO', [metadata.so]);
  if (metadata?.us) sgf += generateProperty('US', [metadata.us]);
  if (metadata?.an) sgf += generateProperty('AN', [metadata.an]);
  if (metadata?.cp) sgf += generateProperty('CP', [metadata.cp]);
  
  // Add result if game is over
  if (gameState.isGameOver && gameState.result) {
    sgf += generateProperty('RE', [gameState.result]);
  }
  
  // Add moves
  for (const move of gameState.moves) {
    sgf += ';';
    const coord = positionToSGF(move.position, boardSize);
    sgf += move.color === 'black' ? `B[${coord}]` : `W[${coord}]`;
  }
  
  sgf += ')';
  
  return sgf;
}

// Generate SGF from SGFGame and moves
export function generateSGFFromGame(game: SGFGame, moves: SGFMove[], variations?: SGFVariation[]): string {
  const boardSize = game.sz;
  
  let sgf = '(';
  
  // Root node with metadata
  sgf += ';';
  sgf += generateProperty('GM', [String(game.gm)]);
  sgf += generateProperty('FF', [String(game.ff)]);
  sgf += generateProperty('SZ', [String(boardSize)]);
  
  if (game.pb) sgf += generateProperty('PB', [game.pb]);
  if (game.pw) sgf += generateProperty('PW', [game.pw]);
  if (game.br) sgf += generateProperty('BR', [game.br]);
  if (game.wr) sgf += generateProperty('WR', [game.wr]);
  if (game.km !== undefined) sgf += generateProperty('KM', [String(game.km)]);
  if (game.ru) sgf += generateProperty('RU', [game.ru]);
  if (game.re) sgf += generateProperty('RE', [game.re]);
  if (game.dt) sgf += generateProperty('DT', [game.dt]);
  if (game.ev) sgf += generateProperty('EV', [game.ev]);
  if (game.pc) sgf += generateProperty('PC', [game.pc]);
  if (game.gn) sgf += generateProperty('GN', [game.gn]);
  if (game.gc) sgf += generateProperty('GC', [game.gc]);
  if (game.so) sgf += generateProperty('SO', [game.so]);
  if (game.us) sgf += generateProperty('US', [game.us]);
  if (game.an) sgf += generateProperty('AN', [game.an]);
  if (game.cp) sgf += generateProperty('CP', [game.cp]);
  
  // Add moves
  for (const move of moves) {
    sgf += ';';
    
    if (move.position === 'pass') {
      sgf += move.color === 'black' ? 'B[]' : 'W[]';
    } else {
      const coord = positionToSGF(move.position, boardSize);
      sgf += move.color === 'black' ? `B[${coord}]` : `W[${coord}]`;
    }
    
    if (move.comment) {
      sgf += `C[${escapePropertyValue(move.comment)}]`;
    }
  }
  
  // Add variations (simplified - appends at end)
  if (variations && variations.length > 0) {
    for (const variation of variations) {
      sgf += '(';
      for (const move of variation.moves) {
        sgf += ';';
        
        if (move.position === 'pass') {
          sgf += move.color === 'black' ? 'B[]' : 'W[]';
        } else {
          const coord = positionToSGF(move.position, boardSize);
          sgf += move.color === 'black' ? `B[${coord}]` : `W[${coord}]`;
        }
      }
      sgf += ')';
    }
  }
  
  sgf += ')';
  
  return sgf;
}

// Helper: Convert board state to SGF setup (for puzzles)
export function boardToSGFSetup(board: BoardState, boardSize: number): { black: string[]; white: string[] } {
  const black: string[] = [];
  const white: string[] = [];
  
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const stone = board[y][x];
      if (stone === 'black') {
        black.push(positionToSGF({ x, y }, boardSize));
      } else if (stone === 'white') {
        white.push(positionToSGF({ x, y }, boardSize));
      }
    }
  }
  
  return { black, white };
}

// Helper: Parse SGF setup stones (AB, AW properties)
export function sgfSetupToBoard(setupBlack: string[], setupWhite: string[], boardSize: number): BoardState {
  const board = createEmptyBoard(boardSize);
  
  for (const coord of setupBlack) {
    const pos = sgfToPosition(coord, boardSize);
    if (pos) {
      board[pos.y][pos.x] = 'black';
    }
  }
  
  for (const coord of setupWhite) {
    const pos = sgfToPosition(coord, boardSize);
    if (pos) {
      board[pos.y][pos.x] = 'white';
    }
  }
  
  return board;
}

// Validate SGF string
export function isValidSGF(sgfString: string): boolean {
  try {
    parseSGF(sgfString);
    return true;
  } catch {
    return false;
  }
}

// Get move at specific position from SGF
export function getMoveAtPosition(parsed: ParsedSGF, index: number): SGFMove | null {
  if (index < 0 || index >= parsed.moves.length) {
    return null;
  }
  return parsed.moves[index];
}

// Get all comments from SGF
export function getComments(parsed: ParsedSGF): { moveIndex: number; comment: string }[] {
  const comments: { moveIndex: number; comment: string }[] = [];
  
  parsed.moves.forEach((move, index) => {
    if (move.comment) {
      comments.push({ moveIndex: index, comment: move.comment });
    }
  });
  
  return comments;
}