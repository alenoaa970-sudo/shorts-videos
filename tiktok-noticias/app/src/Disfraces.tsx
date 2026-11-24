import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Robot, Costume } from './Robot';

// Lámina para revisar todos los disfraces del robot
const LIST: [Costume, any][] = [
  ['anchor', { arm: 'thumb', expression: 'happy' }], ['boxing', { arm: 'punch', expression: 'happy' }],
  ['vest', { arm: 'down', expression: 'serious' }], ['raincoat', { arm: 'hold', item: 'umbrella', expression: 'happy' }],
  ['baby', { arm: 'hold', item: 'bottle', expression: 'stars' }], ['helmet', { arm: 'down', expression: 'serious' }],
  ['diplomat', { arm: 'hold', item: 'flags', expression: 'hearts' }], ['astronaut', { arm: 'thumb', expression: 'wink' }],
  ['business', { arm: 'hold', item: 'briefcase', expression: 'happy' }], ['firefighter', { arm: 'down', expression: 'serious' }],
  ['judge', { arm: 'hold', item: 'gavel', expression: 'serious' }],
  ['deputy', { arm: 'down', expression: 'serious' }], ['conductor', { arm: 'thumb', expression: 'happy' }],
  ['officer', { arm: 'down', expression: 'serious' }], ['riot', { arm: 'thumb', expression: 'happy' }], ['navy', { arm: 'down', expression: 'serious' }],
  ['rescuer', { arm: 'down', expression: 'serious' }], ['eco', { arm: 'thumb', expression: 'happy' }], ['maritime', { arm: 'down', expression: 'serious' }],
];
export const Disfraces: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#1b2f6e' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {LIST.map(([c, cfg], i) => (
          <g key={c} transform={`translate(${(i % 3) * 360} ${Math.floor(i / 3) * 480}) scale(0.32) translate(20 120)`}>
            <Robot t={t} talk={0} timer="1:00" blink={0} costume={c} {...cfg} />
            <text x={540} y={-40} textAnchor="middle" fontSize={90} fill="#fff" fontFamily="sans-serif">{c}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
