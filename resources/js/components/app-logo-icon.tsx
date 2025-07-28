interface AppLogoIconProps {
    className?: string;
}

export default function AppLogoIcon({ className }: AppLogoIconProps) {
    return (
        <img 
            src="/logo.jpg" 
            alt="Highland Technical Training Academy Logo" 
            className={className}
        />
    );
}