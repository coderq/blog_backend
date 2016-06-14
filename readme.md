# 个人技术博客后端

## 设想与构建
个人技术博客主要用于存储个人平日技术积累与展示。该后端数据源与[http://coderq.github.io](http://coderq.github.io)内容一致，同属于一个仓库中的markdown文件集。

## 版本

- 0.0.1 基于koa框架，基于es6语法，基于markdown文件数据源，文件存储于source文件夹，通过build方法，将源数据解析成系统能识别的数据，并存储在三个数据文件中，分别为存储于db文件夹下的：article.json、tag.json、type.json；提供多个服务接口，包括文章列表接口、文章详情接口、头部信息借口。