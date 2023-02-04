import formidable from "formidable";
import fs from "fs";
import api from '../../components/API';
export const config = {
  api: {
    bodyParser: false
  }
};


const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    let api = await process(fields, files.file);
    return res.status(200).send(api);
  });
};

const process = async (fields, file) => {
  
  return fields;
};


export default (req, res) => {
//	console.log('query:', req.query);
req.method === "POST"
? post(req, res)
: req.method === "PUT"
? console.log("PUT")
: req.method === "DELETE"
? console.log("DELETE")
: req.method === "GET"
? post(req, res)
: res.status(200).send({"status":"ok", "msg":"method not handled:" + req.method});

};