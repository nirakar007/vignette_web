import { useCanvas } from '../CanvasContext';

const SelectionTool = () => {
  const { dispatch } = useCanvas();
  
  return (
    <button
      onClick={() => dispatch({ type: 'SET_TOOL', payload: 'select' })}
      className="p-2 hover:bg-gray-100 rounded-lg"
      title="Selection Tool (V)"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    </button>
  );
};

export default SelectionTool;