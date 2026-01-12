const readline = require('readline');
const r=readline.createInterface({input:process.stdin,output:process.stdout});
r.question('Enter the Name of Developoer',(name)=>{
    console.log('Hello ${name}');
    r.question('Enter the Project Name',(project)=>{
        console.log('Project Name is ${project}');
    });
    r.close();
});