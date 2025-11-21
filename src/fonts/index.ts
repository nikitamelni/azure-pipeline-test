import localFont from 'next/font/local';

export const helveticaNeue = localFont({
  src: [
    {
      path: './custom-fonts/HelveticaNeueLTStd-Roman.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './custom-fonts/HelveticaNeueLTStd-Bd.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--helvetica-neue',
  display: 'swap',
  preload: true,
});

export const customFontVariables = [helveticaNeue.variable].join(' ');
