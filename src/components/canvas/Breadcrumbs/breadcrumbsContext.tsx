import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';

type BreadcrumbsContextProps = {
  breadcrumbs?: { title: string; link: string | null }[];
};

type Props = PropsWithChildren<Record<string, unknown>>;

export const BreadcrumbsContext = createContext<BreadcrumbsContextProps>({});

const BreadcrumbsContextProvider: FC<Props> = ({ children, ...rest }) => {
  const value = useMemo(() => ({ ...rest }), [rest]);
  return <BreadcrumbsContext.Provider value={value}>{children}</BreadcrumbsContext.Provider>;
};

export default BreadcrumbsContextProvider;

export const useBreadcrumbsContext = () => useContext(BreadcrumbsContext);
