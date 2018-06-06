###1.
["1", "2", "3"].map(parseInt)
    
    解释：该题目的答案为：[1, NaN, NaN]；即选择D。该题用到了map与parseInt；parseInt() 函数的语法是parseInt(string, radix)；
    string 必需。要被解析的字符串。
    radix可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。
    如果省略该参数或其值为 0，则数字将以 10 为基础来解析。如果它以 “0x” 或 “0X” 开头，将以 16 为基数。
    如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。
    
    实际上 map里面的callback函数接受的是三个参数 分别为元素 下标和数组 (虽然很多情况只使用第一个参数)
    
    回调函数的语法如下所示：
    function callbackfn(value, index, array1)
    可使用最多三个参数来声明回调函数。
    
    例：
    var a=["1", "2", "3", "4","5",6,7,8,9,10,11,12,13,14,15]; 
    a.map(parseInt); 
    返回结果为：[1, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 9, 11, 13, 15, 17, 19]
    
### 2.
[typeof null, null instanceof Object]的结果是\[\"objcet\", false\]
######考察typeof运算符和instanceof运算符，上MDN上看一下typeof运算符，一些基础类型的结果为：

    Undefined "undefined"
    Null "object"
    Boolean "boolean"
    Number "number"
    String "string"
    Any other object "object"
    Array "object"

###3.











点击查看[原文](https://segmentfault.com/a/1190000012375705)

