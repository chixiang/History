# History
Case History

### 已知bug
- 左划删除按钮无效果
- 未输入住院号和门诊号时列表显示“（门）”
- 未输入性别、年龄时，患者信息头显示“袁某某 - - 0岁”，生日显示1970-01-01
- Android 下拉刷新后，追加的条目无法左划
- 列表刷新逻辑优化，目前某些情况下可能会两次刷新
- 输入下方字段时，背景变白


### 待优化功能
- 跳转到修改页面效果时间缩短一点，可尝试400
- 每页都加阴影效果，页面切换时可以看到
- 删除病历暂时未删除患者信息
- 按钮效果，点击操作增加反馈
- 保存修改等操作增加等待
- 病历子页面（例如患者信息）也可以直接点击右上角【修改】按钮进行修改操作
- 病历及子页面使用多种控件方便录入及修改
- 保存修改后，最好能够返回查看页面，且需要刷新。因为目前没有实现查看页面刷新，所以直接返回列表查询页面
- 住院号和门诊号是否考虑写在subTitle, remark留空
- subTitle 颜色加深一点


### 待新增功能
- 用户登录及权限控制
- 病历搜索