import Router, {useRouter} from 'next/router'
import NProgress from 'nprogress';

//Binding events for displaying loading when switching pages
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

/**
 * Define Link to use for set links
 *
 * @param children
 * @param href
 * @returns {JSX.Element}
 * @constructor
 */
const Link = ({children, href}) => {
    const router = useRouter()
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault()
                router.push(href)
            }}
        >
            {children}
        </a>
    )
}

/**
 *  Component for page header
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Header = (props) => {
    const isActive = (menu) => {
        return menu === props.currentMenu ? ' active' : '';
    };

  const title = props.title ? (<div><h1>{props.title}</h1><a href={"/demos"}><div className={"sub-title"}>Demos</div></a></div>)
      : (<a href={"/demos"}><h1 className={"left"}> Demos</h1></a>);

    return (
        <nav>
          <div className={"left"}>{title}</div>
            <div className={"right"}>
                <a href="/demos" className="logo hide"> <img src="" width="100" height="68"/></a>
            </div>
        </nav>
    )
}

export default Header;
