aliyun
===============

> 运行环境要求PHP7.1+，兼容PHP8.0。

>thinkphp6.0
>阿里云的账号

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