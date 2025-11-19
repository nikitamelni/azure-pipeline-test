import { FC } from 'react';
import { useUniformContext } from '@uniformdev/context-react';
import BaseThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { ThemeSwitcherProps } from '.';

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ iconColor }) => {
  const { context } = useUniformContext();

  const onChangeTheme = (theme: string) => {
    context?.update({
      quirks: {
        theme,
      },
    });
  };

  return <BaseThemeSwitcher iconColor={iconColor} onChange={onChangeTheme} />;
};

export default ThemeSwitcher;
