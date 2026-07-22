import type { ReactNode } from "react";


export interface AppLayoutProps {
  children?: ReactNode;
}


export interface LayoutOutletContext {
  dateRange?: {
    from: string;
    to: string;
  };
}
