import React, {useRef, useState} from "react";
import http from "../../http-common";
import QA from "./QA";


const Article = ({setMessage, setActiveTab, activeTab   }) => {
    const articleRef = useRef();
    const [label, setLabel] = useState('Generate Story');
    const [answer, setAnswer] = useState(undefined);
    let data = [];
    if(answer) data = answer;

    const ask = () => {
        let formData = new FormData();
        setLabel('Wait...');
        formData.append("question", articleRef.current.value);
        
        http.post( "http://35.222.116.79/qa", formData, {}).then((response) => {
            setLabel('Generate Story');
            let data = response.data;
            if(data.status === "ok"){
                setActiveTab('tab2');
                setAnswer(data.data);
            }
          })
          .catch(() => {

          });
    };

    const reset = () => {
        articleRef.current.value = '';
    };

    const addnew = (q, a) => {
        const newQA = {  question: q, answer: a };
        setAnswer([...data, newQA]);
    };

    const remove = (id) => {
        const remaingdata = data.filter((r, key) => id !== key);
        setAnswer(remaingdata);
    };



    return (
        <>
        <div className={"tab-pane " + (activeTab == 'tab1'? 'active': '')} id="tab1">
            <div className="article">
                <textarea type="text" className="form-control"  aria-label="" ref={articleRef} aria-describedby="basic-addon2" 
                id="question" placeholder="Paste text from an article ...">
                   
                </textarea>
                <button className="btn btn-primary" type="button" id="question_submit" onClick={ask}>{label}</button>
                <button className="btn btn-primary" type="button" id="reset" onClick={reset}>Reset</button>
            </div>
        </div>
        <div className={"tab-pane " + (activeTab == 'tab2'? 'active': '')} id="tab2">

            <div id="answers">
                <div id="qg">{data.map((q, i) => {  
                            
                    return (<QA key={i} answer={q.generated_text}  />)})}
                </div>
            </div>

        </div>
        </>
    );
  
  };
  
  export default Article;
