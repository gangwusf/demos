import Header from '../components/Header';

/**
 * This is the main component for setting up page layout
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Layout = props => {
    let style = props.clean ? {padding:0, margin:0, position:'relative', top:'-50px'}: {};
    return (
        <div className={"body-container flex-container-col"}>
            <Header currentMenu={props.currentMenu} title={props.title}/>
            <div className={"main-content"} style={style}>{props.children}</div>
            <footer> </footer>
        </div>
    )
}

export default Layout
