import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="htta-logo-bg flex aspect-square size-8 items-center justify-center rounded-lg text-white">
                <AppLogoIcon className="size-6 fill-current" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-white">
                    Highland Technical
                </span>
                <span className="text-xs text-white/80">
                    Training Academy INC
                </span>
            </div>
        </>
    );
}