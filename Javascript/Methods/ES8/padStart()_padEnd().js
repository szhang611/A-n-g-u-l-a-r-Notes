// ### 字符串填充：padStart和padEnd

// ES8提供了新的字符串方法-padStart和padEnd。padStart函数通过填充字符串的首部来保证字符串达到固定的长度，反之，padEnd是填充字符串的尾部来保证字符串的长度的。该方法提供了两个参数：字符串目标长度和填充字段，其中第二个参数可以不填，默认情况下使用空格填充。

'Vue'.padStart(10)           //'       Vue'
'React'.padStart(10)         //'     React'
'JavaScript'.padStart(10)    //'JavaScript'
 

// 可以看出，多个数据如果都采用同样长度的padStart，相当于将呈现内容右对齐。

// 上面示例中我们只定义了第一个参数，那么我们现在来看看第二个参数，我们可以指定字符串来代替空字符串。

'Vue'.padStart(10, '_*')           //'_*_*_*_Vue'
'React'.padStart(10, 'Hello')      //'HelloReact'
'JavaScript'.padStart(10, 'Hi')    //'JavaScript'
'JavaScript'.padStart(8, 'Hi')     //'JavaScript'
 

// 从上面结果来看，填充函数只有在字符长度小于目标长度时才有效，若字符长度已经等于或小于目标长度时，填充字符不会起作用，而且目标长度如果小于字符串本身长度时，字符串也不会做截断处理，只会原样输出。

// padEnd函数作用同padStart，只不过它是从字符串尾部做填充。来看个小例子：

'Vue'.padEnd(10, '_*')           //'Vue_*_*_*_'
'React'.padEnd(10, 'Hello')      //'ReactHello'
'JavaScript'.padEnd(10, 'Hi')    //'JavaScript'
'JavaScript'.padEnd(8, 'Hi')     //'JavaScript'


