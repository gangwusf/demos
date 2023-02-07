import React, {useRef, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from '../../components/Layout';
import Message from "../../components/Message";
import Article from "./Article";
import { getDemoConfigWithId } from '../../utils';

function App() {
  const demoData = getDemoConfigWithId('ctrl');

  const [message, setMessage] = useState(undefined);
  const [activeTab, setActiveTab] = useState('tab1');

  return (
		<Layout currentMenu={"/ctrl"} title={demoData.name}>
			<style> 
				{`
				.container-fluid {
					margin-top:-40px;
				}
				
				.page-header {
					text-align:left;
					margin-bottom:20px;
					position:fixed;
					top:0;
					left:0;
					height:50px;
					background:#fff;
					width:100%;
					padding:9px 10px;
				
					border-bottom: 1px solid rgba(0,0,0,.1);
					box-shadow: 0 1px 8px 0 rgb(0 0 0 / 20%);
				}
				
				.page-header img {
					height:32px;
					margin-left: 100px;
				}
				
				.page-header .title {
					border-left:2px solid #c6c7c9;
					padding:6px 10px;
					margin-left:10px;
					color:#06394e;
					font-weight: bold;
					letter-spacing:-0.1em;
				}
				
				
				.nav-tabs {
					border:none;
				}
				
				.nav-tabs .nav-link:hover {
					border:1px solid #fff;
				}
				
				.landscape {
				
					width:100%;
					margin-top: 50px;
				}
				
				.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
					border:none;
				}
				
				a.nav-link {
					color:grey;
				}
				
				a.nav-link.active {
					color:#000;
					font-weight: bold;
				}
				
				.chatbox {
					margin:6px 0px 20px 10px;
					padding:20px;
					border:1px solid #dee2e6;
					height:504px;
					overflow:scroll;
				}
				
				#answers {
					
				}
				
				#qg {
					margin-bottom: 30px;
					overflow:scroll;
					height:460px;
					border-radius: 10px;
					box-shadow: 0 2px 2px 2px rgb(0 0 0 / 20%);
				
					min-height:60px;
					padding:20px;
				}
				
				.custom-file {
					margin-left:10px;
					width:80px;
				}
				
				.custom-file-label {
				}
				
				#tabs {
					margin:0 auto;
					width:70%;
				}
				
				.tab-content{
				
				}
				
				.container {
					height:100%;
				
				}
				
				.question label, .answer label{
					color:#076f9a;
					font-weight: bold;
				}
				
				
				.answer {
				   
					margin-bottom:20px;
					margin-top:-15px;
				}
				
				#tab1 label {
						font-style:italic;
				}
				
				#abstractive {
					margin-bottom:20px;
					border:1px solid #dee2e6;
					padding:20px;
					min-height:60px;
				}
				
				#extractive {
					border:1px solid #dee2e6;
					padding:20px 10px 10px 0px;
					min-height:60px;
				}
				
				#question_submit, #reset, #new_qa{
					margin-top: 40px;
					float:right;
				}
				
				
				
				.btn-primary {
					background-color:#0d64c1;
				}
				
				 #reset, #new_qa, #add {
					border:1px solid #ced4da;
					width:100px;
				}
				
				
				
				#qg img {
					float:right;
					margin:20px;
					position:relative;
					top:-70px;
					right:0px;
					cursor: pointer;
				
				}
				
				#qg div{
					background-color: #eee;
					padding:16px;
					margin-bottom:8px;
					border-radius: 10px;
				}
				
				#qg p {
				
				}
				
				#download {
					
					float: right;
					right:60px;
					top:-560px;
					position:relative;
					
					color:rgb(10, 92, 163);
					cursor: pointer;
					font-weight: bold;
					font-size:0.8em;
				}
				
				#reset {
					margin-right:10px;
				}
				
				
				
				#dialog .row {
					padding:10px 0;
					border-bottom:1px solid #dee2e6;
				}
				
				#dialog .row .col-md-2{
					font-size:.6em;
					text-align:center;
					width:36px;
				}
				
				#dialog .row .col-md-2 svg{
					font-size:2.6em;
					text-align:center;
				}
				
				
				label.btn.btn-file {
					position: relative;
					overflow: hidden;
					width:200px;
					margin:20px 20px 0 10px;
					border-bottom:1px solid #ced4da;
					display: block;
						background:#179bd5;
						color:white;
					font-size:12px;
				}
				
				
				footer {
					position:fixed;
					bottom:0px;
					right:0px;
					padding:6px 20px;
					color:grey;
					font-size:8px;
					z-index: -100;
				}
				
				#dialog .row:hover{
					background:#eee;
				}
				
				.alert button{
					font-size:18px;
				}
				
				#root .alert {
					z-index:1000;
					font-size:12px;
					position:fixed;
					right:20px;
					top:20px;
					width:250px;
					padding:4px 10px;
				}
				
				.tab-pane .article {
					box-shadow: 0 2px 2px 2px rgb(0 0 0 / 20%);
					border-radius: 10px;
					padding:20px;
					margin-bottom: 30px;
				}
				
				
				
				textarea#question {
					border:none;
					height:400px;
				
				}

				`}
			</style>
			<div className=" ">
				<div className="tabbable" id="tabs">
						<ul className="nav nav-tabs">
								<li className="nav-item">
										<a className={"nav-link " + (activeTab == 'tab1'? 'active': '')}
										href="#tab1" data-toggle="tab" onClick={()=>setActiveTab('tab1')}>Prompt</a>
								</li>
								<li className="nav-item">
										<a className={"nav-link " + (activeTab == 'tab2'? 'active' : '')}
										href="#tab2" data-toggle="tab" onClick={()=>setActiveTab('tab2')}>Story</a>
								</li>
						</ul>
						<div className="tab-content">
							<Article setMessage={setMessage} setActiveTab={setActiveTab} activeTab={activeTab} />
						</div>
				</div>
			</div>

			<Message msg={message} setMessage={setMessage}/>
  
		</Layout>
  );
}

export default App;
