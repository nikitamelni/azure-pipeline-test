import { FC } from 'react';
import { FlexibleHeroProps } from '.';
import { DemoHero } from './demo-hero';

export const FlexibleHero: FC<FlexibleHeroProps> = props => <DemoHero {...props} isFlexibleHero={true} />;

export default FlexibleHero;
