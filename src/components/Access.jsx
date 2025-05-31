import { hasAccess } from "../utils/hasAccess";

const Access = ({ action, children }) => {
  if (!hasAccess(action)) return null;
  return <>{children}</>;
};

export default Access;
