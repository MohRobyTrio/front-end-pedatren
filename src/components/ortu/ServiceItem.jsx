import { Link } from "react-router-dom";

const ServiceItem = ({ icon: Icon, title, subtitle, iconColor, className, href }) => {
  return (
    <Link to={href}>
    <div className={`flex flex-col items-center p-4 rounded-2xl bg-card hover:bg-muted/50 transition-colors cursor-pointer ${className || ''}`}>
      <div className={`mb-3 p-3 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon size={24} />
      </div>
      <p className="text-sm font-medium text-center text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground text-center">{subtitle}</p>
    </div>
    </Link>
  );
};

export default ServiceItem;