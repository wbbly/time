import ReactDOM from 'react-dom';

const ModalPortal = props => ReactDOM.createPortal(props.children, document.body);

export default ModalPortal;
