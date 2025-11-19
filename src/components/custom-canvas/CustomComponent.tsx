import { FC } from 'react';
import { UniformSlot, UniformText } from '@uniformdev/canvas-react';
import { ComponentProps } from '@uniformdev/canvas-react';

// Here, you can add parameters to be used on the canvas side.
export type CustomComponentParameters = {
  displayName?: string;
};
// Here, you can add slots names to be used on the canvas side.
enum CustomComponentSlots {
  CustomComponentContent = 'customComponentContent',
}

type CustomComponentProps = ComponentProps<CustomComponentParameters>;

const CustomComponent: FC<CustomComponentProps & CustomComponentParameters> = () => (
  // Your implementation of the component logic
  <div>
    <UniformText placeholder="Text goes here" parameterId="displayName" as="h1" />
    <UniformSlot name={CustomComponentSlots.CustomComponentContent} />
  </div>
);

export default CustomComponent;
