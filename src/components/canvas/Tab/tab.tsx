import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { TabProps, TabSlots } from '.';

const Tab: FC<TabProps> = () => <UniformSlot name={TabSlots.TabContent} />;

export default Tab;
