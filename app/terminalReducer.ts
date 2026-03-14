import { TerminalLine } from './types/terminalLine';
import { WindowSizes } from './types/windowSizes';

export type State = {
  path: string;
  terminalContent: TerminalLine[];
  tooltipVisible: boolean;
  inputValue: string;
  windowSize: WindowSizes;
  commandStack: string[];
  commandStackPos: number;
  dragPosition: { x: number; y: number } | null;
  fixedSize: { width: number; height: number } | null;
  isAnimatingToMaximized: boolean;
  suppressTransition: boolean;
};

export type Action =
  | { type: 'SET_PATH'; path: string }
  | { type: 'ADD_LINES'; lines: TerminalLine[] }
  | { type: 'CLEAR_TERMINAL' }
  | { type: 'SET_TOOLTIP_VISIBLE'; visible: boolean }
  | { type: 'SET_INPUT'; value: string }
  | { type: 'SET_WINDOW_SIZE'; size: WindowSizes }
  | { type: 'PUSH_COMMAND'; command: string }
  | { type: 'SET_COMMAND_STACK_POS'; pos: number }
  | { type: 'INIT_DRAG'; x: number; y: number; width: number; height: number }
  | { type: 'UPDATE_DRAG'; x: number; y: number }
  | { type: 'INIT_RESIZE'; x: number; y: number; width: number; height: number }
  | { type: 'UPDATE_RESIZE'; width: number; height: number }
  | { type: 'BEGIN_MAXIMIZE_ANIMATION' }
  | { type: 'SET_MAXIMIZE_TARGET'; width: number; height: number }
  | { type: 'END_MAXIMIZE_ANIMATION' }
  | { type: 'RESTORE_TRANSITION' };

export const initialState: State = {
  path: '/',
  terminalContent: [],
  tooltipVisible: false,
  inputValue: '',
  windowSize: WindowSizes.Normal,
  commandStack: [],
  commandStackPos: 0,
  dragPosition: null,
  fixedSize: null,
  isAnimatingToMaximized: false,
  suppressTransition: false,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PATH':
      return { ...state, path: action.path };
    case 'ADD_LINES':
      return { ...state, terminalContent: [...state.terminalContent, ...action.lines] };
    case 'CLEAR_TERMINAL':
      return { ...state, terminalContent: [[]], inputValue: '' };
    case 'SET_TOOLTIP_VISIBLE':
      return { ...state, tooltipVisible: action.visible };
    case 'SET_INPUT':
      return { ...state, inputValue: action.value };
    case 'SET_WINDOW_SIZE':
      return { ...state, windowSize: action.size };
    case 'PUSH_COMMAND':
      return { ...state, commandStack: [...state.commandStack, action.command], commandStackPos: 0 };
    case 'SET_COMMAND_STACK_POS':
      return { ...state, commandStackPos: action.pos };
    case 'INIT_DRAG':
      return {
        ...state,
        dragPosition: state.dragPosition ?? { x: action.x, y: action.y },
        fixedSize: state.fixedSize ?? { width: action.width, height: action.height },
      };
    case 'UPDATE_DRAG':
      return { ...state, dragPosition: { x: action.x, y: action.y } };
    case 'INIT_RESIZE':
      return {
        ...state,
        dragPosition: state.dragPosition ?? { x: action.x, y: action.y },
        fixedSize: { width: action.width, height: action.height },
      };
    case 'UPDATE_RESIZE':
      return { ...state, fixedSize: { width: action.width, height: action.height } };
    case 'BEGIN_MAXIMIZE_ANIMATION':
      return { ...state, isAnimatingToMaximized: true };
    case 'SET_MAXIMIZE_TARGET':
      return { ...state, dragPosition: { x: 0, y: 0 }, fixedSize: { width: action.width, height: action.height } };
    case 'END_MAXIMIZE_ANIMATION':
      return { ...state, isAnimatingToMaximized: false, dragPosition: null, fixedSize: null, suppressTransition: true };
    case 'RESTORE_TRANSITION':
      return { ...state, suppressTransition: false };
    default:
      return state;
  }
}