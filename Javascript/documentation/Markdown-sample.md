# title1
## title2
### title3
#### title4
###### title6

* 1
>  1:
this is 
>> 2:
this is 2

*   A list item with a blockquote:

    > This is a blockquote
    
    >inside a list item.
    
    
Here is an example of AppleScript:

    tell application "Foo"
        beep
    end tell
    
This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

See my [About](/about/) page for details.

This is [an example][id] reference-style link.

This is [an example] [id] reference-style link.

[id]: http://example.com/  "Optional Title Here"

###### 链接内容定义的形式为：

* 方括号（前面可以选择性地加上至多三个空格来缩进），里面输入链接文字
* 接着一个冒号
* 接着一个以上的空格或制表符
* 接着链接的网址
* 选择性地接着 title 内容，可以用单引号、双引号或是括弧包着

###### 强调
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

###### 代码
Use the `printf()` function.

如果要在代码区段内插入反引号，你可以用多个反引号来开启和结束代码区段：
``There is a literal backtick (`) here.``

Please don't use any `<blink>` tags.


行内式的图片语法看起来像是：

![Alt text](/path/to/img.jpg)

![Alt text](/path/to/img.jpg "Optional title")
######详细叙述如下：

- 一个惊叹号 !
- 接着一个方括号，里面放上图片的替代文字
- 接着一个普通括号，里面放上图片的网址，最后还可以用引号包住并加上 选择性的 'title' 文字。

——————————————————

##### 更多详细内容，点击查看[原文](https://www.appinn.com/markdown/)
