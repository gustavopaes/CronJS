CronJS

Examples:
execute.every("5 seconds", myFunction);
setInterval(myFunction, 5000);

execute.every("5 minutes", myFunction);
setInterval(myFunction, 300000);

execute.after("30 seconds", myFunction);
setTimeout(myFunction, 30000);

Controlling:
var myCron = execute.every("5 seconds", myFunction);
myCron.stop();
myCron.play();

