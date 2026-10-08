// ejajtech — animation setup
(function () {
  // ---- Settings -------------------------------------------------------
  const CONFIG = {
    accent: '#C8F25A', // main glow color
    mint: '#7FE0C3',   // secondary node color
    speed: 1,          // 0.25 = slow, 1 = normal, 3 = fast
    nodeCount: 12,     // points around the circle
    radius: 38         // node distance from center (0–50)
  };

  // Optional URL overrides, e.g. index.html?speed=2&accent=FFC857
  const params = new URLSearchParams(location.search);
  if (params.has('speed')) CONFIG.speed = Math.max(0.1, parseFloat(params.get('speed')) || 1);
  if (params.has('accent')) CONFIG.accent = '#' + params.get('accent').replace('#', '');

  const root = document.documentElement.style;
  root.setProperty('--accent', CONFIG.accent);
  root.setProperty('--mint', CONFIG.mint);
  root.setProperty('--speed', CONFIG.speed);

  // ---- Build the network ---------------------------------------------
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('network');
  const nodeLayer = document.getElementById('nodes');

  const points = Array.from({ length: CONFIG.nodeCount }, (_, i) => {
    const a = (i / CONFIG.nodeCount) * Math.PI * 2;
    return {
      x: 50 + CONFIG.radius * Math.cos(a),
      y: 50 + CONFIG.radius * Math.sin(a)
    };
  });

  // Faint outline connecting all nodes
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('points', points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '));
  polygon.setAttribute('fill', 'none');
  polygon.setAttribute('stroke', 'var(--line)');
  polygon.setAttribute('stroke-width', '0.3');
  polygon.setAttribute('class', 'polygon');
  svg.appendChild(polygon);

  // Spokes with dashes flowing outward from the core
  const spokes = document.createElementNS(SVG_NS, 'g');
  spokes.setAttribute('class', 'spokes');
  spokes.setAttribute('stroke', 'var(--accent)');
  spokes.setAttribute('stroke-width', '0.3');
  spokes.setAttribute('stroke-dasharray', '1.5 6.5');
  spokes.setAttribute('stroke-linecap', 'round');
  spokes.setAttribute('opacity', '0.55');
  points.forEach(p => {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', 50); line.setAttribute('y1', 50);
    line.setAttribute('x2', p.x.toFixed(2)); line.setAttribute('y2', p.y.toFixed(2));
    spokes.appendChild(line);
  });
  svg.appendChild(spokes);

  // Pulsing nodes, staggered around the circle
  points.forEach((p, i) => {
    const node = document.createElement('span');
    node.className = 'node';
    node.style.left = p.x + '%';
    node.style.top = p.y + '%';
    node.style.setProperty('--c', i % 3 === 0 ? 'var(--accent)' : 'var(--mint)');
    node.style.animationDelay = (i * 0.25 / CONFIG.speed).toFixed(2) + 's';
    nodeLayer.appendChild(node);
  });
})();
