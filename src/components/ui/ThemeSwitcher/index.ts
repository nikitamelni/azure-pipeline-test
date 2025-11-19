import dynamic from 'next/dynamic';

export type ThemeSwitcherProps = {
  iconColor?: string;
  onChange?: (theme: string) => void;
};

export default dynamic(() => import('./theme-switcher').then(mod => mod.ThemeSwitcher));
