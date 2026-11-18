import React from 'react';
import { Composition } from 'remotion';
import { Noticias } from './Main';
import { TL } from './util';
import { Disfraces } from './Disfraces';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Noticias" component={Noticias} durationInFrames={TL.total} fps={30} width={1080} height={1920} />
    <Composition id="Disfraces" component={Disfraces} durationInFrames={30} fps={30} width={1080} height={1920} />
  </>
);
