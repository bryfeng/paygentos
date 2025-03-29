import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer,
  hoverable = false,
  icon
}) => {
  const hoverStyles = hoverable ? 'transform transition-transform hover:scale-105 hover:shadow-lg' : '';
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverStyles} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
