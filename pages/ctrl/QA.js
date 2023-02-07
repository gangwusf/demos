import React from "react";
import { XCircleFill } from 'react-bootstrap-icons';

const QA = ({key, answer}) => {

	return <div key={key}>
	<p className="answer" >  {answer}</p> 
	 </div>

};

export default QA;
