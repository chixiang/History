# History
Case History

### 已知bug
- 维护子页面的【取消】和【确认】逻辑不正确
- 未输入性别、年龄时，列表苏北Title和患者信息头显示“- - 0岁”，生日显示1970-01-01
- Android 下拉刷新后，追加的条目无法左划
- 输入下方字段时，背景变白


### 待优化功能
- 病历展示界面和修改界面改为风格不一样的，以视觉区分
- 删除病历暂时未删除患者信息
- 病历子页面（例如患者信息）也可以直接点击右上角【修改】按钮进行修改操作
- 保存修改后，最好能够返回查看页面，且需要刷新。因为目前没有实现查看页面刷新，所以直接返回列表查询页面
- 住院号和门诊号是否考虑写在subTitle, remark留空
- subTitle 颜色加深一点


### 待新增功能
- 用户登录及权限控制
- 病历搜索
