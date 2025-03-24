import { Link } from "react-router-dom";
import LogoSvg from '../../../assets/images/Logo.svg';
export const Logo = ({ className, width = '70px', height = 'auto' }: {
    className?: string;
    width?: string;
    height?: string;
}) => {
    return (
        <Link to="/" className={className}>
            <img src={LogoSvg} alt="logo" style={{ width, height }} />
        </Link>
    );
}