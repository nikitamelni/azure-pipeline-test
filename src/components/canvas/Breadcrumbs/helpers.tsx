import { BreadcrumbsParameters } from '.';

export const getSeparator = (separator: BreadcrumbsParameters['separator']) => {
  switch (separator) {
    case 'slash':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 20.247 6-16.5" />
        </svg>
      );
    case 'chevron':
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      );
  }
};
