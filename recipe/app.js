const Express=require('express');
var app=new Express();
var bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
const session=require('express-session');
app.use(session({secret: 'ssshhhhh'}));
app.set('view engine','ejs');
app.use(Express.static(__dirname+"/public"));
var request=require('request');
var mongoose=require('mongoose');
var nav=[{
    item:"Home",
    link:"/"

},
{
    item:"Registration",
    link:"/registration"
}];
mongoose.connect("mongodb://localhost:27017/recipe");
var LoginModel=mongoose.model("login",{
    username:String,
    password:String,
    utype:String
});
var RegistrationModel=mongoose.model("registration",{
    name:String,
    mailid:String,
    password:String
});
app.get('/',(req,res)=>
{
    res.render('index',{title:"home",nav:nav});
});
app.get('/index',(req,res)=>
{
    res.render('index',{title:"home",nav:nav});
});

app.get('/registration',(req,res)=>{
    res.render('registration',{nav:nav,title:"Registration",val:"",emsg:""});
});
app.get('/login',(req,res)=>{
    res.render('login',{title:"Login page"});
});
app.get('/admin',(req,res)=>
{
    res.render('admin');
});
app.get('/user',(req,res)=>
{
    res.render('user');
})
//Read and save data from Registration page
app.post('/RegistrationApi',(req,res)=>
{
var regdata=new RegistrationModel(req.body);
var logdata=new LoginModel();
logdata.username=regdata.mailid;
logdata.password=regdata.password;
logdata.utype="user";

//---------------------------------------------

// //Save data to login collection

var resultlog=logdata.save((error)=>
{
    if(error)
    {
        throw error;
    }
    else{
        console.log(logdata);
    }
});
// //----------------------------------------------
//Save data to registration collection
var result=regdata.save((error)=>
{
   if(error)
   {
       throw error;
   }
   else{
       console.log(regdata);
       console.log("Name:"+regdata.name);
       console.log("Mailid"+regdata.mailid);
   }
});
 res.send("<script> window.location.href='/registration' </script>");
});

//---------------------------------------------------------------------

//Checking mail id already exist or not
app.get('/checkMailIdApi/:id',(req,res)=>
{
    var mail=req.params.id;
    var result=RegistrationModel.find({mailid:mail},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else
        {
           
           res.send(data);

        }
    });

});
//Check login details
var sess;
app.post('/readlogin',(req,res)=>{
sess=req.session;
sess.username=req.body.username;
sess.password=req.body.password;
console.log("Username:"+sess.username);
console.log("Password:"+sess.password);
var result=LoginModel.find({$and:[{username:sess.username},{password:sess.password}]},(error,data)=>{
    if(error)
    {
        throw error;
    }
    else{
        if(data.length==1)
        {
            console.log("usertpe:"+data.utype);
           // console.log(data);
           if(data.utype=="user")
           {
                res.send("<script> window.location.href='/user' </script>");

           }
           else{
            res.send("<script> window.location.href='/admin' </script>");
           }
        }
    }
});


})





app.listen(process.env.PORT || 3000,()=>
{
    console.log("Server is running on localhost 3000");
});