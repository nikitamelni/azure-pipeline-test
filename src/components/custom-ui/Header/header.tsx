import { FC } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/utils/styling';
import { HeaderProps } from './';
import { DesktopHeader } from './desktop';

const MobileHeader = dynamic(() => import('./mobile').then(mod => mod.MobileHeader));

export const Header: FC<HeaderProps> = ({ sticky, ...headerProps }) => (
  <header className={cn({ 'fixed top-0 left-0 right-0 z-10': sticky })}>
    <div className="hidden md:block">
      <DesktopHeader {...headerProps} />
    </div>

    <div className="block md:hidden">
      <MobileHeader {...headerProps} />
    </div>
  </header>
);
