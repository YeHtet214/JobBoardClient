import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  imageSrc?: string;
  imagePosition?: 'left' | 'right';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  imageSrc = '../assets/auth-background-alt.svg', // Default image
  imagePosition = 'left',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 relative overflow-hidden">
      {/* Background pattern - visible on all screen sizes */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true" />
      
      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" aria-hidden="true" />
      
      {/* Mobile layout */}
      <div className="lg:hidden relative min-h-screen">
        {/* Background image with gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80"
          style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden="true"
        />
        
        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          {/* Title section */}
          <div className="w-full max-w-md text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          {/* Form section */}
          <div className="w-full max-w-md backdrop-blur-md bg-background/80 rounded-xl p-6 shadow-lg border border-primary/10">
            {children}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:!flex min-h-screen w-full relative">
        {/* Background image that spans the entire width with gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden="true"
        />
        
        {/* Gradient overlay spanning the entire width */}
        <div 
          className={`absolute inset-0 ${
            imagePosition === 'left'
              ? 'bg-gradient-to-r from-background via-background/90 to-transparent'
              : 'bg-gradient-to-l from-background via-background/90 to-transparent'
          }`}
          aria-hidden="true"
        />
        
        {/* Content container */}
        <div className="flex flex-row w-full relative z-10">
          {/* Info section - conditionally ordered */}
          <div 
            className={`w-1/2 flex items-center justify-center p-12 ${
              imagePosition === 'right' ? 'order-first' : 'order-last'
            }`}
          >
            <div className={`
              max-w-md p-8 rounded-2xl 
              ${imagePosition === 'left' 
                ? 'bg-gradient-to-l from-transparent to-primary/5 backdrop-blur-sm' 
                : 'bg-gradient-to-r from-transparent to-primary/5 backdrop-blur-sm'
              }
            `}>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">{title}</h1>
              <p className="text-xl text-muted-foreground">{subtitle}</p>
              
              {/* Decorative element */}
              <div className="mt-8 h-1 w-24 bg-gradient-to-r from-primary to-primary/30 rounded-full"></div>
            </div>
          </div>

          {/* Form section */}
          <div className={`w-1/2 flex items-center justify-center p-12 ${
            imagePosition === 'left' ? 'order-first' : 'order-last'
          }`}>
            <div className="w-full max-w-md bg-background/95 backdrop-blur-md rounded-xl shadow-xl p-6 border border-primary/10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
