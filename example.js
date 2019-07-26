function initialize() {
return new Promise(function(resolve, reject) {
	resolve()
	console.log("what the hell")
for(var i=0; i< 10; i++) {
	console.log("-----------------------");
	a = 10
	b = 10
	setTimeout(()=>{
		console.log("timer expired")
	}, 1000)
	console.log(a+b)
}
})
}
