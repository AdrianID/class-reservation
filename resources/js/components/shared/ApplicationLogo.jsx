export default function ApplicationLogo({ variant = "default", ...props }) {
    let logoSrc;

    switch (variant) {
        case "white-logo":
            logoSrc = "/images/logo4.svg";
            break;
        case "white-logo-box":
            logoSrc = "/images/logo2.svg";
            break;
        case "white-logo-text":
            logoSrc = "/images/logo3.svg";
            break;
        case "white-logo-cropped":
            logoSrc = "/images/logo-cropped.svg";
            break;
        case "colored-logo":
            logoSrc = "images/logo5.svg";
            break;
        case "default":
        default:
            logoSrc = "/images/logo.svg";
            break;
    }

    return <img {...props} src={logoSrc} alt="Logo" />;
}
