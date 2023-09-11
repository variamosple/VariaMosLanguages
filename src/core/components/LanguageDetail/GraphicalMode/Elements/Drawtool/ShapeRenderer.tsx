import { useEffect, useRef } from 'react';
import factory from 'mxgraph';

const mxBasePath = 'assets/mxgraph';
const mxgraph = factory({ mxBasePath });

export default function ShapeRenderer({ shapeXml }) {
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);
  let graph = useRef(null);

  useEffect(() => {
    graph.current = new mxgraph.mxGraph(graphContainerRef.current);


    graph.current.getModel().beginUpdate();
    try {
      graph.current.removeCells(graph.current.getChildVertices(graph.current.getDefaultParent()));
      if (shapeXml) {
        const xmlDoc = mxgraph.mxUtils.parseXml("<shapes>" + shapeXml + "<shapes/>");
        const shape = xmlDoc.documentElement;

        const stencil = new mxgraph.mxStencil(shape);
        mxgraph.mxStencilRegistry.addStencil('customShape', stencil);

        const parent = graph.current.getDefaultParent();
        const vertex = graph.current.insertVertex(
          parent,
          null,
          '',
          120,
          100,
          200,
          200,
          'shape=customShape;'
        );

        stencil.drawShape(graph.current, vertex, 0, 0, 100, 100);
      }
    } catch (error) {
      console.error('Error while parsing shape XML:', error);
    } finally {
      graph.current.getModel().endUpdate();
    }

    return () => {
      graph.current.destroy();
    };
  }, [shapeXml]);

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <div ref={graphContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
};

