// 点击下拉菜单外面，隐藏下拉菜单。


const HTML = `
    <button class="showBtn">显示菜单</button>
    <!-- 菜单默认不显示 -->
    <div class="menu">
        <ul>
        <li>菜单一</li>
        <li>菜单二</li>
        <li>菜单三</li>
        </ul> 
    </div>
`;

//点击“显示菜单”按钮时，显示菜单，并阻止事件冒泡
document
    .querySelector('.showBtn')
    .addEventListener('click', function(e){
        document.querySelector('.menu').classList.add('show');
        e.stopPropagation();//关键在于阻止冒泡
    }, false);

//点击“菜单”内部时，阻止事件冒泡。(这样点击内部时，菜单不会关闭)
document
    .querySelector('.menu')
    .addEventListener('click', function(e){
        e.stopPropagation();
    }, false);

//监听整个document的点击事件，如果能收到事件(说明点击源既不是“显示菜单”按钮，也不来自菜单内部)，就可以放心关闭菜单了
document
    .addEventListener('click', function(){
        document.querySelector('.menu').classList.remove('show');
    }, false);



// ------------------------------------------------------------------------------------------------------------


let dropDownEle = document.getElementById("drop-down");
let Btn = document.getElementById('btn');
/* 点击按钮时，显示下拉菜单 */
Btn.onclick = function(ev){
    let ev = ev || event;
    ev.stopPropagation();//阻止事件冒泡
    dropDownEle.style.display = 'block';
};
dropDownEle.onclick = function(ev){
    let ev = ev || event;
    ev.stopPropagation();//阻止事件冒泡
};
/* 点击非按钮的任意地方，隐藏下拉菜单 */
document.onclick = function(){
    dropDownEle.style.display = 'none';
};

