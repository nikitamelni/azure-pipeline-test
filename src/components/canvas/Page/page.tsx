import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BasePage from '@/components/ui/Page';
import { PageProps, CommonPageSlots } from '.';

const Page: FC<PageProps> = ({ backgroundColor }) => (
  <BasePage
    backgroundColor={backgroundColor}
    header={<UniformSlot name={CommonPageSlots.PageHeader} emptyPlaceholder={<div className="h-40" />} />}
    footer={<UniformSlot name={CommonPageSlots.PageFooter} emptyPlaceholder={<div className="h-40" />} />}
  >
    <UniformSlot name={CommonPageSlots.PageContent} emptyPlaceholder={<div className="h-[calc(100vh-10rem*2)]" />} />
  </BasePage>
);

export default Page;
