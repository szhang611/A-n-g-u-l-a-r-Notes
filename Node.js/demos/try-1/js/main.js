// const $ = jQuery;

window.onload = ()=>{

    function init () {
        document.getElementById('test').onclick = function(){
            let url = 'http://localhost:8000/api/cats/cat1';
            $.get(url).done((data)=>{
                console.log(data);
            }).catch((err)=>{
                console.error(err);
            })
        }
    }
 
    init();

};


