function test(){
    let a = "sda";
}
(() => {
    console.log("test function"); 
    var arr = ["1","b","c"];
   
        console.log(...arr);
})()