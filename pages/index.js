import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={'profile ' +styles.container}>
      <style > {`
       .col-sm img {
        width:500px;
      }

      .profile {
        text-align: left;
        padding: 20px;
        font-family: Arial, Helvetica, sans-serif;
        width: 900px;
        margin: 0 auto;
      }

      .skills li{
        list-style-type: none;
        display:inline;
        width: 100px;
        padding: 10px;
        border: 1px solid #ccc;
        margin: 5px;
        border-radius: 15px;
      }

      label {
        font-weight: bold;
        margin: 20px 10px;
        font-size: 1.9em;
      }

      .col-sm p {
        font-size: 1.2em;
        font-weight: normal;
        padding: 10px;
      }
      `}
       
      </style>
      <Head>
        <title>Gang Wu</title>
        <meta name="description" content="Gang Wu Profile" />
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_FAVICON}/favicon.ico`}
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gang Wu</h1>
        <h4>I have Developed and managed web applications in Python, PHP, Java, Javascript, React.js, etc. 
          I am confident in my ability to contribute to your team's success.</h4>
        <label><a target="_blank" href="https://docs.google.com/document/d/1PfhEIvVMLcMTBpVccSNOGF0Ib5Whn3dB4M2bFAtN-Ns/edit">View My Resume</a></label>
        <label>My skills :</label>
        <ul className="skills">
          <li>Python</li>
          <li>PHP</li>
          <li>Java</li>
          <li>Javascript</li>
          <li>React.js</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>MySQL</li>
          <li>PostgreSQL</li>
          <li>Git</li>
          <li>Linux</li>
          <li>Apache</li>
          <li>Nginx</li>
          </ul>
        <label>My Profile:</label>
        <div class="row">
          <div class="col-sm"><a target="_blank" href="images/profile/linkedin.png"><img  src="images/profile/linkedin.png" /></a></div>
          <div class="col-sm"><p><a target="_blank" href="https://www.linkedin.com/in/whoisgang/">LinkedIn</a></p></div>
        </div>
        <label>My projects :</label>
        <div class="row">
        <div class="col-sm"><p><a target="_blank" href="https://www.salesforceairesearch.com/demos">Salesforce AI Research Demos</a></p></div>
          <div class="col-sm"><a target="_blank" href="images/profile/lavis.png"><img  src="images/profile/lavis.png"></img></a></div>
        </div>
        <div class="row">
          <div class="col-sm"><a target="_blank" href="images/profile/ccrp.png"><img  src="images/profile/ccrp.png"></img></a></div>
          <div class="col-sm"><a target="_blank" href="images/profile/ccrp.png"><p>Change Case Risk Predictions</p></a></div>
        </div>
        <div class="row">
        <div class="col-sm"><p><a target="_blank" href="https://www.salesforceairesearch.com/covid19_sim/index.html">Covid19 Simulation</a></p></div>
          <div class="col-sm"><a target="_blank" href="images/profile/covid.png"><img  src="images/profile/covid.png"></img></a></div>
        </div>
        <div class="row">
          <div class="col-sm"><a target="_blank" href="images/profile/ProcessMining.png"><img  src="images/profile/ProcessMining.png"></img></a></div>
          <div class="col-sm"><a target="_blank" href="images/profile/ProcessMining.png"><p>Process Mining</p></a></div>
        </div>
       
       
      </main>
    </div>
  );
}
