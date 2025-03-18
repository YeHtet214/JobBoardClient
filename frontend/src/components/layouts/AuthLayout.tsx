import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  imageSrc = '../assets/auth-background-alt.svg', // Default image
  imageAlt = 'Job Board Authentication',
  imagePosition = 'left',
}) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Image Section - Left position */}
      <img src={imageSrc} alt={imageAlt} className="" />
      {imagePosition === 'left' && (
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10"
            style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg max-w-md">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div 
        className={`flex items-center justify-center w-full p-8 ${
          imagePosition === 'left' ? 'lg:w-1/2' : 'lg:w-1/2 lg:order-first'
        }`}
      >
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>

      {/* Image Section - Right position */}
      {imagePosition === 'right' && (
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-l from-primary/20 to-primary/5 z-10"
            style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg max-w-md">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
