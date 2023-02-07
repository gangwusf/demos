import React, {useRef, useState} from "react";
import http from "../../http-common";
import QA from "./QA";


const Article = ({setMessage,  url   }) => {
    const articleRef = useRef();
    const [label, setLabel] = useState('Generate Story');
    const [answer, setAnswer] = useState(undefined);
    let data = [];
    if(answer) data = answer;

    const ask = () => {
        let formData = new FormData();
        setLabel('Wait...');
        formData.append("question", articleRef.current.value);
        
        http.post( url + "/qa", formData, {}).then((response) => {
            setLabel('Generate Story');
            let data = response.data;
            if(data.status === "ok"){
               
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
            <div id="answers">
                <div id="qg">{data.map((q, i) => {  
                            
                    return (<QA key={i} answer={q.generated_text} url={url} />)})}
                </div>
            </div>

            <div className="article">
                <textarea type="text" className="form-control"  aria-label="" ref={articleRef} aria-describedby="basic-addon2" 
                id="question" placeholder=" ...">
                   
                </textarea>
                <button className="btn btn-primary" type="button" id="question_submit" onClick={ask}>{label}</button>
                <button className="btn btn-primary" type="button" id="reset" onClick={reset}>Reset</button>
            </div>





        
        </>
    );
  
  };
  
  export default Article;
