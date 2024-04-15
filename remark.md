<!--
 * @Author: yjl
 * @Date: 2024-04-10 09:53:00
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-15 16:45:45
 * @Description: 描述
-->
# 更换 npm 官方镜像
npm config set registry http://registry.npmjs.org/

# 发布流程
1. pnpm build  
2. pnpm publish(pnpm publish --no-git-checks跳过git检查 npm publish --tag feature 指定分支发布)