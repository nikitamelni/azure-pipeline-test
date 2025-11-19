import { FC, useState, useMemo, useEffect } from 'react';
import { ComponentInstance } from '@uniformdev/canvas';
import {
  UniformSlot,
  UniformSlotWrapperComponentProps,
  useUniformContextualEditingState,
} from '@uniformdev/canvas-react';
import Container from '@/components/ui/Container';
import { TabsProps, TabsSlots } from '.';
import { getButtonClasses, getButtonContainerClasses, TabsVariants } from './style-utils';

const TAB_ITEM_TEXT_PARAMETER_ID = 'text';

export const getAllChildrenIds = (component: ComponentInstance) => {
  let ids: string[] = [component._id || '']; // Start with the current component's _id

  // Iterate over each key in the slots object
  for (const key in component.slots) {
    if (Object.prototype.hasOwnProperty.call(component.slots, key)) {
      const childComponents = component.slots[key];
      // Iterate over each component in the array
      childComponents?.forEach(childComponent => {
        ids = ids.concat(getAllChildrenIds(childComponent)); // Recursively collect ids from child components
      });
    }
  }

  return ids;
};

const Tabs: FC<TabsProps> = ({ color, backgroundColor, spacing, border, fluidContent, height, component }) => {
  const variant = component?.variant as TabsVariants;
  const { selectedComponentReference } = useUniformContextualEditingState({ global: true });

  const selectedSlotIndex = useMemo(() => {
    const tabs = component?.slots?.tabs;
    if (!selectedComponentReference?.id || !tabs) {
      return -1;
    }

    // Find the index of the tab containing the selected component
    return tabs.findIndex(tab => {
      const childrenIds = getAllChildrenIds(tab);
      return childrenIds.includes(selectedComponentReference.id);
    });
  }, [component?.slots?.tabs, selectedComponentReference?.id]);

  const tabs =
    component?.slots?.[TabsSlots.TabItems]?.map(tab => ({
      text: tab?.parameters?.[TAB_ITEM_TEXT_PARAMETER_ID]?.value as string,
      isActive: tab?.parameters?.isActive?.value as boolean,
    })) || [];

  const defaultActiveTabIndexFromCanvas = tabs?.findIndex(tab => tab.isActive);

  const defaultActiveTabIndex = defaultActiveTabIndexFromCanvas >= 0 ? defaultActiveTabIndexFromCanvas : 0;

  const [activeTabIndex, setActiveTabIndex] = useState<number>(defaultActiveTabIndex);

  useEffect(() => {
    if (selectedSlotIndex >= 0) {
      setActiveTabIndex(selectedSlotIndex);
    }
  }, [selectedComponentReference, selectedSlotIndex]);

  return (
    <Container className="flex flex-col gap-5" {...{ backgroundColor, spacing, border, fluidContent, height }}>
      <div className={getButtonContainerClasses({ color, variant })}>
        {tabs?.map((tab, index) => (
          <button
            id={tab.text}
            key={tab.text}
            onClick={() => setActiveTabIndex(index)}
            onFocus={() => setActiveTabIndex(index)}
            className={getButtonClasses({ color, variant, isActiveTab: index === activeTabIndex })}
          >
            <span>{tab.text}</span>
          </button>
        ))}
      </div>
      <UniformSlot
        name={TabsSlots.TabItems}
        emptyPlaceholder={<div className="h-20 w-full" />}
        wrapperComponent={({ items }: UniformSlotWrapperComponentProps) =>
          items[activeTabIndex] ?? <div>No Tab found</div>
        }
      />
    </Container>
  );
};

export default Tabs;
