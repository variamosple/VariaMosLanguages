import { useEffect, useRef } from 'react';
import factory from 'mxgraph';

const mxBasePath = 'assets/mxgraph';
const mxgraph = factory({ mxBasePath });

export default function ShapeRenderer({ style }) {
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);
  let graph = useRef(null);

  useEffect(() => {
    graph.current = new mxgraph.mxGraph(graphContainerRef.current);
  
    graph.current.getModel().beginUpdate();
    try {
      const parent = graph.current.getDefaultParent();
      
      // Inserting the first rectangle with style
      const rect1 = graph.current.insertVertex(
        parent,
        null,
        '',
        50,
        50,
        60,
        60,
        'shape=rectangle;fillColor=#CCCCCC;' // Customize as needed
      );
      
      // Inserting the second rectangle with style
      const rect2 = graph.current.insertVertex(
        parent,
        null,
        '',
        250,
        150,
        60,
        60,
        'shape=rectangle;fillColor=#CCCCCC;' // Customize as needed
      );
      
      // Creating the connector between rectangles
      const edge = graph.current.insertEdge(
        parent,
        null,
        '',
        rect1,
        rect2
      );
      if (1) {
        edge.setStyle(style);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      graph.current.getModel().endUpdate();
    }
  
    return () => {
      graph.current.destroy();
    }; 
  }, [style]);
  
  
  

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <div ref={graphContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
};

