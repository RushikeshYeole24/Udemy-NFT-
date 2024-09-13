import { FunctionComponent, ReactNode } from "react";

interface BaseLayoutProps {
    children: ReactNode;
}

const BaseLayout: FunctionComponent<BaseLayoutProps> = ({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
}

export default BaseLayout;
