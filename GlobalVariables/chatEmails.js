let email1 = "";
let email2 = "";

const setEmail1 = (value)=>{
    email1 = value;
}

const setEmail2 = (value)=>{
    email2 = value;
}

const getEmail1 = ()=> email1;
const getEmail2 = ()=> email2;

module.exports = {
    setEmail1,setEmail2,
    getEmail1,getEmail2
};