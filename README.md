aliyun
===============

> 运行环境要求PHP7.1+，兼容PHP8.0。

>thinkphp6.0
>阿里云的账号

## 工作流程
* 打开public/index.html文件
* 调用同目录下的upload.js
* upload.js自动从后端路由/aliyun/getsts index/Getsts方法获取阿里云的sts授权信息
* 点击上传按钮,获取图片信息,js自动上传并把上传后的图片信息调用addimg(url)方法
* vue.js加了一个addimg方法绑定到this.addimg到vue的方法,实现把上传后的数据绑定到vue的方法
* 再通过vue的for循环把数据显示在前端页面
* 前端VUE方法再实现数据的删改(前端删除并不会删除oss上的源文件)
* 最后tj方法实现把整个页面的数据传到后端,实现整个流程

## 要改的地方

获取用户的sts信息请参考阿里云 https://help.aliyun.com/document_detail/100624.html 
* app/controller/Index.php 修改阿里云账号密码信息
* public/upload.js 修改信息
* vendor/aliyuncs/sts-server/config.json 修改信息
以上信息正常上传即可正常上传

## 主要文件
* app/controller/Index.php 的getsts方法,获取sts信息
* public/upload.js  lib目录上传的一些依赖文件
* vendor/aliyuncs里面的阿里云依赖文件

public/index.html 文件请自行去修改,部分用到了vue.js   
其中upload.js 175行方法接收到图片后,会在175行调用addimg方法,这个方法大家可以自行进行修改适配
