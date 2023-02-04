
const api = async (content, type) => {
  //http://34.71.40.213:3001/
        const res = await fetch(`http://34.68.5.207:3001/` + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: content
        })
        const data = await res.json();
        //console.log(data);
        return data;
};

export default api;
